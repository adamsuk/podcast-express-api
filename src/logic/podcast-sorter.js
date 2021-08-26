var sorter = (podcasts, { key, type }) => podcasts.sort((a, b) => {
  if (type === 'ascending') {
    return (a[key] ? a[key] : Infinity) - (b[key] ? b[key] : Infinity);
  } if (type === 'descending') {
    return (b[key] ? b[key] : -Infinity) - (a[key] ? a[key] : -Infinity);
  }
  throw Error(`Podcast type '${type}' not supported`);
});

module.exports = {
  sorter
};
