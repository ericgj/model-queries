
# model-queries

  Custom collection endpoints for component/model

## Installation

    $ component install ericgj/model-queries

## Usage

```javascript

var queries = require('model-queries');

Post.use(queries);

Post.query('page', 'page/:page', {limit: 'n'});

Post.page({page: 2, limit: 20}, callback);
  //  GET /post/page/2?n=20

Post.select('page/2?n=20', callback);
  //  GET /post/page/2?n=20

```

## API

   

## License

  MIT
