'use strict';
var mongoose = require('mongoose');

//Basic schema

var ArticleSchema = new mongoose.Schema({
  title: String,
  description: String,
  email: String
}, {timestamps: true});

mongoose.model("Article", ArticleSchema);
