const Joi = require('joi');

const schema = Joi.object().keys({
  feed_url: Joi.string().uri().required(),
  podcast_filter: Joi.object({
    "key": Joi.string().required(),
    "value": Joi.string().required(),
    "match": Joi.string().required(),
  }).optional(),
});

module.exports = schema;
