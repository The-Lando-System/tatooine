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
  submit(http, request) {
    return new Promise((resolve,reject) => {
      http.post(`${this.requestUrl}/execute`, request)
      .then(response => {
        resolve(response.data);
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
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
    });
  }
}