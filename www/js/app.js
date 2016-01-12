angular.module('social', ['ionic'])

.config(function ($stateProvider, $urlRouterProvider) {
//FacebookProvider.init('1008436239221044');
  $stateProvider
    .state('home', {
      url: '/home',
      controller: 'HomeController',
	  templateUrl: 'views/home/home.html'	  
    });

  $urlRouterProvider.otherwise('/home');
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
