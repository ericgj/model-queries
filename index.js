var request = require('superagent')
  , Collection = require('collection')

module.exports = function anonymous(model){
  
  model.endpoint = function(meth,path,parse){
    this[meth] = function(ids){
      return new Query(this, path || meth, ids, parse);
    }
  }

  model.collection = function(meth,path){
    this.endpoint(meth, path, function(res,fn){
      if (res.error) return fn(error(res));
      var col = new Collection;
      for (var i = 0, len = res.body.length; i < len; ++i) {
        col.push(new model(res.body[i]));
      }
      fn(null, col);
    });
  }
}

function Query(model,path,ids,parse){
  path = resolvePath(path,ids);
  this.base = (path[0] == '/' ? path : model.url(path)); 
  this.parse = parse;
  this.reset();
}

Query.prototype.queryString = 
Query.prototype.query = function(val){
  this._req.query(val);
  return this;
}

Query.prototype.run = function(fn) {
  var parse = this.parse;
  var self = this;
  this._req.end( function(res){ 
    self.reset();
    return parse ? parse(res, fn) : fn(res); 
  });
  return this;
}

Query.prototype.reset = function(){
  this._req = request.get(this.base);
  return this;
}

function resolvePath(path,ids){
  var ret = path.replace(/:(\w+)/g, function(_,key){ 
              return ids[key] == null ? key : ids[key];
            });
  return ret;
}

function error(res) {
  return new Error('got ' + res.status + ' response');
};

