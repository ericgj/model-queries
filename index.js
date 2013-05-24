var request = require('superagent')
  , Collection = require('collection')

module.exports = function anonymous(model){
  
  model.query = function(meth,path,query){
    this[meth] = function(params,fn){
      var path = resolvePath(path,query,params);
      return this.select(path,fn);
    }
  }

  model.select = function(path,fn){
    var self = this
      , url  = this.url(path);
    request.get(url, function(res){
      if (res.error) return fn(error(res));
      var col = new Collection;
      for (var i = 0, len = res.body.length; i < len; ++i) {
        col.push(new self(res.body[i]));
      }
      fn(null, col);
    });
  }
}

function resolvePath(path,query,params){
  var ret = path.replace(/:(\w)+/ig, function(_,key){ 
              return params[key] || ':' + key; 
            });
  qvars = [];
  for (var k in query){
    if (params[k]) qvars.push( [query[k],params[k]].join('=') );
  }
  ret = ret + '?' + qvars.join('&');
  return ret;
}

