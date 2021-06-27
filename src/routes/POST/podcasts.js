var _ = require('lodash/core');
var { find_all_podcasts, filter_podcasts } = require('../../logic/read-rss-feed');
var podcasts = require('../../data/podcasts.json');
var { InvalidReqError } = require('../../infra/errors');

var get_req_podcasts = (req, res, next) => {
  // todo: req validation!
  if (Object.keys(req.body).length !== 0) {
    // check to see if filtering is needed
    if (_.has(req.body, 'podcast_filter')) {
      filter_podcasts(req.body).then((all_podcasts) => {
        res.send(all_podcasts);
      }).catch((err) => {
        console.log(err);
        throw Error(err.message);
      });
    }
    else {
      find_all_podcasts(req.body).then((all_podcasts) => {
        res.send(all_podcasts);
      }).catch((err) => {
        console.log(err);
        throw Error(err.message);
      });
    }
  }
  else {
    throw new InvalidReqError("Invalid request. Think you're missing a lil body");
  }
};

module.exports = get_req_podcasts;
