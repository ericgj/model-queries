
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


function reset(fn) {
  request.del('/', function(res){
    fn();
  });
}


describe('Sub-entity query', function(){
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
})