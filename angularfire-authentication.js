
angular.module('quiver.angularfire-authentication', ['firebase'])
  .provider('AngularFireAuthentication', function () {
    return {
      endpoint: false,
      setEndpoint: function (value) {
        this.endpoint = value;
      },
      $get: function () {
        return {
          endpoint: this.endpoint
        };
      }
    };
  })
  .service('qvStorage', function ($window) {
    return $window.localStorage;
  })
  .service('qvAuth', function ($q, $firebaseObject, $firebaseAuth, AngularFireAuthentication, qvStorage) {
    var endpoint = AngularFireAuthentication.endpoint,
      ref = new Firebase(endpoint),
      auth = $firebaseAuth(ref),
      currentUser = ref.getAuth(),
      listening;

    auth.$onAuth(function (authData) { // Keep the local copy in sync with the fb state
      currentUser = authData;
    });

    var getCurrentUser = function () {
        var deferred = $q.defer();

        deferred.resolve(currentUser);

        return deferred.promise;
      },
      getUser = function (key) {
        if (!key) {
          console.warn('No key passed into getUser! Fix this! Now!');
        }

        return $firebaseObject(new Firebase(endpoint + '/users/' + key)).$loaded();
        
      };    

    return {
      ref: ref,

      auth: auth,

      getCurrentUser: getCurrentUser,

      getUser: getUser,

      getResolvedPromise: function (data) {
        var deferred = $q.defer();

        deferred.resolve(data);

        return deferred.promise;
      },

      getRejectedPromise: function (data) {
        var deferred = $q.defer();

        deferred.reject(data);

        return deferred.promise;
      },

      logIn: function (email, password, remember) {
        return auth.$authWithPassword({
          email: email,
          password: password
        }, {
          remember: remember || 'default'
        });

      },

      register: function (email, password) {
        var deferred = $q.defer();

        ref.createUser({
          email: email,
          password: password
        }, function (err) {
          return err ? deferred.reject(err) : deferred.resolve();
        });

        return deferred.promise;
      },

      changePassword: function (email, oldPassword, newPassword) {
        return auth.$changePassword({
          email: email,
          oldPassword: oldPassword,
          newPassword: newPassword
        });
      },

      logOut: function () {
        var deferred = $q.defer(),
          off = auth.$onAuth(function (authData) {
            off();
            deferred.resolve(authData);
          });

        auth.$unauth();

        return deferred.promise;
      },

      resetPassword: function (email) {
        return auth.$resetPassword({email: email});

      },

      removeUser: function (email, password) {
        return auth.$removeUser({
          email: email,
          password: password
        });

      },

      getHeaders: function (authData) {
        var headers = {
          authorization: authData.token, 
          uid: authData.uid, 
          provider: authData.provider
        };

        if (authData.email) {
          headers.email = authData.email;
        } else if (authData.password) {
          headers.email = authData.password.email;
        } else if (authData.google) {
          headers.email = authData.google.email;
        } else if (authData.facebook) {
          headers.email = authData.facebook.email;
        }

        return headers;
 
      }

    };
  });
