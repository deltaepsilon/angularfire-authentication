(function () {
  var module = angular.module('quiver.angularfire-authentication', ['firebase']);

  module.provider('$qvAuthProvider', function () {
    return {
      endpoint: false,
      setEndpoint: function (endpoint) {
        this.endpoint = endpoint;
      },
      $get: function () {
        return {
          endpoint: this.endpoint
        };
      }
    }
  });

  module.service('$qvAuth', function ($firebase) {
    var endpoint = qvAuthProvider.endpoint,
      ref = new Firebase(endpoint),
      currentUser = false;

    

    var getCurrentUser = function () {
        var deferred = $q.defer();

        deferred.resolve(currentUser);

        return deferred.promise;
      },
      getUser = function (uid) {
        var userRef = $firebase(new Firebase(endpoint + '/users/' + uid)),
          user = userRef.$asObject();

        return user.$loaded()
      };

    ref.onAuth(function (authData) {
      if (!authData) {
        return console.warn('Auth has been lost.')
      } else {
        currentUser = authData;
      }
      
      var headers = {"authorization": authData.firebaseAuthToken, "user-id": authData.id};

      getUser(authData.id).then(function (user) {
        if (!user) {
          AdminService.getApiUser(currentUser.uid, headers).then(function () {
            console.log('User created.');
          }, function (err) {
            console.warn('User creation error.');
          });

        } else {
          console.log('User authenticated', user);
        }
      });

    });

    return {
      getCurrentUser: getCurrentUser,

      getUser: getUser,

      logIn: function (email, password, remember) {
        var deferred = $q.defer();

        ref.authWithPassword({
          email: email,
          password: password
        }, function (err, authData) {
          currentUser = authData;
          return err ? deferred.reject(err) : deferred.resolve(authData);
        }, {
          remember: remember || 'default'
        });

        return deferred.promise;
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
        var deferred = $q.defer();

        ref.changePassword({
          email: email,
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function (err) {
          return err ? deferred.reject(err) : deferred.resolve();
        });

        return deferred.promise;
      },

      logOut: function () {
        var deferred = $q.defer();

        deferred.resolve(ref.unauth());

        return deferred.promise;
      },

      resetPassword: function (email) {
        var deferred = $q.defer();

        ref.resetPassword({
          email: email
        }, function (err) {
          return err ? deferred.reject(err) : deferred.resolve();
        });

        return deferred.promise;
      },

      removeUser: function (email, password) {
        var deferred = $q.defer();

        ref.removeUser({
          email: email,
          password: password
        }, function (err) {
          return err ? deferred.reject(err) : deferred.resolve();
        });

        return deferred.promise;
      }

    };
  });

})();
