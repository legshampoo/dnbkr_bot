
const Topic = require('../models/Topic');

var utils = {

  findOneAndUpdate: () => {

    console.log('DEV: running test query on mongo');

    var topic = 'ETH';
    var comment = {
      created_utc: 0000000,
      author: 'Author Name',
      comment: 'this is the comment'
    }
    var query = { name: topic };

    var options = {
      $push: {
        historicalData: {
          time: comment.created_utc,
          author: comment.author.name,
          comment: comment.body,
          sentiment: 0
        }
      }
    };

    Topic.findOneAndUpdate(query, options)
    .select({
      name: 1,
      _id: 0
    })
    .then(res => {
      console.log('TEST QUERY RESPONSE: ');
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
  }

}

module.exports = utils;
