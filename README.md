angularfire-authentication
==========================

An Angular wrapper for Firebase email/password authentication using AngularFire.

### Installation

Install with Bower...

```

  bower install --save angularfire-authentication

```

Get it on your page...

```

<!-- index.html -->
<script src="/bower_components/angularfire-authentication/angularfire-authentication.js"></script>


```

Add as module dependency and pass in your firebase endpoint...

```

//app.js

angular.module('MyAwesomeApp', ['quiver.angularfire-authentication'])
  .config(function ($qvAuthProvider) {
    $qvAuthProvider.setEndpoint('https://my-firebase.firebaseio.com/');
  });

```

### Use

Inject the service across your app as  ```$qvAuth```.

Check out a sample implementation  in [sample-controller.js](https://github.com/deltaepsilon/angularfire-authentication/blob/master/sample-controller.js)
and [sample-app.js](https://github.com/deltaepsilon/angularfire-authentication/blob/master/sample-app.js).