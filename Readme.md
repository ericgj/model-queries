
# model-queries

  Custom collection endpoints for component/model

## Installation

    $ component install ericgj/model-queries

## Usage

### Query strings

```javascript

var queries = require('model-queries');

Post.use(queries);

Post.query('page', 'all');

Post.page().param({page: 2, limit: 20}).run( callback );
  //=>  GET /page/all?page=2&limit=20

/* or parameter by parameter */

Post.page().param('page',2).param('limit',20).run( callback );

```

### Sub-entities

```javascript

var queries = require('model-queries');

Post.use(queries);

Post.query('forUser', '/user/:id/post/all');
  
Post.forUser({id: 123}).run( callback );
  //=>  GET /user/123/post/all?p=2&n=20

```

### Sub-entities with query strings

``` javascript
Post.forUser({id: 123}).param({p: 2, n: 20}).run( callback );
  //=>  GET /user/123/post/all?p=2&n=20

```

## API

TODO


## License

  MIT
