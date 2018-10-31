var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
  title: String,
  email: String,
  description: String,
  address: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  expireAt: {
    type: Date,
    default: null,
  }
});

postSchema.index({expireAt: 1}, {expireAfterSeconds: 0});

//how to add a method if needed:
// postSchema.methods.example = function(){
//   //add a method for this Schema(class)
// }

mongoose.model('Post', postSchema);
