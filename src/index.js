var app = require('./infra/app');
var envs = require('./infra/envs');

app.listen(envs.PORT, () => {
  console.log(`Listening on port ${envs.PORT}`);
});
