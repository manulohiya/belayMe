var express = require('express'),
    app = express(),
    _ = require('underscore-node'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');
    Post = require('./models/post'),
    User = require('./models/user'),
    session = require('express-session');

//connect to mongodb
mongoose.connect(
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/project1' 
);

// middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

//middleware for cookies
app.use(session({
 saveUninitialized: true,
 resave: true,
 secret: 'SuperSecretCookie',
 cookie: { maxAge: 60000 }
}));

// middleware to manage sessions
app.use('/', function (req, res, next) {
  // saves userId in session for logged-in user
  req.login = function (user) {
    req.session.userId = user.id;
  };

  // finds user currently logged in based on `session.userId`
  req.currentUser = function (callback) {
    User.findOne({_id: req.session.userId}, function (err, user) {
      req.user = user;
      callback(null, user);
    });
  };

  // destroy `session.userId` to log out user
  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  };

  next();
});


//STATIC ROUTES//
//get static index
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});

// profile page
app.get('/profile', function (req, res) {
  // check for current (logged-in) user
  console.log("works")
  req.currentUser(function (err, user) {
    // show profile if logged-in user
    console.log("yes")
    if (user) {
      res.sendFile(__dirname + '/public/views/profile.html');
    // redirect if no user logged in
    } else {
      res.redirect('/');
    }
  });
});

// AUTH ROUTES (SIGN UP, LOG IN, LOG OUT)

//SIGN UP STUFF
// signup route with placeholder response
app.get('/signup', function (req, res) {
   req.currentUser(function (err, user) {
    // redirect if current user
    if (user) {
      res.redirect('/profile');
    } else {
      res.sendFile(__dirname + '/public/views/signUp.html');
    }
  });
});

//user submits the signup form
app.post('/users', function (req, res) {
  // grab user data from params (req.body)
  var newUser = req.body.user;
  // create new user with secure password
  User.createSecure(newUser.firstName, newUser.lastName, newUser.email, newUser.password, function (err, user) {
    res.redirect('/login');
  });
});


//LOGIN STUFF
// login route (renders login view)
app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/public/views/login.html');
});


// authenticate user and set session
app.post('/login', function (req, res) {
  var userData = req.body.user;
  User.authenticate(userData.email, userData.password, function (err, user) {
    req.login(user);
    //redirect to user profile
    res.redirect('/profile');
  });
});

// log out user (destroy session)
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});


// API ROUTES

// show current user
app.get('/api/users/current', function (req, res) {
  // check for current (logged-in) user
  req.currentUser(function (err, user) {
    res.json(user);
  });
});

// create new post for current user
app.post('/api/users/current/posts', function (req, res) {
  // create new log with form data (`req.body`)
  var newPost = new Post({
    name: req.body.name,
    location: req.body.location,
    message: req.body.message
  });

  // save new post
  newPost.save();

  // find current user
  req.currentUser(function (err, user) {
    // embed new post in user's posts
    user.posts.push(newPost);
    // save user (and new post)
    user.save();
    // respond with new post
    res.json(newPost);
  });
});

// show all posts
app.get('/api/posts', function (req, res) {
  Post.find(function (err, posts) {
    res.json(posts);
  });
});

// create new post
app.post('/api/posts', function (req, res) {
  // create new post with form data (`req.body`)
  var newPost = new Post({
    name: req.body.name,
    location: req.body.location,
    message: req.body.message
  });

  // save new post
  newPost.save(function (err, savedPost) {
    res.json(savedPost);
  });
});

// listen on port 3000
app.listen(process.env.PORT || 3000)
  console.log("It's ALIVE!!");














