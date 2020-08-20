const constants = require('../constants');
const mongoose = require('mongoose');
const request = require('request');
const jpath = require('jsonpath');

module.exports = {

  executeOauthRequest: function(webRequest, callback) {

    const authStr = Buffer.from(
      webRequest.ApiKey + ':' + webRequest.ApiSecret
    ).toString('base64');

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + authStr
    }

    const options = {
      url: webRequest.AuthUrl,
      method: 'Post',
      headers: headers,
      form: {'grant_type': 'client_credentials'}
    };

    request(options, function(err, res, body) {
      if (err) { return callback(module.exports.convertToGenericResponse(500, 'Text', err.message, '')); }
      if (res.statusCode === 400) { return callback(module.exports.convertToGenericResponse(500, 'Text', body, '')); }

      try {
        body = JSON.parse(body);
      } catch(e) {
        return callback(module.exports.convertToGenericResponse(500, 'Text', e, ''));
      }
    
      module.exports.executeRequest(webRequest, callback, body.access_token);
    });

  },

  executeRequest: function(webRequest, callback, accessToken) {

    const options = {
      url: webRequest.Url,
      method: webRequest.Method,
      headers: {
        'Content-Type' : webRequest.ContentType ? webRequest.ContentType : 'application/json'
      }
    };

    if (webRequest.Method === 'Post') {
      options.json = JSON.parse(webRequest.RequestBody);
    }

    if (accessToken) {
      options.headers['Authorization'] = `Bearer ${accessToken}`; 
    }

    request(options, (err, res, body) => {
      if (err) { return callback(module.exports.convertToGenericResponse(500, 'Text', err.message, '')); }
      
      // Parse the json path
      let obj = {};
      try {
        obj = JSON.parse(body);
      } catch(e) {

      }

      let parsedData = '';
      if (webRequest.JsonPath) {
        parsedData = jpath.value(obj, webRequest.JsonPath);
      }
      
      return callback(module.exports.convertToGenericResponse(
        res.statusCode,
        res.headers["content-type"],
        body,
        parsedData
      ));
    });
  },

  convertToGenericResponse: function(status, contentType, data, parsedData) {
    return {
      "Status": status,
      "ContentType": contentType,
      "Data": data,
      "ParsedData": parsedData
    }
  },

  convertBodyToRequest: function(body) {
    let request = {
      "Name": body.Name,
      "Url": body.Url,
      "JsonPath": body.JsonPath,
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