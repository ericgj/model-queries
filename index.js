var request = require('superagent')
  , Collection = require('collection')
  , esc     = encodeURIComponent

module.exports = function anonymous(model){
  
  model.query = function(meth,path){
    this[meth] = function(ids){
      return new Query(this,path,ids);
    }
  }

  function Query(model,path,ids){
    this.model = model; this.path = path; this.ids = ids;
    this.params = {};
    return this;
  }

  Query.prototype.resolvedPath = function(){
    var params = this.params || {}, path = this.path, ids = this.ids;
    var ret = path.replace(/:(\w)+/ig, function(_,key){ 
                return ids[key] || ':' + key; 
              });
    var qvars = [];
    for (var k in params){
      qvars.push( [esc(k),esc(params[k])].join('=') );
    }
    ret = ret + (qvars.length ? '?' + qvars.join('&') : '');
    return ret;
  }

  Query.prototype.param = function(){
    if (arguments.length == 0) return this;
    switch(arguments.length){
      case 1:
        this.params = arguments[0]; break;
      default:
        this.params[arguments[0]] = arguments[1]; break;
    }
    return this;
  }
  
  Query.prototype.run = function(fn) {
    var model = this.model
      , path = this.resolvedPath()
      , url  = (path[0] == '/' ? path : model.url(this.resolvedPath()));
    request.get(url, function(res){
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

