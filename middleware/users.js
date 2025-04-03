const jwt = require("jsonwebtoken");

module.exports =
{
    validateRegister: (req, res, next) =>
    {
        if (!req.body.username || req.body.username.length < 1)
        {
            return res.status(400).send(
            {
                message: 'Introduce un nombre de usuario valido',
            });
        }
        if (!req.body.password || req.body.password.length < 1)
        {
            return res.status(400).send(
            {
                message: 'Introduce una contraseña valida',
            });
        }
        next();
    },
    logged: (req, res, next) =>
    {
        if (!req.headers.authorization)
        {
            return res.status(400).send(
            {
                message: "Sesión inválida"
            })
        }
        try
        {
            const authHeader = req.headers.authorization;
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.userData = decoded;
            next();
        }
        catch (err)
        {
            return res.status(400).send(
            {
                message: "Sesión inválida"
            });
        }
    },
    admin: (req, res, next) =>
    {
        const token = req.headers.authorization;
        if (!token)
        {
            return res.status(403).send('Token inexistente');
        }
        jwt.verify(token.split(' ')[1], process.env.SECRET_KEY, (err, decoded) => 
        {
            if (err) 
            {
                return res.status(401).send('Token inválido.');
            }
            if (decoded.admin == 0) 
            {
                return res.status(403).send('Acceso denegado');
            }
            req.user = decoded;
            next();
        });
    }
};