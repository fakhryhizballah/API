const express = require('express');
const app = express();
const {
    PORT = 3110
} = process.env;

const morgan = require('morgan');
app.use(morgan('dev'));
app.use(express.json());
app.use("/img", express.static("public/img"));

// welcome
app.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'welcome to learn how to handling data!',
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
});
