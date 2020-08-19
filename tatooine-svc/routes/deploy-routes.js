const proc = require('child_process');
const resUtils = require('../utils/response-utils');
const WebRequest = require('../models/WebRequest');

module.exports = function(app) {
  
  // Deploy a Sandcrawler
  app.post('/deploy/:id', function(req,res) {
    WebRequest.find({ _id: req.params.id }, (err, requests) => {
      if (err) { return res.status(500).send(resUtils.errorResponse(err)); }
      if (requests.length === 0) { 
        return res.status(400).send(resUtils.errorResponse(`Failed to find web request with ID [${req.params.id}]`));
      }
      
      const containerId = proc.execSync('sh ./scripts/deploy_sandcrawler.sh').toString();
      return res.status(200).send(resUtils.dataResponse(containerId));
    });
  });

}