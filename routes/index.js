const express = require('express');
const router = express.Router();
const storage = require('../middlewares/storage');

const media = require('../controllers/mediaController');


router.post('/upload/single',  storage.single('image'), media.single);
router.post('/upload/multi', storage.array('image', 10), media.multi);
module.exports = router;