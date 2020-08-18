export default {
  
  requestUrl : 'http://localhost:3000',
  
  remove(http, id) {
    return new Promise((resolve,reject) => {
      http.delete(`${this.requestUrl}/request/${id}`)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
    }); 
  },
  update(http, request) {
    return new Promise((resolve,reject) => {
      http.put(`${this.requestUrl}/request/${request._id}`, request)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
    }); 
  },
  save(http, request) {
    return new Promise((resolve,reject) => {
      http.post(this.requestUrl, request)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error);
      });
    }); 
  },
  submit(http, request) {
    return new Promise((resolve,reject) => {
      http.post(`${this.requestUrl}/execute`, request)
      .then(response => {
        response = response.data;
        if (response.hasOwnProperty('Data')){
          resolve(this.formatResponseData(response));
        } else {
          resolve(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
    });
  },
  getSavedRequests(http) {
    return new Promise((resolve,reject) => {
      http.get(`${this.requestUrl}/request`)
      .then(response => {
        resolve(response.body.data);
      })
      .catch((error) => {
        reject(error);
      });
    });
  },
  submitRequestById(http, id) {
    return new Promise((resolve,reject) => {
      http.post(`${this.requestUrl}/execute/${id}`, {})
      .then(response => {
        response = response.body.data;
        if (response.hasOwnProperty('Data')){
          resolve(this.formatResponseData(response));
        } else {
          reject(response);
        }
      });
    });
  },
  formatResponseData(response) {
    try {
      response['Data'] = JSON.stringify(JSON.parse(response['Data']), null, 2).trim();
    } catch (e) {
      try {
        response['Data'] = JSON.stringify(response['Data'], null, 2);
      } catch (e2) {
        try {
          response['Data'] = response['Data'].trim();
        } catch (e3) {
          response['Data'] = response.trim();
        }
      }
    }
    return response;
  }
}