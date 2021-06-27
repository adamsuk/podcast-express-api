var sorter = (podcasts, { key, type }) => {
  return podcasts.sort((a, b) => {
    if (type == 'ascending') {
      return (a[key] ? a[key] : Infinity) - (b[key] ? b[key] : Infinity)
    } else if (type == 'descending') {
      return (b[key] ? b[key] : -Infinity) - (a[key] ? a[key] : -Infinity)
    } else {
      throw Error(`Podcast type '${type}' not supported`);
    }
  })
};

module.exports = {
  sorter
};
