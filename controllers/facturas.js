const db = require('../lib/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports =
{
    facturas: (req, res) =>
    {
        let idUser = "";
        const token = req.headers.authorization;
        if (!token)
        {
            return res.status(403).send('Token no proporcionado');
        }
        jwt.verify(token.split(' ')[1], process.env.SECRET_KEY, (err, decoded) =>
        {
            if (err)
            {
                return res.status(401).send('Token inválido');
            }
            idUser = decoded.userId;
            //req.user = decoded;
        });
    
        db.query(
            'SELECT * FROM facturas WHERE idcliente = ?;',
            [idUser],
            (err, rows, fields) =>
            {
                if (err)
                {
                    res.json(err)
                }
                else if (rows.length > 0)
                {
                    
                    res.json(rows);
                }
            }
        );
    },
    detalleFactura: (req, res) =>
    {
        db.query(
            'SELECT * FROM vista_facturas_productos WHERE id = ?;',
            [req.params.id],
            (err, rows2, fields) =>
            {
                if (err)
                {
                    res.json(err);
                }
                else
                {
                    res.json(rows2);
                }
            }
        );
    },
    crearFactura: (req, res) =>
    {
        let idUser = "";
        const token = req.headers.authorization;
        if (!token)
        {
            return res.status(403).send('Token no proporcionado');
        }
        jwt.verify(token.split(' ')[1], process.env.SECRET_KEY, (err, decoded) =>
        {
            if (err)
            {
                return res.status(401).send('Token inválido');
            }
            idUser = decoded.userId;
            //req.user = decoded;
        });
    
        db.query(
            "INSERT INTO facturas (fecha, total, idcliente) VALUES (NOW(), 0, ?);",
            [idUser],
            (err, results) =>
            {
                if (!err)
                {
                    for (let i = 0; i < req.body.nombre.length; i++)
                    {
                        db.query(
                            "SELECT * FROM productos WHERE nombre = ?;",
                            [req.body.nombre[i]],
                            (err0, rows0, fields) =>
                            {
                                if (!err0)
                                {
                                    db.query(
                                        "INSERT INTO detallefactura (idproducto, idfactura, cantidad, costo) VALUES (?, ?, ?, ?);",
                                        [rows0[0].id, results.insertId, req.body.cantidad[i], req.body.costo[i] * req.body.cantidad[i]],
                                        (err2, rows2, fields) =>
                                        {
                                            if (i == req.body.nombre.length - 1)
                                            {
                                                res.json(rows2);
                                            }
                                            if (err2)
                                            {
                                                res.json(err2);
                                            }
                                        }
                                    );
                                }
                            }
                        );
                    }
                }
                else
                {
                    res.json(err)
                }
            }
        );
    }
}