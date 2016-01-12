/**
 * @author Rashmi
 * @date Jan'04 2016
 * 
 */

angular.module('social')
.controller('HomeController', ['$log', '$scope', '$http', '$location','$ionicPopup', '$timeout','$ionicLoading','$q','$state',
    function ($log, $scope, $http, $location,$ionicPopup, $timeout,$ionicLoading,$q,$state) {

        var self = $scope;

        self.user = {};
        self.init = function () {
            $log.log('Initializing login controller!');
            
        };

		/**
		 * Facebook Login implementation
		 */
        
// This is the success callback from the login method
  var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      return;
    }

    var authResponse = response.authResponse;

    getFacebookProfileInfo(authResponse)
    .then(function(profileInfo) {
      console.log("profileInfo.id"+profileInfo.id);
      $ionicLoading.hide();
      $state.go('home');
    }, function(fail){
      // Fail get profile info
      console.log('profile info fail', fail);
    });
  };

  // This is the fail callback from the login method
  var fbLoginError = function(error){
    console.log('fbLoginError', error);
    $ionicLoading.hide();
  };

  // This method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function (authResponse) {
    var info = $q.defer();

    facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      function (response) {
				console.log(response);
        info.resolve(response);
      },
      function (response) {
				console.log(response);
        info.reject(response);
      }
    );
    return info.promise;
  };

  //This method is executed when the user press the "Login with facebook" button
  $scope.facebookSignIn = function() {
    facebookConnectPlugin.getLoginStatus(function(success){
      if(success.status === 'connected'){
        // The user is logged in and has authenticated your app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed request, and the time the access token
        // and signed request each expire
        console.log('getLoginStatus', success.status);
		$scope.showAlert("FB status : "+success.status);
    			getFacebookProfileInfo(success.authResponse)
					.then(function(profileInfo) {
						$scope.showAlert("User ID....... "+profileInfo.id);
						$state.go('home');
					}, function(fail){
						// Fail get profile info
						console.log('profile info fail', fail);
					});				
      } else {
        // If (success.status === 'not_authorized') the user is logged in to Facebook,
				// but has not authenticated your app
        // Else the person is not logged into Facebook,
				// so we're not sure if they are logged into this app or not.

				console.log('getLoginStatus', success.status);
				$ionicLoading.show({
					template: 'Logging in...'
				});

				// Ask the permissions you need. You can learn more about
				// FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
        facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
      }
    });
  };		
		
		/*.......FB END ......*/
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
    
        /**
         * G+ login implementation
         */
        $scope.gplusLogin = function(callback)
			{
				 $scope.clientId = "232289604333-g287c7f4j04tjocmfkr6l4nid4pcm52r.apps.googleusercontent.com";
				 gapi.auth.signIn({
		    	      'callback': function(authResult){
		    	    	  $scope.signinCallback(authResult, callback);
		    	      },
		    	      'clientid': $scope.clientId,
		    	      'cookiepolicy': 'single_host_origin',
		    	      'data-accesstype':'offline',
		    	      'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email',
		    	      'data-requestvisibleactions': 'http://schemas.google.com/AddActivity'
		    	    });
			}
			
			$scope.signinCallback= function(authResult, callback) {
				
				if (authResult['status']['signed_in']) {
					gapi.client.load('plus','v1', function(){ 
		                var request = gapi.client.plus.people.get({'userId' : 'me'});
		                request.execute(function(response) {
		                    var email = '';
						    if(response['emails'])
						    {
						        for(i = 0; i < response['emails'].length; i++)
						        {
						            if(response['emails'][i]['type'] == 'account')
						            {
						                email = response['emails'][i]['value'];
						            }
						        }
						    }
		                    //send response to server
							$scope.showAlert("gmail connected");
		                    //gotoServer(email,response.displayName,'gplus');
		                });
		            });

				} else if (authResult['error']) {
					console.log("G+ NOT CONNECTED");
				  }
			}

		/**
		 * This method checks if email address of signed in FB user exists or not,
		 * if not then it will ask for the same in a modal window.
		 */
		$scope.modalData ={};
		$scope.fb={};
		
		/**
		 * after social sign in go to server for creation of new user if not exist
		 * 
		 */
		
		function gotoServer(email, name, type){
			var urlPart = "/login/create_user/";
			var dataToPost = {
					username: email
			};
			$http({
				method : 'POST',
				url : RestURL.baseURL + urlPart,
				data: dataToPost,
				headers : {
					"content-type" : "application/json",
					"Accept" : "application/json"
				},
			}).success(function(data) {
    				var user = data;
    				console.log(angular.toJson(data));
    				authFactory.setUser(user);
    				$location.url("/en-US/social/success");
    		}).error(function(){ 	
    			console.log("ERROR WITH SOCIAL SIGNIN");
    			$location.url("/en-US/social/success");
    		});

		}

        self.init();

$scope.showAlert = function(msg) {

   var alertPopup = $ionicPopup.alert({

      title: 'Message',

      template: msg,

   });

   alertPopup.then(function(res) {

      console.log('Thanks');

   });

};

    }]);