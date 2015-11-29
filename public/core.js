// core.js

(function (){
	angular.module('core', [])

 	.controller('SentenceController', function($scope, $http) {
	    $scope.formData = {};

	    // when landing on the page, get all todos and show them
	    $http.get('/api/sentences')
	        .success(function(data) {
	            $scope.sentences = data;
	            console.log(data);
	        })
	        .error(function(data) {
	            console.log('Error: ' + data);
	        });

	    // when submitting the add form, send the text to the node API
	    $scope.createSentence = function() {
	        $http.post('/api/sentences', $scope.formData)
	            .success(function(data) {
	                $scope.formData = {}; // clear the form so our user is ready to enter another
	                $scope.sentences = data;
	                console.log(data);
	            })
	            .error(function(data) {
	                console.log('Error: ' + data);
	            });
	    };

	    // delete a todo after checking it
	    $scope.deleteSentence = function(id) {
	        $http.delete('/api/sentences/' + id)
	            .success(function(data) {
	                $scope.sentences = data;
	                console.log(data);
	            })
	            .error(function(data) {
	                console.log('Error: ' + data);
	            });
	    };
	});
}());