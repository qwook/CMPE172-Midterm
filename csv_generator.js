
const csv = require('csv');
const fs = require('fs');
const path = require('path');

module.exports = function(orders) {

  var stringifier = csv.stringify({header: true, columns: {
    type:       "Type",
    timestamp:  "Timestamp",
    amt:        "Amount",
    currency:   "Currency",
    cvt_rate:   "Conversion Rate"
  }});

  var data = '';

  stringifier.on('readable', function(){
    while(row = stringifier.read()){
      data += row;
    }
  });

  stringifier.on('error', function(err){
    console.log(err.message);
  });

  stringifier.on('finish', function(){
    fs.writeFileSync(path.join(__dirname, "orders.csv"), data);
  });

  for (var order of orders) {
    stringifier.write(order);
  }

  stringifier.end();

}