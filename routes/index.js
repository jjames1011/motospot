const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');
const createError = require('http-errors');
const nodemailer = require('nodemailer');
const request = require('request');
const sanitizer = require('sanitize')();
require('dotenv').config()
//models:
const Post = mongoose.model('Post');
const middleware = require('../middleware/searchutil.js');


router.get('/', function(req, res, next) {
  res.redirect('/home');
});
router.get('/home', function(req, res, next){
  res.render('index', {title: 'Motospot || Motorcycle Storage Sharing'});
});


router.post('/postaspot', function(req, res, next) {
  //Use moment to add month to date for auto document expiration
  let expireAt = moment().add(1, 'month').toDate();
  let formattedCreatedAtDate = moment().format('MMM DDDo').toString();

  //Use mongo ObjectId() to create a new id for the delKey
  let delKey = new mongoose.Types.ObjectId();
  let spotLonLat, zipLonLat;
  let newPost;
  let url;

  //if user supplies full address query for it instead of just zipOrPostal. else just query
  //for zipOrPostal
  if(req.body.addressLine1){
    let address = sanitizer.value(req.body.addressLine1, 'str');
    let city = sanitizer.value(req.body.city.toLowerCase(), 'str');
    let zipOrPostal = sanitizer.value(req.body.zipOrPostal, 'int')
    let state = sanitizer.value(req.body.stateProvinceRegion, 'str');
    address = address.replace(/ /g,"+");
    url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}&city=${city}&postalcode=${zipOrPostal}&state=${state}`;
  } else {
    url = `https://nominatim.openstreetmap.org/search?format=json&postalcode=${req.body.zipOrPostal}`
  }

  //geoEncode [longitude, latitude]
  let requestOpts = {
    url: url,
    method: "GET",
    headers: {
      'Accept': 'application/json,text/html,application/xhtml+xml,application/xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive',
      'Host': 'nominatim.openstreetmap.org',
      'Upgrade-Insecure-Requests': 1,
      'User-Agent': 'Motospot (node application)'
    }
  }

  request(requestOpts, (err, response, body) => {
    if(err) next(createError(err));
    if(req.body.addressLine1) {
      spotLonLat = `[${JSON.parse(body)[0].lon},${JSON.parse(body)[0].lat}]`;
    } else {
      zipLonLat = `[${JSON.parse(body)[0].lon},${JSON.parse(body)[0].lat}]`;
    }

    newPost = new Post({
      title: sanitizer.value(req.body.title, 'str'),
      price: sanitizer.value(req.body.price, 'int'),
      email: sanitizer.value(req.body.email, 'email'),
      phone: sanitizer.value(req.body.phone, 'phone'),
      fullName: sanitizer.value(req.body.fullName, 'str'),
      description: sanitizer.value(req.body.description, 'str'),
      addressLine1: sanitizer.value(req.body.addressLine1, 'str'),
      addressLine2: sanitizer.value(req.body.addressLine2, 'str'),
      city: sanitizer.value(req.body.city.toLowerCase(), 'str'),
      stateProvinceRegion: sanitizer.value(req.body.stateProvinceRegion, 'str'),
      zipOrPostal: sanitizer.value(req.body.zipOrPostal, 'int'),
      country: sanitizer.value(req.body.country, 'str'),
      expireAt: expireAt,
      delKey: delKey,
      spotLonLat: spotLonLat,
      zipLonLat: zipLonLat,
      formattedCreatedAtDate: formattedCreatedAtDate
    });

    newPost.save(function(err, newPost) {
      if(err) return next(createError(err));

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
          to: sanitizer.value(req.body.email, 'email'),
          subject: 'MOTOSPOT Ad confirmation',
          text: 'Your spot has been posted successfully!',
          html: `<div style="  border: .5px solid grey;
            border-radius: 10px;
            padding: 10px;
            box-shadow: 10px 10px 50px black;
            background: linear-gradient(360deg, black 50%, aqua 150%);">
            <h2 style="color: aqua">Thanks ${newPost.fullName} for posting your extra space on <a href="${process.env.ENV}/home">Motospot!</a></h2>
            <p style="color: white;"> Click <a href="${process.env.ENV}/singlepost?id=${newPost.id}" target="_blank">Here</a> to view your post live!</p>
            <p style="color: white;">If you would like to delete your post you can do so by clicking <a href="${process.env.ENV}/del?key=${delKey}" target="_blank">Here</a>.</p>
          </div>
          `
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if(error) {return console.log(error);}
          console.log('Message sent: %s', info.messageId);

        });

      res.redirect('/singlepost?id=' + newPost.id);
    });
  });
});
//for use with users geolocation
router.get('/lonlat', function(req, res, next) {
  //if user grants permission take lon and lat and reverse geocode to get city.
  //then redirect to /browse?city={userscity}
  let usrCoords, lon, lat;
  if(req.query.usrCoords){
    usrCoords = req.query.usrCoords.split(',');
    let requestOpts = {
      //change to use coordinates instead of long lat
      url: `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${usrCoords[0]}&lon=${usrCoords[1]}`,
      method: "GET",
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Host': 'nominatim.openstreetmap.org',
        'Referer': 'https://wiki.openstreetmap.org/wiki/Nominatim',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Motospot (node application)'
      }
    }
    request(requestOpts, (err, response, body) => {
      if(err) next(createError(err));
      JSON.parse(body)['address']['city']
      res.redirect(`/browse?city=${JSON.parse(body)['address']['city']}`)
    });

  } else {
    res.redirect('/browse?page=1')
  }
})
router.get('/browse', function(req, res, next) {
  let dbSearchFilters = {};
  let skipAmount, page, city, zipOrPostal, title, error;


  //set search filters from query strings
  //keep track of the filters[page, zipOrPostal] for 'next page' and
  //'prev page' links
  if(req.query.city && req.query.zipOrPostal){
    dbSearchFilters = middleware.formatSearchFilters(req.query.city, req.query.zipOrPostal);
    city = sanitizer.value(req.query.city, 'str');
    zipOrPostal = sanitizer.value(req.query.zipOrPostal, 'int');
    title = `MOTOSPOT || ${city} posts`;
  } else if (req.query.city){
    dbSearchFilters = middleware.formatSearchFilters(req.query.city);
    city = sanitizer.value(req.query.city, 'str');
    zipOrPostal = '';
    title = `MOTOSPOT || ${city} Posts`;
  } else if (req.query.zipOrPostal) {
    dbSearchFilters = middleware.formatSearchFilters('', req.query.zipOrPostal)
    zipOrPostal = sanitizer.value(req.query.zipOrPostal, 'int');
    city = '';
    title = `MOTOSPOT || ${zipOrPostal} Posts`;
  } else {
    city = '';
    zipOrPostal = '';
    title = 'MOTOSPOT || All Posts'
  }
  //if not a 'page' query string assume client wants page 1
  if(!req.query.page) {
    page = 1;
  } else {
    page = sanitizer.value(req.query.page, 'int');
  }
  //calc how many results to skip for db query[pagination]
   skipAmount = page*30-30;
  Post.find(dbSearchFilters,null,{sort:{createdAt: -1}, limit: 30, skip: skipAmount},function(err, posts) {
    if(err){
      return next(createError(err));
    }
    let capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1)
    if(posts.length === 0){
      res.render('main', {
        title: title,
        posts: null,
        city: capitalizedCity,
        zipOrPostal: zipOrPostal,
        nextLink: null,
        prevLink: Number(page) - 1
      });
    } else {
      let currentPosts = posts;
      //Hit the db again to check if there are posts on next page to either omit or include 'next page' button...
      Post.find(dbSearchFilters,null,{sort: {createdAt: -1}, limit: 30, skip: skipAmount + 30}, function(err, nextPosts) {
        //if there are no posts on the next page or page after the current one then leave out the 'next page' button on front end
          if(nextPosts.length === 0){
            res.render('main', {
              title: title,
              posts: currentPosts,
              city: capitalizedCity,
              zipOrPostal: zipOrPostal,
              nextLink: null,
              prevLink: Number(page) - 1
            });
          } else {
            //else there IS posts on next page therefore include 'next page' button.
            res.render('main', {
              title: title,
              posts: currentPosts,
              city: capitalizedCity,
              zipOrPostal: zipOrPostal,
              nextLink: Number(page) + 1,
              prevLink: Number(page) - 1
            });
          }
      });
    }
  });
});

