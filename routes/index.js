var express = require('express');
var router = express.Router();

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

  //temp data
  var singlePost = {
    title: 'Garage spot for rent in North Portland',
    email: 'jjames.hmu@gmail.com',
    description: 'I am renting out a 3x7 space in my garage perfect for a motorcycle. The garage has climate control and access to electricity.'
  }

  res.render('displaypost',{
    post: singlePost,
    flag: 'we got a post request at this route yay :D'
  });
});

//browse spots

router.get('/browse', function(req, res, next) {
  res.render('browseposts', {title : "Browse posts"})
})

module.exports = router;
