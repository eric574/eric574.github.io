var express = require('express');
var https = require('https');
var path = require('path');

const bodyParser = require('body-parser');
const request = require('request');
const fetch = require('node-fetch');
const ejs = require('ejs');
const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

require('dotenv').config();

var app = express();

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 3000));

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

function getQuote(req, res, next) {
	// const num = Math.floor((Math.random() * 1000) + 1);
	const num = 1;
	const REQUEST_URL = `https://www.forbes.com/forbesapi/thought/uri.json?enrich=true&query=${num}&relatedlimit=1`;
    fetch(PROXY_URL + REQUEST_URL, {
    	headers: {
    		"X-Requested-With": "XMLHttpRequest"
    	},
    	credentials: 'same-origin'
    })
    .then((response) => response.json())
    .then((data) => {
    	console.log(data.thought);
    	res.locals.quote = data.thought.quote;
    	res.locals.author = data.thought.thoughtAuthor.name;
    	next();
    })
    .catch((error) => {
    	console.log('Error:', error);
    	next();
    });
}

app.get('/', getQuote, (req, res) => {
	var qotd = "";
	res.locals.qotd = qotd;
	res.render('index');
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
