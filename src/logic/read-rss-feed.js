var Parser = require('rss-parser');
var { sorter } = require('./podcast-sorter');

var find_all_podcasts = async ({ feed_url, podcast_sort = null }) => {
  var parser = new Parser();
  return parser.parseURL(feed_url).then((feed) => {
    var podcasts = [];
    // loop over the response and cherry pick data
    feed.items.forEach((item) => {
      podcasts.push({
        episode: parseInt(item.itunes.episode),
        show: item.itunes.author || feed.title,
        title: item.title,
        url: item.enclosure.url,
        type: item.enclosure.type,
        image: item.itunes.image || item.image,
        date: new Date(item.pubDate)
      });
    });
    // is sorting needed?
    if (podcast_sort) {
      podcasts = sorter(podcasts, podcast_sort);
    }
    return podcasts;
  }).catch((err) => {
    console.log(err);
    throw Error('Failed to find podcasts');
  });
};

var filter_podcasts = async ({ feed_url, podcast_filter }) => await find_all_podcasts({ feed_url }).then((result) => result.filter((el) => {
  if (el[podcast_filter.key]) {
    if (podcast_filter.match == 'includes') {
      return el[podcast_filter.key].toString().includes(podcast_filter.value);
    }
    if (podcast_filter.match == 'exact') {
      return el[podcast_filter.key] == podcast_filter.value;
    }
  }
})).catch((err) => {
  console.log(err);
  throw Error('Failed to filter podcasts');
});

module.exports = {
  find_all_podcasts,
  filter_podcasts
};
