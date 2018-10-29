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

      //TODO:eventually want to redirect here to '/singlepost'
      res.render('singlepost', {post: newPost});

  });
  // res.send(req.body);
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
  // console.log(posts);
  // res.send('didnt work');
});

router.get('/singlepost', function(req, res, next) {
  res.send('GOT IT');
  //TODO: finish setting up route. Use query string to get
  //the post from the db and render it here with the singlepost template.
});

module.exports = router;
