
# model-queries

  Custom endpoints for component/model

## Installation

    $ component install ericgj/model-queries

## Usage


### Query strings

```javascript

var queries = require('model-queries');

Post.use(queries);

Post.collection('page', 'all');

Post.page().query({page: 2, limit: 20}).run( callback );
  //=>  GET /post/all?page=2&limit=20

/* 
 * Or specify parameters separately, objects or strings
 * Interface is identical to superagent `request.query`
 *
 */
Post.page().query({page: 2}).query('limit=20').run( callback );

```


### Sub-entities

```javascript

var queries = require('model-queries');

Post.use(queries);

Post.collection('forUser', '/user/:id/post/all');
  
Post.forUser({id: 123}).run( callback );
  //=>  GET /user/123/post/all

```


### Sub-entities with query strings

``` javascript
Post.forUser({id: 123}).query({p: 2, n: 20}).run( callback );
  //=>  GET /user/123/post/all?p=2&n=20

```


### Custom response parsing

``` javascript
var queries = require('model-queries');

Post.use(queries);

/* for example, to parse nested entities */

Post.endpoint('withComments', ':id', function(res,fn){
  var comments = res.body.comments;
  delete res.body.comments;
  var col = new Collection;
  for (var i = 0, len = comments.length; i < len; ++i) {
    col.push(new Comment(comments[i]));
  }
  var post = new Post(res.body);
  post.comments = col;
  fn(null, post);
}

var callback = function(err,post){ /* post has comments collection */ };

Post.withComments({id: 123}).query({comments: 1}).run( callback );
  //=>  GET /post/123?comments=1

```

  
## API

### Model.collection( method, [path] )

Define a _collection query endpoint_ for the model called as `Model.method`.
When these queries are run, the response is parsed as a Collection of model
instances. If path is not given, `Model.url(method)` is the default.

### Model.endpoint( method, [path], [parse] )

Define a query endpoint for the model with the given parse function for the
responses. If path is not given, `Model.url(method)` is the default. If no
parse function is given, the response will be passed to the callback
directly from superagent.


## License

  MIT
