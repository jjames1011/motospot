var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var postSchema = new mongoose.Schema({
  title: String,
  email: String,
  firstName: String,
  lastName: String,
  description: String,
  address: String,
  delKey: ObjectId,
  createdAt: {
    type: Date,
    default: Date.now
  },
  expireAt: {
    type: Date,
    default: null,
  }
});

postSchema.index({delKey: 1}, { unique: true});
postSchema.index({expireAt: 1}, {expireAfterSeconds: 0});

//how to add a method if needed:
// postSchema.methods.example = function(){
//   //add a method for this Schema(class)
// }

mongoose.model('Post', postSchema);
