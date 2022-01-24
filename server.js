const express = require('express');
const app = express();

const PORT = process.env.PORT || 3333;
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));
const router = require('./routes.js');
app.use('/', router);

app.listen(PORT);

console.log('listening to port: ' + PORT);
