const WebRequestModel = require('../models/WebRequest');
const constants = require('../constants');
const mongoose = require('mongoose');
const request = require('request');

module.exports = {

  executeRequest: function(webRequest, callback) {

    const options = {
      url: webRequest.Url,
      method: webRequest.Method
    };

    request(options, (err, res, body) => {
      if (err) { console.log(`ERROR: ${err}`); }
      return callback({
        "Status": res.statusCode,
        "ContentType": res.headers["content-type"],
        "Data": body
      });
    });
  },

  convertBodyToRequest: function(body) {
    let request = {
      "Name": body.Name,
      "Url": body.Url,
      "Method": body.Method,
      "RequestBody": body.RequestBody,
      "ContentType": body.ContentType,
      "AuthType": body.AuthType,
      "AuthUrl": body.AuthUrl,
      "ApiKey": body.ApiKey,
      "ApiSecret": body.ApiSecret
    };

    return request;
  },

  connectToDatabase: function() {

    if (constants.DB_CONNECTION === undefined) {
      console.log('Missing env variable: DB_CONNECTION');
      return false;
    }

    mongoose.connect(constants.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function(err) {
      if (err){
        console.log('ERROR! Could not connect to MongoDB!')
        if (err.message.includes('ECONNREFUSED')){
          console.log('The MongoDB connection was refused... Is your MongoDB running?');
          return false;
        }
      }
    });

    mongoose.Promise = global.Promise;
    return true;
  }
};