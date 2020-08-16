const gapi = window.gapi;

export default {

  init: function () {
      return initGoogleClient();
  },

  initGoogleUser: function () {

      return new Promise((resolve, reject) => {

          initGoogleClient().then(() => {
              const userDetails = gapi.auth2.getAuthInstance().currentUser.get();

              if (!userDetails) {
                  reject();
                  return;
              }

              const accessToken = userDetails.getAuthResponse().access_token;

              sessionStorage.removeItem("access-token");
              sessionStorage.setItem("access-token", accessToken);

              if (userDetails.getBasicProfile()) {
                  resolve({
                      FullName: userDetails.getBasicProfile().getName(),
                      AvatarUrl: userDetails.getBasicProfile().getImageUrl(),
                      Email: userDetails.getBasicProfile().getEmail(),
                      AccessToken: accessToken
                  });
                  return;
              } else {
                  reject();
              }
          });

      });

  },

  login: function () {
      gapi.auth2.getAuthInstance().signIn();
      listenForGoogleUser();
  },

  logout: function () {
      sessionStorage.removeItem("id-token");

      gapi.auth2.getAuthInstance().signOut().then(function () {
          location.reload();
      });
  }
};

function listenForGoogleUser() {
  gapi.auth2.getAuthInstance().currentUser.listen(() => {
      window.location.href = '/';
  });
}

function initGoogleClient() {
  return new Promise((resolve, reject) => {
      gapi.load('auth2', () => {
          gapi.auth2.init({
              client_id: '1029404973492-n0lqshostda897h2avskhah3r1940796.apps.googleusercontent.com',
              cookiepolicy: 'single_host_origin',
              scope: 'profile email'
          }).then(() => {
              resolve();
          }, (err) => {
            reject(`Error initializing the auth2 client! ${JSON.stringify(err)}`);
          });
      }, (err) => {
          reject(`Error loading the auth2 client! ${JSON.stringify(err)}`);
      });
  });
}