'use strict';

angular.module('MyAwesomeApp')
  .controller('AuthCtrl', function ($scope, $state, $qvAuth) {

    $scope.getCurrentUser

    $scope.logIn = function (email, password) {
      $qvAuth.logIn(email, password).then(function (currentUser) {
        var user = $qvAuth.getUser(currentUser.uid);

        // Call a server function to verify that the user has been created server-side
        AdminService.getApiUser(currentUser.uid, headers).then(function (res) {
          console.info('User exists or was created.', res);

        }, function (err) {
          console.warn('Login Error', err);

        });

      }, function (error) {
        console.warn('Login error.', error);

      });
    };

    $scope.register = function (email, password) {
      $qvAuth.register(email, password).then(function (currentUser) {
        console.info('Registration Success', currentUser);

      }, function (error) {
        console.warn('Registration error', err);

      });
    };

    $scope.resetPassword = function (email) {
      $qvAuth.resetPassword(email).then(function () {
        console.info('Password Reset', 'A Password reset email has been sent to ' + email + '.');

      }, function (error) {
        console.warn('Password reset error', err);

      });
    };

    $scope.changePassword = function (email, oldPassword, newPassword) {
      $qvAuth.changePassword(email, oldPassword, newPassword).then(function () {
        console.info('Password Changed');

      }, function (error) {
        console.warn('Password change error', err);

      });

    };

    $scope.removeUser = function (email, password) {
      $qvAuth.removeUser(email, password).then(function () {
        console.info('User removed');
      }, function (err) {
        console.warn('User removal error', err);
      });
    };


  });
