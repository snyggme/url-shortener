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

let counter = 0;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}))

mongoose.connect(process.env.MONGO_URI);

var Schema = mongoose.Schema;

var urlSchema = new Schema({
  original_url: String,
  shorten_url: Number
})

var Url = mongoose.model('Url', urlSchema)

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post("/api/shorturl/new", (req, res) => {
  const originUrl = req.body.url
  
  const hostname = url.parse(req.body.url).hostname
  //Object.keys(obj).length
  
  Url.find({}, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    counter = Object.keys(data).length;
    console.log(counter);
  })
  
  const newUrl = new Url({
    original_url: originUrl, 
    shorten_url: counter
  })

  dns.lookup(hostname, (err, address, family) => 
            err || hostname === null 
              ? res.json({error: 'Invalid URL'}) 
              : newUrl.save((err, data) =>  
                err 
                  ? console.log(err)
                  : res.send({original_url: originUrl, shorten_url: counter}))
  )
});

app.get("/api/shorturl/:shortenUrl", (req, res) => {
  Url.findOne({shorten_url: req.params.shortenUrl}, 
              (err, data) => err ? res.json({error: err}) : res.redirect(data.original_url))
})


app.listen(port, function () {
  console.log('Node.js listening ...');
});