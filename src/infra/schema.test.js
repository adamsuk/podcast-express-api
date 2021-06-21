var schema = require("./schema");
const Joi = require('joi');

const dataToValidate = { 
  feed_url: "https://audioboom.com/channels/2399216.rss",
  podcast_filter: {
    key: "episode",
    value: "11",
    match: "exact"
  }
}

describe('Validate Basic Schema Inputs', () => {
  it(`should test reponse is ${dataToValidate}`, () => {
    var result = schema.validate(dataToValidate)
    expect(result).toEqual({value: dataToValidate});
    expect(result.error).toBeUndefined();
  })
});
