// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ionic.utils', 'starter.services', 'chart.js'])

.run(function($ionicPlatform,$state,$rootScope,$localstorage) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    if (!$localstorage.getObject("user")) {
      if (next.name == 'tab.home' || next.name=='tab.account' || next.name == 'tab.notif') {
        event.preventDefault();
        $state.go('tab.login');
      }
    }
  });
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  //Fix cung tab hien thi o ben duoi
  $ionicConfigProvider.tabs.position('bottom');
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'AppCtrl'
  })

  // Each tab has its own nav history stack:

  .state('tab.search', {
    url: '/search',
    views: {
      'mainContent': {
        templateUrl: 'templates/tab-search.html'
      }
    }
  })
  .state('tab.searchlist', {
    url: '/searchlist/:catalogId/:queryType',
    views: {
      'mainContent': {
        controller:'SearchListCtrl',
        templateUrl: 'templates/searchlist.html'
      }
    }
  })
  .state('tab.listcontent', {
    url: '/listcontent/:catalogId',
    views: {
      'mainContent': {
        controller:'ListContentCtrl',
        templateUrl: 'templates/listcontent.html'
      }
    }
  })

  .state('tab.login', {
    url: '/login',
    views: {
      'mainContent': {
        controller:'LoginCtrl',
        templateUrl: 'templates/login.html'
      }
    }
  })
.state('tab.home', {
    url: '/home',
    views: {
      'mainContent': {
        controller:'HomeCtrl',
        templateUrl: 'templates/home.html'
      }
    }
  })
  .state('tab.changepass', {
    url: '/changepass',
    views: {
      'mainContent': {
        templateUrl: 'templates/changepass.html'
      }
    }
  })
 .state('tab.notif', {
      url: '/notif',
      views: {
        'mainContent': {
          controller:'NotifCtrl',
          templateUrl: 'templates/tab-notif.html'
        }
      }
    })
    .state('tab.guide', {
      url: '/guide',
      views: {
        'mainContent': {
          controller:'GuideCtrl',
          templateUrl: 'templates/tab-guide.html'
        }
      }
    })
  .state('tab.chart', {
      url: '/chart/:catalogId',
      views: {
        'mainContent': {
          templateUrl: 'templates/chart.html',
          controller:'ChartCtrl'
        }
      }
    })
  .state('tab.account', {
    url: '/account',
    views: {
      'mainContent': {
        controller:'AccountCtrl',
        templateUrl: 'templates/tab-account.html'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/login');

});
