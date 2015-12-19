// register.js

var app = angular.module('register', ['ngAnimate','shared']);

app.controller('RegisterController', 
	['$scope','$http', '$timeout', '$window', 
		function($scope, $http, $timeout, $window) {

	$scope.formData = {};
	$scope.alertMessage = "";
	$scope.isFormComplete = false;
	//$scope.isLoggedIn = 

	$scope.submitRegistration = function() {

	    if (!$scope.validUsername){
	    	$scope.isSuccess = false;
        	$scope.alertMessage = "Username invalid or in use. Please try again."
            doMessage();
	    } else if (!$scope.validEmail){
	    	$scope.isSuccess = false;
        	$scope.alertMessage = "Email invalid or in use. Please try again."
            doMessage();
	    } else if (!$scope.passwordsMatch()){
	    	$scope.isSuccess = false;
			$scope.alertMessage = "Passwords do not match";
			doMessage();
	    } else {
			$http.post('/api/register', $scope.formData)
		        .success(function(data) {
		        	$http.post('/api/authenticate', $scope.formData)
		        	.success(function (data){
    						console.log(data);
					});
		            $window.location.href = '/';
		        })
		        .error(function(data) {
		        	$scope.isSuccess = false;
		        	$scope.alertMessage = "Unable to submit form. Please try again."
		            doMessage();
		            console.log('Error: ' + data);
		        }
		    );
	    }
	};

	$scope.checkUsername = function() {
		if ($scope.formData.username === "" ||
			$scope.formData.username === undefined){
			$scope.validUsername = false;
			return;
		}

		var username = { username : $scope.formData.username };
		$http.post('/api/register/checkUser', username)
			.success(function(data) {

				if(data.exists){
					$scope.isSuccess = false;
	        		$scope.alertMessage = "The specified username already exists!";
	        		$scope.validUsername = false;
	        	} else {
	        		$scope.isSuccess = true;
	        		$scope.alertMessage = "The specified username is available!";
	        		$scope.validUsername = true;
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
			$scope.formData.password === undefined ||
			$scope.formData.confirmPassword === undefined){
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
		$scope.isFormComplete =  
			($scope.isValidUsername && 
			 	$scope.validEmail &&
				$scope.passwordsMatch()
		 	);
	};

	var doMessage = function () {
       $scope.showMessage = true;
       $timeout(hideMessage, 5000);
   	};
       
    var hideMessage = function () {
    	$scope.showMessage = false;
    };

    var authenticate = function (){
    	$http.post('/api/authenticate', 
    			$scope.formData).success(function (data){
    				console.log(data);
				});

    }
}]);