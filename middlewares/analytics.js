require('dotenv').config();
const fetch = require('node-fetch');
const { GA_TRACKING_ID } = process.env;
console.log(GA_TRACKING_ID);
module.exports = {
    analytics: async (req, res, next) => {
        try {
            await trackEvent(req.ip, `Category`, `Action`, `Event Label`, `55`, req.originalUrl);
            console.log('success');
            next();

        } catch (err) {
            console.log(err);
        }
    }
}
const trackEvent = (cid, category, action, label, value, document_path) => {
    return fetch(`http://www.google-analytics.com/collect?v=1&tid=${GA_TRACKING_ID}&cid=${cid}&t=pageview&ec=${category}&ea=${action}&el=${label}l&ev=${value}&dp=${document_path}`, {
        headers: {
            'user-agent':
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
        },
    });
};