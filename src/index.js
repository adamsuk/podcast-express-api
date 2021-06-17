var app = require('./app');
var envs = require('./envs');

app.listen(envs.PORT, () => {
    console.log(`Listening on port ${envs.PORT}`);
});
