var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/homepage');
});
router.get('/homepage', function(req, res, next){
  res.render('index', {title: 'MotoSpot'});
});

// postaspot
router.get('/postaspot', function(req, res, next) {
  res.render('postform', {post: 'post a spot'});
});

router.post('/postaspot', function(req, res, next) {
    var newPost = new Post({
      title: req.body.title,
      email: req.body.email,
      description: req.body.description
    });
    newPost.save(function(err, newPost) {
      if(err) return console.log(err);
      res.redirect('/singlepost?id=' + newPost.id);
  });
});

//browse spots
router.get('/browse', function(req, res, next) {
  //TODO: add search/filter functionality:

  Post.find(function(err, posts) {
    if(err) return console.log(err);
    if(posts.length === 0){
      res.send('sorry there are currently no posts');
    } else {
    res.render('browseposts', {posts: posts});
  }
  });
});

router.get('/singlepost', function(req, res, next) {
  // res.send(req.query.id);
  if(req.query.id){
    Post.findById(req.query.id, function(err, post) {
      if(post){
        res.render('singlepost', {post : post});
      } else {
        res.redirect('/browse');
      }
    });
  } else {
    return res.redirect('/browse');
  }
});

//TODO Create the route to delete a post

module.exports = router;
