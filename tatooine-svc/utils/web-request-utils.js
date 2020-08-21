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
      
      // Convert the body into JSON
      let jsonBody = body;
      try {
        jsonBody = JSON.parse(body);
      } catch {}

      // If the body is not valid JSON, return it. It's probably text or HTML
      try {
        JSON.stringify(jsonBody)
      } catch {
        return callback(module.exports.convertToGenericResponse(
          res.statusCode,
          res.headers["content-type"],
          body,
          parsedData
        ));
      }

      // Function to execute the json path
      let tryJsonParse = function(obj, path) {
        if (path) {
          try {
            return parsedData = jpath.value(obj, path);
          } catch {
            return null;
          }
        }
      };

      return callback(module.exports.convertToGenericResponse(
        res.statusCode,
        res.headers["content-type"],
        JSON.stringify(jsonBody, null, 2).trim(),
        tryJsonParse(jsonBody, webRequest.JsonPathCategory),
        tryJsonParse(jsonBody, webRequest.JsonPathData)
      ));
    });
  },

  convertToGenericResponse: function(status, contentType, data, parsedCategory, parsedData) {
    return {
      "Status": status,
      "ContentType": contentType,
      "Data": data,
      "ParsedCategory": parsedCategory,
      "ParsedData": parsedData
    }
  },

  convertBodyToRequest: function(body) {
    let request = {
      "Name": body.Name,
      "Url": body.Url,
      "JsonPathCategory": body.JsonPathCategory,
      "JsonPathData": body.JsonPathData,
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