// login.js

var login = angular.module('login', ['ngAnimate','shared']);

login.controller('LoginController', 
	['$scope','$http', '$timeout', '$window', 
	function($scope, $http, $timeout, $window) {
		$scope.formData = {};
		$scope.alertMessage = '';

		$scope.login = function() {
			$http.post('/api/authenticate', $scope.formData)
				.success( function(data) {
					if(data.success){
		            	$window.location.href = 'index.html';
		        	} else {
		        		$scope.alertMessage = 'Username or password incorrect';
		        		$scope.isSuccess = false;
		        		$scope.showMessage = true;
		        	}
				});

		};
	}
]);