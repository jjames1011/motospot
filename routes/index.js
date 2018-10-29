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

      //eventually want to redirect here to '/singlepost'
      res.send(newPost);

  });
  // res.send(req.body);
});

//browse spots

router.get('/browse', function(req, res, next) {
  res.render('browseposts', {title : "Browse posts"});
})

module.exports = router;
