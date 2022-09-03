const express = require('express');
const expressGa = require('express-ga-middleware');
const app = express();
var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/favicon.ico'));
require('dotenv').config();
const {
    PORT = 3110
} = process.env;

const morgan = require('morgan');
app.use(morgan('dev'));
app.use(express.json());
app.use(expressGa('G-MRYF58C8K7'));
app.use("/image", express.static("public/imagekit"));
app.use("/img/icon", express.static("public/img/icon"));
app.use("/img", express.static("public/img/cdn"));
// welcome
app.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'welcome to Content Delivery Network Spairum',
        data: null
    });
});

const routes = require('./routes');
app.use('/api', routes);

app.use(function (err, req, res, next) {
    res.status(500).json({
        status: false,
        message: err.message,
        data: null
    });
});

app.listen(PORT, () => {
    console.log('listening on port', PORT);
    console.log(process.env.baseURL);
});
