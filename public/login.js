// login.js

var login = angular.module('login', ['ngAnimate','shared']);

login.controller('LoginController', 
	['$scope','$http', '$timeout', '$window', 
	function($scope, $http, $timeout, $window) {
		$scope.formData = {};
		$scope.alertMessage = '';
		

		$scope.login = function() {
			
			if(formComplete()){
				$scope.showMessage = false; //Hide any messages that are showing.
				
				$http.post('/api/authenticate', $scope.formData)
					.success( function(data) {
						if(data.success){
			            	$window.location.href = '/';
			        	} else {
			        		$scope.alertMessage = data.message;
			        		$scope.isSuccess = false;
			        		$scope.showMessage = true;
			        	}
					});
			}
		};

		var formComplete = function(){
			return ($scope.formData.username !== undefined &&
					$scope.formData.username !== '' &&
					$scope.formData.password !== undefined &&
					$scope.formData.password !== '' );
				
				
		};
	}
]);