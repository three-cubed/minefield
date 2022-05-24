const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('start.ejs');
});

router.get('/play', (req, res) => {
    res.render('play.ejs');
});

router.get('/instructions', (req, res) => {
    res.render('instructions.ejs');
});

router.get('/narrow', (req, res) => {
    res.render('narrow.ejs');
});

module.exports = router;
