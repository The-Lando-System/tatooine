const { v4: uuidv4 } = require('uuid');
const resUtils = require('../utils/response-utils');
const webRequestUtils = require('../utils/web-request-utils');
const WebRequest = require('../models/WebRequest');

module.exports = function(app) {
  
  // Get all requests
  app.get('/request', function(req,res) {
    WebRequest.find((err, requests) => {
      if (err) { return res.status(500).send(resUtils.errorResponse(err)); }
      return res.status(200).send(resUtils.dataResponse(requests));
    });
  });

  // Get request by ID
  app.get('/request/:id', function(req,res) {
    WebRequest.find({ _id: req.params.id }, (err, requests) => {
      if (err) { return res.status(500).send(resUtils.errorResponse(err)); }
      if (requests.length === 0) {
        return res.status(400).send(
          resUtils.errorResponse(`Failed to find web request with ID [${req.params.id}]`)
        );
      }
      const webRequest = requests[0];
      return res.status(200).send(resUtils.dataResponse(webRequest));
    });
  });

  // Create new request
  app.post('/request/:id', function(req,res) {
    let newRequest = webRequestUtils.convertBodyToRequest(req.body);
    newRequest["_id"] = uuidv4();
    newRequest["LastModified"] = new Date();
    
    WebRequest.create(newRequest, (err, createdRequest) => {
      if (err) { return res.status(500).send(resUtils.errorResponse(err)); }
      return res.status(200).send(resUtils.dataResponse(createdRequest));
    });

  });

  // Delete request
  app.delete('/request/:id', function(req,res) {
    WebRequest.find({ _id: req.params.id }, (err, requests) => {
      if (err) { return res.status(500).send(resUtils.errorResponse(err)); }
      if (requests.length === 0) {
        return res.status(400).send(
          resUtils.errorResponse(`Failed to delete. No web request found with ID [${req.params.id}]`)
        );
      }
      WebRequest.deleteOne({_id: req.params.id }, (err, webRequest) => {
        if (err) { return res.status(500).send(resUtils.errorResponse(err)); }
        return res.status(200).send(resUtils.dataResponse(webRequest));
      });
    });
  });

  // Edit request
  app.put('/request/:id', function(req,res) {
    WebRequest.find({ _id: req.params.id }, (err, requests) => {
      if (err) { return res.status(500).send(resUtils.errorResponse(err)); }
      if (requests.length === 0) {
        return res.status(400).send(
          resUtils.errorResponse(`Failed to edit. No web request found with ID [${req.params.id}]`)
        );
      }
      let webRequest = requests[0];

      webRequest.Name = req.body.Name || webRequest.Name;
      webRequest.Url = req.body.Url || webRequest.Url;
      webRequest.Method = req.body.Method || webRequest.Method;
      webRequest.RequestBody = req.body.RequestBody || webRequest.RequestBody;
      webRequest.ContentType = req.body.ContentType || webRequest.ContentType;
      webRequest.AuthType = req.body.AuthType || webRequest.AuthType;
      webRequest.AuthUrl = req.body.AuthUrl || webRequest.AuthUrl;
      webRequest.ApiKey = req.body.ApiKey || webRequest.ApiKey;
      webRequest.ApiSecret = req.body.ApiSecret || webRequest.ApiSecret;

      webRequest.LastModified = new Date();

      webRequest.save((err,savedRequest) => {
        if (err) { return res.status(500).send(resUtils.errorResponse(err)); }
        return res.status(200).send(resUtils.dataResponse(savedRequest));
      });
    });
  });
  
  // Execute a request
  app.post('/execute', function(req,res) {
    let webRequest = webRequestUtils.convertBodyToRequest(req.body);
    if (webRequest.AuthType === 'OAuth2') {
      webRequestUtils.executeOauthRequest(webRequest, (response) => {
        return res.status(200).send(response);
      }); 
    } else {
      webRequestUtils.executeRequest(webRequest, (response) => {
        return res.status(200).send(response);
      });
    }
  });

  // Execute a request by ID
  app.post('/execute/:id', function(req,res) {
    WebRequest.find({ _id: req.params.id }, (err, requests) => {
      if (err) { return res.status(500).send(resUtils.errorResponse(err)); }
      if (requests.length === 0) {
        return res.status(400).send(
          resUtils.errorResponse(`Failed to execute request. No web request found with ID [${req.params.id}]`)
        );
      }
      let webRequest = requests[0];

      webRequestUtils.executeRequest(webRequest, (response) => {
        console.log(response);
        return res.status(200).send(response);
      });

    }); 
  });
};