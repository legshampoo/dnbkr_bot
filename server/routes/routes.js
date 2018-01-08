const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const topicController = require('../controllers/topicController');

router.post('/user/login',
  authController.authenticate,
  userController.login
);

router.post('/user/logout',
  userController.logout
);

router.post('/user/register',
  userController.validateRegisterUser,
  userController.registerUser,
  authController.authenticate,
  userController.login
);

router.post('/topics/create',
  topicController.createTopic
);

router.get('/topics/all',
  topicController.getAllTopics
);


module.exports = router;
