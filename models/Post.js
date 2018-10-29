var mongoose = require('mongoose');


var postSchema = new mongoose.Schema({
  title: String,
  email: String,
  description: String
});


//how to add a method if needed:
// postSchema.methods.example = function(){
//   //add a method for this Schema(class)
// }

mongoose.model('Post', postSchema);
