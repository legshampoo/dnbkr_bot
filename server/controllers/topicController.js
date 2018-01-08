const mongoose = require('mongoose');

const Topic = mongoose.model('Topic');

const reddit_bot = require('../bots/reddit/reddit_bot');

exports.createTopic = async (req, res) => {

  console.log('/api/topic/create');

  console.log(req.body);

  const topic = new Topic({
		name: req.body.name
	});

  const exists = await Topic.findOne({
      'name': req.body.name
    })
    .then(res => {
      if(res != null || res != undefined){
        return true
      }else{
        return false
      }
    })
    .catch(err => {
      console.log(err);
      return false
    });


  if(exists){
    console.log('Topic already exists: ', exists);
    var response = {
			api: {
        success: false,
				message: 'Topic already exists'
			}
		}

		return res.send(response);
  }

  await topic.save()
  .then(res => {
    console.log('New Topic Created: ', res);

    reddit_bot.updateTopics();

    return
  })
  .catch(err => {
    console.log('MongoDB error creating topic:', err);

    var response = {
      api: {
        success: false,
        message: 'Failed to create new topic'
      }
    }

    return res.send(response);
  });

  const topicList = await Topic.find({})
    .select({
      name: 1,
      _id: 0
    })
    .then(res => {
      return res
    })
    .catch(err => {
      console.log(err);
      return err
    })

  var response = {
    topicList: topicList,
    api: {
      success: true,
      message: 'New Topic Created'
    }
  }

  res.send(response);
}

exports.getAllTopics = async (req, res) => {
  console.log('/api/topics/all');

  const topicList = await Topic.find({})
    .select({
      name: 1,
      _id: 0
    })
    .then(res => {
      console.log('------------> ', res);
      return res
    })
    .catch(err => {
      console.log(err);

      var response = {
        api: {
          success: false,
          message: 'Get All Topics Error'
        }
      }
    });

  var response = {
    topicList: topicList,
    api: {
      success: true,
      message: 'Get All Topics'
    }
  }

  res.send(response);
}
