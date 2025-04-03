const express = require('express');
const router = express.Router();

const session = require("../controllers/session.js");
const admin = require("../controllers/admin.js");
const cliente = require("../controllers/cliente.js");
const facturas = require("../controllers/facturas.js");

const jwt = require('jsonwebtoken');

const db = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');

//#region Users
router.post("/register", userMiddleware.validateRegister, (req, res, next) =>
{
    session.register(req, res);
});

router.post("/login", userMiddleware.validateRegister, (req, res, next) =>
{
    session.login(req, res);
});
//#endregion

//#region Admin
router.get("/clientes", (req, res, next) =>
{
    //console.log("asd");
    admin.clientes(req, res);
});

router.post("/productos", userMiddleware.admin, (req, res, next) =>
{
    admin.crearProducto(req, res);
});

router.put("/productos", userMiddleware.admin, (req, res, next) =>
{
    admin.modificarProducto(req, res);
});
//#endregion

router.get("/productos", userMiddleware.logged, (req, res, next) =>
{
    cliente.productos(req, res);
});

router.get("/productos/:nombre", userMiddleware.logged, (req, res, next) =>
{
    cliente.buscar(req, res);
});

router.get("/productosId/:id", userMiddleware.logged, (req, res, next) =>
{
    cliente.productosPedido(req, res);
});

router.get("/facturas", userMiddleware.logged, (req, res, next) =>
{
    facturas.facturas(req, res);
});

router.get("/detalles/:id", userMiddleware.logged, (req, res, next) =>
{
    facturas.detalleFactura(req, res);
});

router.post("/facturas", userMiddleware.logged, (req, res, next) =>
{
    facturas.crearFactura(req, res);
});

module.exports = router;