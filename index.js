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

  function Query(model,path,ids,parse){
    this.model = model; this.path = path; this.ids = ids; this.parse = parse;
    this._query = [];
    return this;
  }

  Query.prototype.resolvedPath = function(){
    var params = this.params || {}, path = this.path, ids = this.ids;
    var ret = path.replace(/:(\w+)/g, function(_,key){ 
                return ids[key] == null ? key : ids[key];
              });
    return ret;
  }

  Query.prototype.query = function(val){
    this._query.push(val);
    return this;
  }
 
  Query.prototype.run = function(fn) {
    var model = this.model
      , path = this.resolvedPath()
      , url  = (path[0] == '/' ? path : model.url(path))
      , parse = this.parse;
    var req = request.get(url)
    for (var i=0;i<this._query.length;++i) req.query(this._query[i]);
    req.end( function(res){ return parse ? parse(res, fn) : fn(res); });
    return this;
  }

}

function error(res) {
  return new Error('got ' + res.status + ' response');
};

