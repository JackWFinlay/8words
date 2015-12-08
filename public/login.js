// login.js

var login = angular.module('login', ['ngAnimate','shared']);

login.controller('loginController', 
	['$scope','$http', '$timeout', '$window', 
	function($scope, $http, $timeout, $window) {
		$scope.formData = {};
		$scope.alertMessage = '';

		$scope.login = function() {
			$http.post('api/authenticate', $scope.formData)
				.success(

				)
				.error();

		}
	}
]);