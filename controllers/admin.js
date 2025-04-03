const db = require('../lib/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports =
{
    clientes: (req, res) =>
    {
        db.query(
            "SELECT * FROM users;",
            (err, rows, fields) =>
            {
                if (err)
                {
                    res.json(err)
                }
                else
                {
                    res.json(rows)
                }
            }
        );
    },
    crearProducto: (req, res) =>
    {
        db.query(
            "INSERT INTO productos (nombre, cantidad, costo) VALUES (?, ?, ?);",
            [req.body.nombre, req.body.cantidad, req.body.costo],
            (err, rows, fields) =>
            {
                if (err)
                {
                    res.json(err)
                }
                else
                {
                    res.json(rows)
                }
            }
        );
    },
    modificarProducto: (req, res) =>
    {
        db.query(
            `UPDATE productos SET ${req.body.dato} = ? WHERE id = ?;`,
            [req.body.valor, req.body.id],
            (err, rows, fields) =>
            {
                if (err)
                {
                    res.json(err)
                }
                else
                {
                    res.json(rows)
                }
            }
        )
    }
}