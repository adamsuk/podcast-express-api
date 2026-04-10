var CORS_ORIGINS = [
  'https://sradams-co-uk-content.pages.dev',
  'https://sradams.co.uk'
];

function corsHeaders(origin) {
  if (CORS_ORIGINS.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
  }
  return { 'Access-Control-Allow-Origin': '*' };
}

function handleCORS(request) {
  var origin = request.headers.get('Origin') || '';
  return corsHeaders(origin);
}

var RSS_URLS = [
  "https://audioboom.com/channels/2399216.rss",
  "https://rss.acast.com/mydadwroteaporno",
  "https://rss.acast.com/adambuxton",
  "http://feeds.getmortified.com/MortifiedPod?format=xml",
  "https://podcasts.files.bbci.co.uk/b08fr7t1.rss",
  "https://rss.acast.com/the-horne-section-podcast",
  "https://rss.acast.com/sma"
];

var parser = {
  parse: async function(feedUrl) {
    var response = await fetch(feedUrl);
    var text = await response.text();
    return this.parseString(text);
  },
  parseString: function(xml) {
    var items = [];
    var itemMatches = xml.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || [];
    
    for (var i = 0; i < itemMatches.length; i++) {
      var itemXml = itemMatches[i];
      items.push({
        title: this.extractTag(itemXml, 'title'),
        itunes: {
          episode: this.extractTag(itemXml, 'episode'),
          author: this.extractTag(itemXml, 'itunes:author') || this.extractTag(itemXml, 'author'),
          image: this.extractTag(itemXml, 'itunes:image') || this.extractTag(itemXml, 'image')
        },
        enclosure: {
          url: this.extractTag(itemXml, 'enclosure', 'url'),
          type: this.extractTag(itemXml, 'enclosure', 'type')
        },
        pubDate: this.extractTag(itemXml, 'pubDate')
      });
    }
    
    var channelMatch = xml.match(/<channel>([\s\S]*?)<\/channel>/i);
    var title = 'Unknown';
    if (channelMatch) {
      var titleMatch = channelMatch[1].match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/i);
      if (titleMatch) title = titleMatch[1] || titleMatch[2];
    }
    
    return { title: title, items: items };
  },
  extractTag: function(xml, tag, attr) {
    var match;
    if (attr) {
      var attrRegex = new RegExp('<' + tag + '[^>]*' + attr + '="([^"]*)"', 'i');
      match = xml.match(attrRegex);
      return match ? match[1] : null;
    }
    var cdataRegex = new RegExp('<' + tag + '><!\\[CDATA\\[(.*?)\\]\\]><\\/' + tag + '>', 'i');
    var simpleRegex = new RegExp('<' + tag + '>([^<]*)<\\/' + tag + '>', 'i');
    match = xml.match(cdataRegex) || xml.match(simpleRegex);
    return match ? match[1].trim() : null;
  }
};

function sorter(data, sortConfig) {
  var key = sortConfig.key;
  var type = sortConfig.type;
  
  return data.sort(function(a, b) {
    var aVal = a[key];
    var bVal = b[key];
    
    if (key === 'date') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }
    
    if (type === 'descending') {
      return bVal - aVal;
    }
    return aVal - bVal;
  });
}

async function findAllPodcasts(feedUrl, podcastSort) {
  try {
    var feed = await parser.parse(feedUrl);
    var podcasts = [];
    
    for (var i = 0; i < feed.items.length; i++) {
      var item = feed.items[i];
      podcasts.push({
        episode: parseInt(item.itunes.episode) || 0,
        show: feed.title || item.itunes.author,
        title: item.title,
        url: item.enclosure.url,
        type: item.enclosure.type,
        image: item.itunes.image,
        date: item.pubDate ? new Date(item.pubDate).toISOString() : null
      });
    }
    
    if (podcastSort) {
      podcasts = sorter(podcasts, podcastSort);
    }
    return podcasts;
  } catch (err) {
    throw new Error('Failed to find podcasts: ' + err.message);
  }
}

async function filterPodcasts(feedUrl, filter) {
  var result = await findAllPodcasts(feedUrl);
  return result.filter(function(el) {
    if (el[filter.key]) {
      if (filter.match === 'includes') {
        return el[filter.key].toString().includes(filter.value);
      }
      if (filter.match === 'exact') {
        return el[filter.key] == filter.value;
      }
    }
  });
}

async function handleRequest(request) {
  var url = new URL(request.url);
  var path = url.pathname.slice(1);
  var method = request.method;
  var origin = request.headers.get('Origin') || '';
  var cors = handleCORS(request);
  
  if (method === 'OPTIONS') {
    return new Response('', { status: 204, headers: cors });
  }
  
  if (method === 'GET' && path === 'status') {
    return new Response('Healthy', { status: 200, headers: cors });
  }
  
  if (method === 'GET' && path === 'all-podcasts') {
    var podcastPromises = [];
    for (var i = 0; i < RSS_URLS.length; i++) {
      podcastPromises.push(findAllPodcasts(RSS_URLS[i]));
    }
    var allPodcasts = await Promise.all(podcastPromises);
    var sorted = sorter(allPodcasts.flat(1), { key: 'date', type: 'descending' });
    return new Response(JSON.stringify(sorted), {
      status: 200,
      headers: Object.assign({ 'Content-Type': 'application/json' }, cors)
    });
  }
  
  if (method === 'GET' && path === 'random-podcast') {
    var randomPromises = [];
    for (var j = 0; j < RSS_URLS.length; j++) {
      randomPromises.push(findAllPodcasts(RSS_URLS[j]));
    }
    var randomAll = await Promise.all(randomPromises);
    var flat = randomAll.flat(1);
    var randomIndex = Math.floor(Math.random() * flat.length);
    return new Response(JSON.stringify(flat[randomIndex]), {
      status: 200,
      headers: Object.assign({ 'Content-Type': 'application/json' }, cors)
    });
  }
  
  if (method === 'POST' && path === 'podcasts') {
    var body = await request.json();
    
    if (!body || Object.keys(body).length === 0) {
      return new Response(JSON.stringify({
        name: 'InvalidReqError',
        message: "Invalid request. Think you're missing a lil body"
      }), { status: 400, headers: Object.assign({ 'Content-Type': 'application/json' }, cors) });
    }
    
    var feedUrl = body.feed_url;
    if (!feedUrl) {
      feedUrl = RSS_URLS[0];
    }
    
    if (body.podcast_filter) {
      var filtered = await filterPodcasts(feedUrl, body.podcast_filter);
      return new Response(JSON.stringify(filtered), {
        status: 200,
        headers: Object.assign({ 'Content-Type': 'application/json' }, cors)
      });
    }
    
    var found = await findAllPodcasts(feedUrl, body.podcast_sort);
    return new Response(JSON.stringify(found), {
      status: 200,
      headers: Object.assign({ 'Content-Type': 'application/json' }, cors)
    });
  }
  
  return new Response(JSON.stringify({
    status: 'Error',
    message: 'Path not found'
  }), { status: 404, headers: Object.assign({ 'Content-Type': 'application/json' }, cors) });
}

addEventListener('fetch', function(event) {
  event.respondWith(handleRequest(event.request).catch(function(err) {
    return new Response(JSON.stringify({
      status: 'Error',
      message: err.message
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }));
});
