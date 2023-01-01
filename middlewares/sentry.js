require('dotenv').config();
const Sentry = require('@sentry/node');
module.exports = {
    transaction: async (req, res, next) => {
        try {


            const transaction = Sentry.startTransaction({
                op: req.ip,
                name: `${req.method} ${req.originalUrl}`,
                // description: req.method,
                // status: res.statusCode,
                // method: req.method,
                // op: "test",
                // name: "My Test Transaction",
            });


            transaction.finish();

            next();

        } catch (err) {
            console.log(err);
            Sentry.captureException(err);
        }
    }
}