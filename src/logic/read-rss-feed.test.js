var { find_all_podcasts, filter_podcasts } = require('./read-rss-feed');

// NOTE - these tests work due to both podcasts having 10+ episodes
var feed_urls = [
  'https://audioboom.com/channels/2399216.rss',
  'https://rss.acast.com/mydadwroteaporno'
];

for (const feed_url of feed_urls) {
  describe('Read RSS Feed Function', () => {
    it(`it should produce an array version of the feed: ${feed_url}`, () => find_all_podcasts({ feed_url }).then((data) => {
      console.log(`${feed_url} = ${data.length}`);
      expect(data.length).toBeGreaterThan(0);
    }));
  });
}

for (const feed_url of feed_urls) {
  describe('Filter RSS Feed Function (Includes)', () => {
    it(`it should produce a filtered (includes filtered) array version of the feed: ${feed_url}`, () => {
      const input = {
        feed_url,
        podcast_filter: {
          key: 'episode',
          value: '10',
          match: 'includes'
        }
      };
      return filter_podcasts(input).then((data) => {
        console.log(data);
        expect(data.length).toBeGreaterThan(0);
      });
    });
  });
}

for (const feed_url of feed_urls) {
  describe('Filter RSS Feed Function (Exact)', () => {
    it(`it should produce a filtered (includes exact) array version of the feed: ${feed_url}`, () => {
      const input = {
        feed_url,
        podcast_filter: {
          key: 'episode',
          value: '10',
          match: 'exact'
        }
      };
      return filter_podcasts(input).then((data) => {
        console.log(data);
        expect(data.length).toBeGreaterThan(0);
      });
    });
  });
}

// todo: test exceptions
