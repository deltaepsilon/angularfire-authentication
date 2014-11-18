
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
  .service('qvAuth', function ($q, $firebase, AngularFireAuthentication, qvStorage) {
    var endpoint = AngularFireAuthentication.endpoint,
      ref = new Firebase(endpoint),
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

    ref.onAuth(function (authData) {
      if (!authData) {
        return console.warn('Auth has been lost.')
      } else if (!authData.uid) {
        return console.log('authData not loaded'); 
      } else {
        currentUser = authData;
      }
      
      var headers = {"authorization": authData.token, "user-id": authData.uid};

      getUser(authData.uid).then(function (user) {
        if (!user) {
          AdminService.getApiUser(currentUser.uid, headers).then(function () {
            console.log('User created.');
          }, function (err) {
            console.warn('User creation error.');
          });

        } else {
          // console.log('User authenticated', user);
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
