const db = require('../lib/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports =
{
    productos: (req, res) =>
    {
        db.query(
            "SELECT * FROM productos;",
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
    buscar: (req, res) =>
    {
        db.query(
            "SELECT * FROM productos WHERE nombre LIKE ?;",
            [`${req.params.nombre}%`],
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
    productosPedido: (req, res) =>
    {
        db.query(
            "SELECT * FROM productos WHERE id = ?;",
            [req.params.id],
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
    }
}