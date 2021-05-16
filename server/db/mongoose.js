// Handle connection to MongoDB
const mongoose = require('mongoose');

// // mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://m4ximskr:m4ximskr@cluster0.oymnc.mongodb.net/eduhqlp-qna-test', {useNewUrlParser: true,  useUnifiedTopology: true }).then(() => {
  console.log('connected successfully')
}).catch((e) => {
  console.log('failed to connect', e)
})


mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

module.exports = {
  mongoose
}



