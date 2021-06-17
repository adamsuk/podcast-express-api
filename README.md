# Podcast API - Express
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This repo contains the source code for a backend express API for obtaining podcasts from RSS feeds. This builds on my Express.js API boilerplate.

## Specifics

This API has three routes, all `GET` based routes utilise a built-in collection of podcast RSS feeds for quick access:

#### GET
- all-podcasts - does what it says on the tin, returns all podcasts from a built-in list of podcast RSS feeds.
- random-podcast - my favourite, returns a complete random podcast from the complete set returned from a `all-podcasts` request.

#### POST
- podcasts - requires specific data in the request body (see examples) to return an array of podcasts from the supplied RSS feed (this includes filtering).

## Examples

All `GET` commands come pre-packaged so firing off a standard request to these will return an array of podcasts.

`POST` to `/podcasts` requires a specific data shape, these include:
- `feed_url` (required) the HTTPS address of the RSS feed
- `podcast_filter` (optional) if specified a the full list of podcasts will be reduced
  - `key` (required if `podcast_filter` specified) used to determine the RSS feed key used for filtering
  - `value` (required if `podcast_filter` specified) used to filter the `key` specified in the RSS feed 
  - `match` (required if `podcast_filter` specified) currently either:
    - `includes` - all podcasts with the `value` partially found in `key` will be returned
    - `exact` - all podcasts with an exact match between the `key` value and the `value` specified will be returned.

When ran in dev mode a `POST` to `http://localhost:3001/podcasts` with request body:
```
{ 
    "name": "No Such Thing As A Fish",
    "feed_url": "https://audioboom.com/channels/2399216.rss",
    "podcast_filter": {
        "key": "episode",
        "value": "11",
        "match": "exact"
    }
}
```

currently returns:

```
[
    {
        "episode": "11",
        "show": "No Such Thing As A Fish",
        "title": "11: No Such Thing As A Door Knob In Vancouver",
        "url": "https://audioboom.com/posts/2171460.mp3?modified=1599217042&source=rss&stitched=1",
        "type": "audio/mpeg",
        "image": "https://images.theabcdn.com/i/36345824.jpg"
    }
]
```