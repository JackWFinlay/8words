// core.js
var app = angular.module('core', ['ngAnimate', 'shared', 'ngCookies']);

app.controller('SentenceController', 
	['$scope', '$http', '$timeout', '$cookies',
	function($scope, $http, $timeout, $cookies) {
	//$cookies.put('username', 'Jack');
	$scope.formData = {};
	$scope.submitDisabled = true;
	$scope.isLoggedIn = ($cookies.get('username') !== undefined);
	console.log($scope.isLoggedIn);
	console.log($cookies.get('username'));
	$scope.username = $cookies.get('username');
	

	$http.get('/api/sentences')
	    .success(function(data) {
	        $scope.sentences = data;
	    })
	    .error(function(data) {
	        $scope.isSuccess = false;
        	$scope.alertMessage = "Unable to get sentences. Please refresh to try again.";
            doMessage();
	    });

	// when submitting the add form, send the text to the node API
	$scope.createSentence = function() {
		$scope.submitDisabled = true;
	    $http.post('/api/sentences', $scope.formData)
	        .success(function(data) {
	            $scope.formData = {}; // clear the form so our user is ready to enter another
	            $scope.sentences = data;
	            $scope.alertMessage = "Sentence posted!";
	            $scope.isSuccess = true;
	            doMessage();
	            console.log(data);
	        })
	        .error(function(data) {
	        	$scope.submitDisabled = false;
	        	$scope.isSuccess = false;
	        	$scope.alertMessage = "Unable to post sentence. Please try again.";
	            doMessage();
	            console.log('Error: ' + data);
	        });

	};


	$scope.deleteSentence = function(id) {
	    $http.delete('/api/sentences/' + id)
	        .success(function(data) {
	            $scope.sentences = data;
	            $scope.isSuccess = true;
	            doMessage();
	            console.log(data);

	        })
	        .error(function(data) {
	        	$scope.isSuccess = false;
	        	$scope.alertMessage="Error deleting sentence. Please try again.";
	            doMessage();
	            console.log('Error: ' + data);
	        });
	};


	$scope.isValidSentence = function(sentence){
		if (sentence === null ||
			sentence === "" ||
			sentence === undefined){
			$scope.submitDisabled = true;
			return true;
		}
			
		if (sentence.match(/^(\b\w+\b[\s]*){1,8}(\.{0,3})$/)){
			$scope.submitDisabled = false;
			return false;
		} else {
			$scope.submitDisabled = true;
			return true;
		}
	}


	var doMessage = function () {
       $scope.showMessage = true;
       $timeout(hideMessage, 5000);
   	};
       
    var hideMessage = function () {
    	$scope.showMessage = false;
    };


}]);


