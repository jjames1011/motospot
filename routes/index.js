var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment');
var createError = require('http-errors');
var nodemailer = require('nodemailer');
require('dotenv').config()
//models:
var Post = mongoose.model('Post');




router.get('/', function(req, res, next) {
  res.redirect('/homepage');
});
router.get('/homepage', function(req, res, next){
  res.render('index', {title: 'Motospot || Find a spot for your ride!'});
});


router.post('/postaspot', function(req, res, next) {
  //Use moment to add month to date for auto document expiration
  var expireAt = moment().add(1, 'month').toDate();
  //Use mongo ObjectId() to create a new id for the delKey
  var delKey = new mongoose.Types.ObjectId();

  var newPost = new Post({
    title: req.body.title,
    email: req.body.email,
    fullName: req.body.fullName,
    addressLine1: req.body.addressLine1,
    addressLine2: req.body.addressLine2,
    city: req.body.city,
    stateProvinceRegion: req.body.stateProvinceRegion,
    zipOrPostal: req.body.zipOrPostal,
    country: req.body.country,
    description: req.body.description,
    expireAt: expireAt,
    delKey: delKey
  });
  newPost.save(function(err, newPost) {
    if(err) return console.log(err);

    //send email if no error
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      });
      let mailOptions = {
        from: process.env.GMAIL_USER,
        to: req.body.email,
        subject: 'MOTOSPOT Ad confirmation',
        text: 'Your spot has been posted successfully!',
        html: `<h2>Thanks ${newPost.fullName} for posting your extra space on Motospot!</h2>
        <p>Delete your post <a href="http://localhost:3000/del?key=${delKey}">here</a></p>
        <p> Or click <a href="http://localhost:3000/singlepost?id=${newPost.id}">Here</a> to view your post live!</p>`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if(error) {return console.log(error);}
        console.log('Message sent: %s', info.messageId);

      });

    res.redirect('/singlepost?id=' + newPost.id);
  });
});

//browse spots
router.get('/browse', function(req, res, next) {
  //TODO: add search/filter functionality:
  //Sorting syntax: Model.find({conditions}, {projection(optional fields to return)},
  // {options: object(sort)}, [callback: function])
  Post.find({}, null, {sort:{createdAt: -1}},function(err, posts) {
    if(err) return console.log(err);
    var title = 'MOTOSPOT || Browse posts';
    if(posts.length === 0){
      res.render('main', {
        title: title,
        posts: null
      });
    } else {
        if(req.query.err) {
          res.render('main', {
            title: title,
            posts: posts,
            err: 'Could not find the post you were looking for'
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
  if(req.query.id){
    Post.findById(req.query.id, function(err, post) {
      if(post){
        // var formattedDate = moment(post.createdAt).format('MMMM Do, YYYY');
        let formattedDate = moment(post.createdAt).fromNow();
        let title = post.title;
        // TODO: figure out how to reverse geocode from address to coordinates
        // and insert it here for the front end js to render the correct map
        let lonLat = '';


        res.render('singlepost', {
          post : post,
          postedDate: formattedDate,
          title: title,
          lonLat: '[-122.674510,45.570860]'});
      } else {
        return res.redirect('/browse?err=true');
      }
    });
  } else {
    return res.redirect('/browse?err=true');
  }
});

router.get('/faq', function(req, res, next) {
  res.render('faq', {title: 'MOTOSPOT || FAQ'});
});


router.get('/del', function(req, res, next) {
  if(req.query.key){
    Post.deleteOne({delKey: req.query.key}, function(err, post) {
      if(err){return next(createError(500))}
      if (post.n === 0){
        res.render('deleted', {
          title: 'MOTOSPOT || Delete Post',
          message: 'This post has already been deleted'
        });
      } else {
        res.render('deleted', {
          title: 'MOTOSPOT || Delete Post',
          message: 'Your Post has Been Deleted'
        });
      }
    });
  } else {
    return next(createError(500));
  }
});



module.exports = router;
