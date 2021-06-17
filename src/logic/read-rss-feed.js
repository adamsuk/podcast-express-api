var Parser = require('rss-parser');

/* EXAMPLE DATA SHAPE
const input = { 
    name: 'No Such Thing As A Fish',
    feed_url: "https://audioboom.com/channels/2399216.rss",
    podcast_filter: {
        key: 'episode',
        value: '10',
        match: 'exact'
    }
};
*/

var find_all_podcasts = async ({ feed_url }) => {
  var parser = new Parser();
  return parser.parseURL(feed_url).then(feed => {
    var podcasts = [];
    // loop over the response and cherry pick data
    feed.items.forEach(item => {
      podcasts.push({
        episode: item.itunes.episode,
        show: item.itunes.author,
        title: item.title,
        url: item.enclosure.url,
        type: item.enclosure.type,
        image: item.itunes.image
      });
    });
    return podcasts;
  }).catch(err => {
    console.log(err);
    throw Error('Failed to find podcasts');
  });
};

var filter_podcasts = async ({ feed_url, podcast_filter }) => {
  return await find_all_podcasts({ feed_url }).then(result => {
    return result.filter(function (el) {
      if (el[podcast_filter.key]) {
        if (podcast_filter.match == 'includes') {
          return el[podcast_filter.key].toString().includes(podcast_filter.value);
        }
        else if (podcast_filter.match == 'exact') {
          return el[podcast_filter.key] == podcast_filter.value;
        }
      };
    });
  }).catch(err => {
    console.log(err);
    throw Error('Failed to filter podcasts');
  })
};

/* EXAMPLE CALLING SYNTAX
// see https://flaviocopes.com/how-to-return-result-asynchronous-function/

(async () => {
    //find_all_podcasts(input).then(result => {
    filter_podcasts(input).then(result => {
        console.log(result);
    });
})()
*/

module.exports = {
    find_all_podcasts,
    filter_podcasts
};
