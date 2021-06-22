const Joi = require('joi');

const post_schema = Joi.object().keys({
  feed_url: Joi.string().uri().required(),
  podcast_filter: Joi.object({
    "key": Joi.string().required(),
    "value": Joi.string().required(),
    "match": Joi.string().required(),
  }).optional(),
});

module.exports = {
  POST: post_schema
};
