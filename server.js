'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var dns = require('dns');
var bodyParser = require('body-parser')
var url = require('url')

var cors = require('cors');

var app = express();

var port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}))

mongoose.createConnection(process.env.MONGO_URI);

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
  const originUrl = req.body.url;
  const hostname = url.parse(req.body.url).hostname
  
  dns.lookup(hostname, (err, address, family) => 
             err || hostname === null ? 
               res.json({error: 'Invalid URL'})
               :
               res.json({err: err, address: address, family: family})
  )
});

app.get("/api/shorturl/:shorten_url", (req, res) => {
  Url.findOne({shorten_url: req.params.shortenUrl})
})


app.listen(port, function () {
  console.log('Node.js listening ...');
});