const express = require('express');
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
    try {
        // trackEvent('image', 'image', 'image', 'image');
        trackEvent('Category', 'Action', req.path, '55', req.ip);
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
const trackEvent = (category, action, label, value, cid) => {
    const data = {
        // API Version.
        v: '1',
        // Tracking ID / Property ID.
        tid: GA_TRACKING_ID,
        // Anonymous Client Identifier. Ideally, this should be a UUID that
        // is associated with particular user, device, or browser instance.
        // cid: '555',
        cid: cid,
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
    };

    return fetch('http://www.google-analytics.com/debug/collect', {
        params: data,
    });
};