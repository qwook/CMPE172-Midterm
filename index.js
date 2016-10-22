
const https = require('https');
const fs = require('fs');
const path = require('path');
const repl = require('repl');

function getExchangeRates() {
  return new Promise((resolve, reject) => {

    https.get("https://api.coinbase.com/v1/currencies/exchange_rates", (res) => {
      var body = "";
      res.on('data', (data) => body += data.toString("utf8"));
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', (e) => reject(e));

  });
}

var orders = [];

function cmdEval(cmd, context, filename, cb) {
  var args = cmd.substring(0, cmd.length-1) // remove \n from cmd
    .split(" ") // split the args into array
    .filter((arg) => arg !== ""); // only take in args that aren't empty

  if (!args[0]) {
    cb(null);
    return;
  }

  var command = args[0].toLowerCase();

  if (command == "buy") {

    getExchangeRates()
    .then((exchg) => {

      var conversion = 1;
      var amt = parseFloat(args[1]);
      if (typeof( amt ) !== "number") {
        throw "Invalid argument 1.";
      }

      var currency = args[2];
      if (currency && currency.toUpperCase() !== "btc") {
        currency = currency.toUpperCase();
        var lower = currency.toLowerCase();
        if (exchg[lower + "_to_btc"]) {
          conversion = parseFloat( exchg[lower + "_to_btc"] );
        } else {
          throw "No known exchange rate for BTC/" + currency + ". Order failed.";
        }
      } else {
        currency = "BTC";
      }

      orders.push({
        type: "buy",
        timestamp: (new Date()),
        amt: amt,
        currency: currency
      });

      var inverseConversion = (1/conversion).toFixed(2);
      var converted = amt * conversion;

      if (currency === "BTC")
        console.log(`Order to BUY ${amt} BTC queued.`);
      else
        console.log(`Order to BUY ${amt} ${currency} worth of BTC queued @ ${inverseConversion} BTC/${currency} (${converted} BTC)`);

      cb(null);
    }).catch((e) => {
      console.log(e);
      cb(null);
    });

  } else if (command == "sell") {

  } else if (command == "orders") {

    console.log("=== CURRENT ORDERS ===");
    for (var order of orders) {
      console.log(`${order.timestamp.toString()} : ${order.type.toUpperCase()} ${order.amt} : UNFILLED`);
    }

  } else {
    console.log("No such command: " + command);
    cb(null);
  }
}

const r = repl.start({prompt: 'coinbase> ', eval: cmdEval});


