const mongoose = require('mongoose');

async function connectdb(){

 await mongoose.connect('mongodb://admin:admin@cluster0-shard-00-00.hyneq.mongodb.net:27017,cluster0-shard-00-01.hyneq.mongodb.net:27017,cluster0-shard-00-02.hyneq.mongodb.net:27017/miniproject?ssl=true&replicaSet=atlas-w8jtig-shard-0&authSource=admin&retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

console.log('database connected');

}

connectdb();

module.exports = mongoose;