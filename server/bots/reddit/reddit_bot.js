require('dotenv').config({ path: 'variables.env' });

const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');

const Topic = require('../../models/Topic');

const snoowrap = new Snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT,
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
});

const client = new Snoostorm(snoowrap);

var streamOpts = {
  subreddit: 'CryptoCurrency+testingground4bots',
  results: 100,
  pollTime: 2000
};

var topics = [];

const reddit_bot = {
  init: async () => {
    console.log('\n');
    console.log('========================================');
    console.log('REDDIT BOT INIT');
    console.log('========================================');
    console.log('\n');

    await reddit_bot.updateTopics();

    const comments = client.CommentStream(streamOpts);

    comments.on('comment', (comment) => {
      // console.log(comment);
      topics.forEach((topic) => {
        if(comment.body.includes(topic)){

          var convertedDate = new Date(0);
          convertedDate.setUTCSeconds(comment.created_utc);
          var time_utc = moment(convertedDate).utc().format('YYYY-MM-DD HH:mm');

          var query = { name: topic };

          var options = {
            $push: {
              historicalData: {
                time_utc: time_utc.toString(),
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
              // console.log(res);
              console.log('TOPIC DETECTED: ', topic);
            })
            .catch(err => {
              console.log(err);
            });
        } // end of if statement
      });
    });
  },

  updateTopics: async () => {
    //grab all the topics from mongo and update our array
    console.log('REDDIT BOT: updating topics list');

    var latestTopics = await Topic.find({})
      .then(res => {
        return res
      })
      .catch(err => {
        console.log('Error getting topics from mongo');
        console.log(err);
      })

    var keywords = [];

    Object.keys(latestTopics).map((key, index) => {
      var keyword = latestTopics[key].name;
      keywords.push(keyword);
    })

    topics = keywords;

    return
  },

  testQuery: async () => {

  }
}

module.exports = reddit_bot;