router.get('/singlepost', function(req, res, next) {
  if(req.query.id){
    let postId = sanitizer.value(req.query.id, 'str');
    Post.findById(postId, function(err, post) {
      if(post){
        // var formattedDate = moment(post.createdAt).format('MMMM Do, YYYY');
        let formattedDate = moment(post.createdAt).fromNow();
        let title = 'Motospot || ' + post.title;
          res.render('singlepost', {
            post : post,
            postedDate: formattedDate,
            title: title
          });
      } else {
        return next(createError(404));
      }
    });
  } else {
    //#TODO: use nextError() instead of query params
    return next(createError(404));
  }
});

router.get('/faq', function(req, res, next) {
  res.render('faq', {title: 'MOTOSPOT || FAQ'});
});

router.get('/del', function(req, res, next) {
  if(req.query.key){
    let delKey = sanitizer.value(req.query.key, 'str');
    Post.deleteOne({delKey: delKey}, function(err, post) {
      if(err){return next(createError(500))}
      if (post.n === 0){
        res.render('deleted', {
          title: 'MOTOSPOT || Delete Post',
          message: 'This post has already been deleted!'
        });
      } else {
        res.render('deleted', {
          title: 'MOTOSPOT || Delete Post',
          message: 'Your Post has Been Deleted'
        });
      }
    });
  } else {
    return res.redirect('/');
  }
});

router.get('/terms', function(req, res, next) {
  res.render('terms', {title: 'MOTOSPOT || Terms Of Use'})

})

module.exports = router;
