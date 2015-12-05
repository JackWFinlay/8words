// register.js

var app = angular.module('register', ['ngAnimate']);

app.controller('RegisterController', ['$scope','$http', '$timeout', function($scope, $http, $timeout) {
	$scope.formData = {};
	$scope.alertMessage = "";
	$scope.isFormComplete = false;

	$scope.submitRegistration = function() {
	    $http.post('/api/register', $scope.formData)
	        .success(function(data) {
	            $scope.formData = {}; 

	            $scope.isSuccess = true;
	            doMessage();
	        })
	        .error(function(data) {
	        	$scope.isSuccess = false;
	        	$scope.alertMessage = "Unable to submit form. Please try again."
	            doMessage();
	            console.log('Error: ' + data);
	        });
	};

	$scope.checkUserName = function() {
		if ($scope.formData.userName === "" ||
			$scope.formData.userName === undefined){
			$scope.validUserName = false;
			return;
		}

		var userName = { userName : $scope.formData.userName };
		$http.post('/api/register/checkUser', userName)
			.success(function(data) {

				if(data.exists){
					$scope.isSuccess = false;
	        		$scope.alertMessage = "The specified username already exists!";
	        		$scope.validUserName = false;
	        	} else {
	        		$scope.isSuccess = true;
	        		$scope.alertMessage = "The specified username is available!";
	        		$scope.validUserName = true;
	        	}

	        	doMessage();
			});
	};

	$scope.checkEmail = function() {
		if ($scope.formData.email === "" ||
			$scope.formData.email === undefined){
			$scope.validEmail = false;
			return;
		}

		var email = { email : $scope.formData.email };
		$http.post('/api/register/checkEmail', email)
			.success(function(data) {

				if(data.exists){
	        		$scope.alertMessage = "The specified email already exists!";
	        		$scope.validEmail = false;
	        		$isSuccess = false;
	        		doMessage();
	        	} else {
	        		$scope.validEmail = true;
	        	}

	        	
			});
	};

	$scope.passwordsMatch = function(){
		if ($scope.formData.password === "" ||
			$scope.formData.password === undefined){
			return false;
		} else {

			if($scope.formData.password === $scope.formData.confirmPassword){
				return true;
			} else {
				$scope.isSuccess = false;
				$scope.alertMessage = "Passwords do not match";
				doMessage();
				return false;
			}
		}
	}

	$scope.isComplete = function() {
		$scope.isFormComplete =  ($scope.isValidUserName && 
			 $scope.isValidEmail //&&
			// $scope.passwordsMatch()
			);
	};

	var doMessage = function () {
       $scope.showMessage = true;
       $timeout(hideMessage, 5000);
   	};
       
    var hideMessage = function () {
    	$scope.showMessage = false;
    };
}]);