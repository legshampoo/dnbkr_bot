require('dotenv').config({ path: 'variables.env' });
const path = require('path');

var backup = require('backup-mongodb');
const seeder = require('mongoose-seed');

const sample_data = require('./sample_data');

const User = require('../models/User');
const Topic = require('../models/Topic');

var migrations = {

  run: () => {
    console.log('Migrations: ');

    for(var i = 0; i < process.argv.length; i++){
      switch(process.argv[i]){
        case 'drop_all':
          console.log('drop all');
          break;
        case 'backup':
          migrations.backup();
          break;
      }
    }
  },

  drop_all: () => {
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
  },

  backup: () => {

    console.log('BACKING UP DATABASE...');

    var basePath = path.resolve(__dirname, './backup');

    new backup(process.env.DATABASE, basePath).backup(() => {
      console.log('BACKUP COMPLETE');
      process.exit();
    })
  }
}

migrations.run();
