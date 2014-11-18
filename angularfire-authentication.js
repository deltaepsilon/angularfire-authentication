
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
  .service('qvAuth', function ($q, $firebase, $firebaseAuth, AngularFireAuthentication, qvStorage) {
    var endpoint = AngularFireAuthentication.endpoint,
      ref = new Firebase(endpoint),
      auth = $firebaseAuth(ref),
      currentUser = ref.getAuth();

    

    var getCurrentUser = function () {
        var deferred = $q.defer();

        deferred.resolve(currentUser);

        return deferred.promise;
      },
      getUser = function (uid) {
        if (!uid) {
          debugger;
        }
        var deferred = $q.defer(),
          userRef = $firebase(new Firebase(endpoint + '/users/' + uid)),
          user = userRef.$asObject();

        user.$loaded().then(function (data) {
          deferred.resolve(data);
        }, function (err) {
          console.log('getUser error', err);
        });

        return deferred.promise;
        
      };

    auth.$onAuth(function (authData) {
      if (!authData) {
        console.warn('Auth has been lost.')
      } else if (!authData.uid) {
        console.log('authData not loaded'); 
      } else {
        currentUser = authData;
      }

    });

    return {
      ref: ref,

      auth: auth,

      getCurrentUser: getCurrentUser,

      getUser: getUser,

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
        var deferred = $q.defer();

        deferred.resolve(auth.$unauth());

        return deferred.promise;
      },

      resetPassword: function (email) {
        return auth.$sendPasswordResetEmail(email);

      },

      removeUser: function (email, password) {
        return auth.$removeUser({
          email: email,
          password: password
        });

      }

    };
  });
