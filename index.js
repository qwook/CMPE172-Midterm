
const https = require('https');
const fs = require('fs');
const path = require('path');

function getExchangeRates() {
  return new Promise((resolve, reject) => {

    https.get("https://api.coinbase.com/v1/currencies/exchange_rates", (res) => {
      var body = "";
      res.on('data', (data) => body += data.toString("utf8"));
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', (e) => reject(e));

  });
}

getExchangeRates()
.then((exchg) => {
  console.log(exchg);
})
