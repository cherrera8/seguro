const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const router = require('./routes/router.js');
app.use('/', router);

app.use(express.static('public'));

app.listen(PORT, () => console.log(`Servidor ejecutándose en el puerto ${PORT}.`));