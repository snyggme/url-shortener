'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const dns = require('dns');
const bodyParser = require('body-parser')
const url = require('url')

var cors = require('cors');

var app = express();

var port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}))

mongoose.connect(process.env.MONGO_URI);

var Schema = mongoose.Schema;

var urlSchema = new Schema({
  original_url: String,
  shorten_url: String
})

var Url = mongoose.model('Url', urlSchema)

var createAndSaveUrl = function(done) {

  Url.save({original_url: 'dasd', shorten_url: '123'}, (err, data) =>  err ? done(err) : done(null, data))
};

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post("/api/shorturl/new", (req, res) => {
  dns.lookup(url.parse(req.body.url).hostname, (err, address, family) => 
             err ? 
               res.json({error: 'Invalid URL'})
               :
               res.json({err: err, address: address, family: family})
  )
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});