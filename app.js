const express = require('express');
const analytic = require('./middlewares/analytics');
const { transaction } = require('./middlewares/sentry');
const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");
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
app.enable('trust proxy');
// app.use(expressGa('G-MRYF58C8K7'));

Sentry.init({
    dsn: "https://8a310ba93ef34cd5abb134affd104f7b@o1253817.ingest.sentry.io/4504430259077120",

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({
            // to trace all requests to the default router
            app,
            // alternatively, you can specify the routes you want to trace:
            // router: someRouter,
        }),
    ],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
});
// app.use("/image", analytic.analytics, express.static("public/imagekit"));
app.use("/image", transaction, express.static("public/imagekit"));
app.use("/img/icon", analytic.analytics, express.static("public/img/icon"));
app.use("/img", analytic.analytics, express.static("public/img/cdn"));


// welcome
// app.get('/', (req, res) => {
//     res.json({
//         status: true,
//         message: 'welcome to Content Delivery Network Spairum',
//         data: null
//     });
// });
// All controllers should live here
app.get("/", function rootHandler(req, res) {

    // data = {
    //     status: true,
    //     message: 'welcome to Content Delivery Network Spairum',
    //     data: null
    // }
    // data to string
    // data = JSON.stringify(data);
    // Sentry.captureMessage(req.originalUrl, "info", data);
    // Sentry.captureEvent(data);
    res.json({
        status: true,
        message: 'welcome to Content Delivery Network Spairum',
        data: null
    });
    // transaction.finish();
});


const routes = require('./routes');
app.use('/api', routes);

app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    Sentry.captureException(err);
    // Sentry.captureEvent(err.message);
    res.status(500).json({
        status: false,
        message: err.message,
        data: null
    });
});

// const transaction = Sentry.startTransaction({
//     op: "test",
//     name: "My First Test Transaction",
// });

// setTimeout(() => {
//     try {
//         foo();
//     } catch (e) {
// Sentry.captureException(e);
//     } finally {
//         transaction.finish();
//     }
// }, 99);

// Optional fallthrough error handler
// app.use(function onError(err, req, res, next) {
//     // The error id is attached to `res.sentry` to be returned
//     // and optionally displayed to the user for support.
//     res.status(500).json({
//         status: false,
//         message: err.message,
//         data: null
//     });
//     res.statusCode = 500;
//     res.end(res.sentry + "\n");

// });

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());
// the rest of your app
app.use(Sentry.Handlers.errorHandler());
app.listen(PORT, () => {
    console.log('listening on port', PORT);
    console.log(process.env.baseURL);
});