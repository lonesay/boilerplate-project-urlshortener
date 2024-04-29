require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyparser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyparser.urlencoded({extended: false}));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let urls = [];

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  if (req.body.url.match(/http[s]*:\/\/[a-zA-Z:0-9.]+/gi) == null) {
    return res.json({ error: 'invalid url' });
  } else {
    urls.push(req.body.url);
    res.json({
      original_url:req.body.url,
      short_url: urls.length - 1
    });
  }
  // not working maybe because its local
  /*dns.lookup(req.body.url, {all:true}, (err, address, family) => {
    if (err) return res.json({ error: 'invalid url' });
    urls.push(req.body.url);
    res.json({
      original_url:req.body.url,
      short_url: urls.length - 1
    });
  });*/
});

app.get('/api/shorturl/:url', (req, res) => {
  let p = parseInt(req.params.url);
  res.redirect(urls[p]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
