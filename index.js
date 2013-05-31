var request = require('superagent')
  , Collection = require('collection')

module.exports = function anonymous(model){
  
  model.collection = function(meth,path){
    this[meth] = function(ids){
      return new Query(this, path || meth, ids);
    }
  }

  function Query(model,path,ids){
    this.model = model; this.path = path; this.ids = ids;
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
      , url  = (path[0] == '/' ? path : model.url(this.resolvedPath()));
    var req = request.get(url)
    for (var i=0;i<this._query.length;++i) req = req.query(this._query[i]);
    req.end(function(res){
      if (res.error) return fn(error(res));
      var col = new Collection;
      for (var i = 0, len = res.body.length; i < len; ++i) {
        col.push(new model(res.body[i]));
      }
      fn(null, col);
    });
    return this;
  }

}

function error(res) {
  return new Error('got ' + res.status + ' response');
};

