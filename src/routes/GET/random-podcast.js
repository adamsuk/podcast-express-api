var { find_all_podcasts } = require('../../logic/read-rss-feed');
var podcasts = require('../../data/podcasts.json');

var random_podcast = (req, res, next) => {
  // build up bank of podcast promises from rss streams
  var podcast_promises = [];
  podcasts.rss_urls.forEach(async (podcast_url) => {
    podcast_promises.push(find_all_podcasts({ feed_url: podcast_url }));
  });
  // get returns from all promises
  Promise.all(podcast_promises).then((all_podcasts) => {
    all_podcasts = all_podcasts.flat(1);
    random_i = Math.floor(Math.random() * all_podcasts.length);
    res.send(all_podcasts[random_i]);
  }).catch((err) => {
    console.log(err);
    throw Error(err.message);
  });
};

module.exports = random_podcast;
