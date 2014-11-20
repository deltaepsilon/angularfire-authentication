angular.module('MyAwesomeApp')
  .run(function (qvAuth) {
    qvAuth.auth.$onAuth(function (authData) {
      if (authData && authData.uid) {
        console.log('user logged in');
      } else {
        console.log('user not logged in');
      }

    });
    
  })
  .config(function (AngularFireAuthenticationProvider) {
    /*
     * Configure qvAuth
     */
    AngularFireAuthenticationProvider.setEndpoint('https://my-firebase.firebaseio.com/quiver-cms');
    
  });