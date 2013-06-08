
var request = require('visionmedia-superagent')
  , model = require('component-model')
  , queries = require('model-queries')
  , assert = require('component-assert');

var User = model('User')
  .attr('id', { type: 'number' })
  .attr('name', { type: 'string' })
  .attr('age', { type: 'number' });
  
var Pet = model('Pet')
  .attr('id')
  .attr('name')
  .attr('species');

Pet.use(queries);
Pet.collection('forUser', '/user/:id/pet/all');

Pet.collection('page');

Pet.endpoint('count', 'count', function(res,fn){
  if (res.error) return fn("error");
  fn(null, res.body.total);
});

describe('Queries', function(){
  beforeEach(function(done){
    User.removeAll(done);
    Pet.removeAll(done);
  });

  beforeEach(function(done){
    var tobi = new Pet({ name: 'tobi', species: 'Ferret' });
    var loki = new Pet({ name: 'loki', species: 'Cat' });
    var jane = new Pet({ name: 'jane', species: 'Rabbit' });
    
    var kevin = new User({name: 'kevin', age: 10});
    var catherine = new User({name: 'catherine', age: 8});
    
    var self = this;
    kevin.save(function(){
      catherine.save(function(){
        tobi.save(function(){
          loki.save(function(){
            jane.save(function(){
            
              request.put('/user/' + kevin.id() + /pet/ + loki.id()).end(function(){
                request.put('/user/' + kevin.id() + /pet/ + jane.id()).end(function(err,res){
                  done();
                });
              });
              
            });
          });
        });
      });
    });
        
  })

  it('Pet.forUser({id: kevin.id}) should respond with a collection of all pets belonging to kevin', function(done){
    Pet.forUser({id: 0}).run(function(err, pets){
      assert(!err);
      assert(pets);
      assert(2 == pets.length());
      assert('loki' == pets.at(0).name());
      assert('jane' == pets.at(1).name());
      done();
    });
  })

  it('Pet.page().query({page:1, limit:2}) should respond with a collection of pets starting from the 2nd page of 2', function(done){
    Pet.page().query({page: 1}).query('limit=2').run(function(err, pets){
      assert(!err);
      assert(pets);
      assert(1 == pets.length());
      assert('jane' == pets.at(0).name());
      done();
    });
  })

  it('Pet.count endpoint should respond with the total number of pets', function(done){
    Pet.count().run( function(err, n){
      assert(!err);
      assert(3 == n);
      done();
    });
  })

  it('Query should reset to base after running', function(done){
    var q = Pet.page();
    q.query({page: 1}).run(function(err, pets){ 
      assert('/pet/page' == q.base);
      assert(q.base == q._req.url);
      done();
    })
  })

})
