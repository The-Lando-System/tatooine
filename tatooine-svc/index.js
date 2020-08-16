const express = require('express');
const cors = require('cors');
const logger = require('morgan');

const constants = require('./constants');
const webRequestUtils = require('./utils/web-request-utils');

const app = express();

app.use(cors());

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.send('tatooine-svc is running!');
});

require('./routes/google-auth-filter')(app);
require('./routes/web-request-routes')(app);

if (!webRequestUtils.connectToDatabase()) return;

app.listen(constants.PORT, () => {
  console.log('tatooine-svc is up and running on port ', constants.PORT);
});