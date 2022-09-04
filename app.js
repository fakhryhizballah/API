const express = require('express');
const fetch = require('node-fetch');
// import fetch from 'node-fetch';
// const expressGa = require('express-ga-middleware');
const app = express();
var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/favicon.ico'));
require('dotenv').config();
const {
    PORT = 3110
} = process.env;
const { GA_TRACKING_ID } = process.env;
const morgan = require('morgan');
app.use(morgan('dev'));
app.use(express.json());
app.enable('trust proxy');
// app.use(expressGa('G-MRYF58C8K7'));
app.use("/image", express.static("public/imagekit"));
app.use("/img/icon", express.static("public/img/icon"));
app.use("/img", express.static("public/img/cdn"));
app.use("/imgs", async (req, res, next) => {
    console.log('image');
    // console.log(req.hostname);
    console.log(req.ip);
    console.log(req.path);
    console.log(req.hostname);
    console.log(req.headers['user-agent']);
    try {
        // trackEvent('image', 'image', 'image', 'image');
        // const trackEvent = (category, action, label, value, document_path) =>
        trackEvent('Category', 'Action', 'Event Label', '55', req.ip);
        // next();
        console.log('success');
    } catch (err) {
        console.log('error');
        // console.log(err);
    }

    next();
}, express.static("public/img/cdn"));

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
const trackEvent = (category, action, label, value, document_path) => {
    const data = {
        // API Version.
        v: '1',
        // Tracking ID / Property ID.
        tid: GA_TRACKING_ID,
        // Anonymous Client Identifier. Ideally, this should be a UUID that
        // is associated with particular user, device, or browser instance.
        cid: '555',
        // Event hit type.
        t: 'pageview',
        // Event category.
        ec: category,
        // Event action.
        ea: action,
        // Event label.
        el: label,
        // Event value.
        ev: value,
        // Document path.
        dp: document_path
    };

    return fetch('http://www.google-analytics.com/collect', {
        params: data,
        headers: {
            'user-agent':
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
        },
    });
};