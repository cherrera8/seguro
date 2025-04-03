const db = require('../lib/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports =
{
    register: (req, res) =>
    {
        db.query(
            "SELECT id FROM users WHERE LOWER(username) = LOWER(?)",
            [req.body.username],
            (err, result) =>
            {
                if (result && result.length)
                {
                    return res.status(409).send(
                    {
                        message: 'El nombre de usuario se encuentra en uso',
                    });
                }
                else
                {
                    bcrypt.hash(req.body.password, 10, (err, hash) =>
                    {
                        if (err)
                        {
                            return res.status(500).send(
                            {
                                message: err,
                            });
                        }
                        else
                        {
                            db.query(
                            'INSERT INTO users (username, password, nombre, rfc, celular, calle, numero, codigopostal, admin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, FALSE);',
                            [req.body.username, hash, req.body.nombre, req.body.rfc, req.body.celular, req.body.calle, req.body.numero, req.body.codigopostal],
                            (err, result) =>
                            {
                                if (err)
                                {
                                    return res.status(400).send(
                                    {
                                        message: err,
                                    });
                                }
                                return res.status(201).send(
                                {
                                    message: 'Usuario registrado correctamente',
                                });
                            });
                        }
                    });
                }
            }
        );
    },
    login: (req, res) =>
    {
        db.query(
            "SELECT * FROM users WHERE username = ?;",
            [req.body.username],
            (err, result) =>
            {
                if (err)
                {
                    return res.status(400).send(
                    {
                        message: err,
                    });
                }
                if (!result.length)
                {
                    return res.status(400).send(
                    {
                        message: 'El usuario no existe',
                    });
                }
                bcrypt.compare(req.body.password, result[0]['password'], (err2, res2) =>
                {
                    if (err2)
                    {
                        return res.status(400).send(
                        {
                            message: 'Contraseña incorrecta',
                        });
                    }
                    if (res2)
                    {
                        const token = jwt.sign(
                        {
                            username: result[0].username,
                            userId: result[0].id,
                        }, process.env.SECRET_KEY, { expiresIn: '7d' });
                        return res.status(200).send(
                        {
                            message: 'Sesión iniciada',
                            token : token,
                            user: result[0],
                            admin: result[0].admin
                        });
                    }
                    return res.status(400).send(
                    {
                        message: 'Username or password incorrect!',
                    });
                });
            }
        );
    }
}