var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment');
//models:
var Post = mongoose.model('Post');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/homepage');
});
router.get('/homepage', function(req, res, next){
  res.render('index');
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
    var title = 'MOTOSPOT || Browse posts';
    if(posts.length === 0){
      res.send('sorry there are currently no posts');
    } else {
        if(req.query.err) {
          res.render('main', {
            title: title,
            posts: posts,
            error: 'Could not find the post you were looking for'
          });
        } else {
            res.render('main', {
            title: title,
            posts: posts});
      }
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
        var title = post.title;

        res.render('singlepost', {
          post : post,
          postedDate: formattedDate,
          title: title});
      } else {
        return res.redirect('/browse?err=true');
      }
    });
  } else {
    return res.redirect('/browse?err=true');
  }
});

router.get('/faq', function(req, res, next) {
  res.render('faq', {title: 'FAQ'});

});

//TODO Create the route to delete a post

module.exports = router;
