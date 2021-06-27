var status = (req, res, next) => {
  res.status(200).send('Healthy');
};

module.exports = status;
