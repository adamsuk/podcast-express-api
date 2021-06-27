const Joi = require('joi');
var schema = require('./schema');

const postDataToValidate = {
  feed_url: 'https://audioboom.com/channels/2399216.rss',
  podcast_filter: {
    key: 'episode',
    value: '11',
    match: 'exact'
  }
};

describe('Validate Basic POST Schema Inputs', () => {
  it(`should test reponse is ${postDataToValidate}`, () => {
    var result = schema.POST.validate(postDataToValidate);
    expect(result).toEqual({ value: postDataToValidate });
    expect(result.error).toBeUndefined();
  });
});
