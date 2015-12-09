// core.js
var app = angular.module('core', ['ngAnimate', 'shared']);

app.controller('SentenceController', ['$scope', '$http', '$timeout',function($scope, $http, $timeout) {
	$scope.formData = {};

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
			return true;
		}
		
		return !sentence.match(/^(\b\w+\b[\s]*){1,8}(\.{0,3})$/);
	}


	var doMessage = function () {
       $scope.showMessage = true;
       $timeout(hideMessage, 5000);
   	};
       
    var hideMessage = function () {
    	$scope.showMessage = false;
    };


}]);


