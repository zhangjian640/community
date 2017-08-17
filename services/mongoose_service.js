const mongoose = require('mongoose');
const uri = 'mongodb://localhost:29999/community';
mongoose.Promise = global.Promise;

mongoose.connect(uri, {useMongoClient: true});
const db = mongoose.createConnection(uri);

db.once('open', function () {
  console.log('mongodb connection created');
});

db.on('error',console.error.bind(console, 'connection error:'));