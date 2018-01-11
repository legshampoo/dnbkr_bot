require('dotenv').config({ path: 'variables.env' });

const seeder = require('mongoose-seed');

const sample_data = require('./sample_data');

const User = require('../models/User');
const Topic = require('../models/Topic');

var seedOperations = {

  init: () => {
    console.log('seeder init');

    seedOperations.clear_all_data();
  },

  clear_all_data: () => {
    console.log('clearing all data');
    var testDate = new Date(Date.UTC(2018, 1, 1, 0, 0, 0));
    console.log(testDate);

    seeder.connect(process.env.DATABASE, function(){

      seeder.loadModels([
          'server/models/User',
          'server/models/Topic'
        ]);


      seeder.clearModels([
        'User',
        'Topic'
      ], function(){
        console.log('data cleared');
        seeder.populateModels(sample_data, function(){
          console.log('sample data populated');
          seeder.disconnect();
          process.exit();
        });
      });
    });

  }
}

seedOperations.init();

// module.exports = seeder;
