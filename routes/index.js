var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var moment = require('moment');


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
  //Use moment to add month to date for auto document expiration
  var expireAt = moment().add(1, 'month').toDate();


  var newPost = new Post({
    title: req.body.title,
    email: req.body.email,
    address: req.body.address,
    description: req.body.description,
    expireAt: expireAt
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
        // var formattedDate = moment(post.createdAt).format('MMMM Do, YYYY');
        var formattedDate = moment(post.createdAt).fromNow();

        res.render('singlepost', {post : post, postedDate: formattedDate});
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
