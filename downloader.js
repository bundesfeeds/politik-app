var data = require('./src/data/p.json');
var asyncjs = require('async');
var fs = require('fs');

var request = require('request');

var res2 = [];
var res = data.parliaments.map(function(item) {
  const uuid = item.meta.uuid;
  const deputies = item.datasets.deputies['by-name'];
  const candidates = item.datasets.candidates['by-name'];
  const constituencies = item.datasets.constituencies['by-name'];
  const polls = item.datasets.polls['by-name'];
  const committees = item.datasets.committees['by-name'];

  res2.push({
    uuid,
    type: 'deputies',
    url: deputies
  })
  res2.push({
    uuid,
    type: 'candidates',
    url: candidates
  })
  res2.push({
    uuid,
    type: 'constituencies',
    url: constituencies
  })
  res2.push({
    uuid,
    type: 'polls',
    url: polls
  })
  res2.push({
    uuid,
    type: 'committees',
    url: committees
  })
}).map(function(item) {

})

// create a queue object with concurrency 2
var q = asyncjs.queue(function(task, callback) {
    var config = {url: task.url, json:true};


    request(config, function (error, response) {
      var jsonString = JSON.stringify(response.body);
      var fileName = './src/data/' + task.type + '-' + task.uuid + '.json';
      fs.writeFileSync(fileName, jsonString);
      // fs.writeFileSync();
      console.log('processed', fileName)
      callback();
    });

}, 2);

// assign a callback
q.drain = function() {
    console.log('all items have been processed');
};


// add some items to the queue (batch-wise)
q.push(res2, function(err) {
    console.log('finished processing item');
});
