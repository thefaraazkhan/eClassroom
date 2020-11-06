const mongoose = require('mongoose');

async function connectdb(){

 await mongoose.connect('mongodb+srv://admin:admin@cluster0.hyneq.mongodb.net/miniproject?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

console.log('database connected');

}

connectdb();

module.exports = mongoose;