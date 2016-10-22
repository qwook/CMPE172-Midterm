
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const keys = JSON.parse(fs.readFileSync(path.join(__dirname, 'key.json'), 'utf8'));
const hash = crypto.createHmac('sha256', keys.secret);

var nonce = (new Date()).getTime();


var method = "GET"
var path_name = "/orders";
var url = "https://" + keys.endpoint + "/v1" + path_name;
console.log(url);
var body = "";
var message = nonce + url + body;
var signature = hash.update(message).digest('hex');

console.log(keys.key);
console.log(signature);
console.log(nonce);

var options = {
  'hostname': keys.endpoint,
  'path': "/v1" + path_name,
  'method': method,
  'headers': {
    'ACCESS_KEY': keys.key,
    'ACCESS_SIGNATURE': signature,
    'ACCESS_NONCE': nonce,
    'Content-Type': 'application/json',
  }
};

nonce++;

var req = https.request(options, (res) => {
  var body = "";
  res.on('data', (data) => {
    body += data.toString("utf8");
    console.log(data.toString());
  })
});
req.write(body);
req.end();

req.on('error', () => {
  console.error(e);
})

console.log(keys);
