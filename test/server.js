
/**
 * Module dependencies.
 */

var express = require('express')
  , app = express();

// middleware

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/..'));

// faux db

var db = { pets: [], users: [], ownerships: {} };

// routes

/**
 * DELETE everythinggggg.
 */

app.del('/', function(req, res){
  db.pets = [];
  db.ownerships = {};
  res.send(200);
});


/**
 * GET all pets, paged
 */

app.get('/pet/page', function(req, res){
  var page = req.param('page',0), limit = req.param('limit',100);
  res.send(db.pets.slice(page * limit, (page * limit) + limit));
});

/**
 * DELETE all pets.
 */

app.del('/pet/all', function(req, res){
  db.pets = [];
  db.ownerships = {};
  res.send(200);
});


/**
 *  GET pet count
 */

app.get('/pet/count', function(req, res){
  res.send({total: db.pets.length});
});

/**
 * GET pet :id.
 */

app.get('/pet/:id', function(req, res){
  var pet = db.pets[req.params.id];
  if (!pet) return res.send(404, 'cant find pet');
  res.send(pet);
});

/**
 * POST to create a new pet.
 */

app.post('/pet', function(req, res){
  var pet = req.body;
  pet.id = db.pets.push(pet) - 1;
  res.send(pet);
});

/**
 * PUT to update pet :id.
 */

app.put('/pet/:id', function(req, res){
  var pet = db.pets[req.params.id];
  if (!pet) return res.send(404, 'cant find pet');
  db.pets[pet.id] = req.body;
  res.send(200);
});

/**
 * DELETE pet :id.
 */

app.del('/pet/:id', function(req, res){
  var pet = db.pets[req.params.id];
  if (!pet) return res.send(404, 'cant find pet');
  db.pets.splice(pet.id, 1);
  res.send(200);
});

// users

/**
 * DELETE all users.
 */

app.del('/user/all', function(req, res){
  db.users = [];
  db.ownerships = {};
  res.send(200);
});

/**
 * GET all users.
 */

app.get('/user/all', function(req, res){
  res.send(db.users);
});

/**
 * POST a new user.
 */

app.post('/user', function(req, res){
  var user = req.body;
  var id = db.users.push(user) - 1;
  user.id = id;
  res.send({ id: id });
});




/**
 * PUT a pet into ownership of a user.
 */

app.put('/user/:userid/pet/:petid', function(req, res){
  var user = db.users[req.params.userid];
  if (!user) return res.send(404, 'cant find user');
  var pet = db.pets[req.params.petid];
  if (!pet) return res.send(404, 'cant find pet');  
  (db.ownerships[req.params.userid] = db.ownerships[req.params.userid] || [])
    .push(req.params.petid);   
  res.send(200);  
});


/**
 * GET all pets owned by a user.
 */

app.get('/user/:userid/pet/all', function(req, res){
  var user = db.users[req.params.userid];
  if (!user) return res.send(404, 'cant find user');
  var ownerships = db.ownerships[req.params.userid] || [];
  var ret = [];
  for (var i=0; i<ownerships.length; ++i){
    ret.push( db.pets[ownerships[i]] );
  }
  res.send(ret);
});

app.listen(3000);
console.log('test server listening on port 3000');

