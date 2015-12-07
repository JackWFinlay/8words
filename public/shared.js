// shared.js

var shared = angular.module('shared', []);

shared.directive('header', function() {
	return {
		restrict: 'E',
		templateUrl : 'views/header.html'
	};
});

shared.directive('alertContainer', function(){
	return {
		restrict: 'E',
		templateUrl: 'views/alert-container.html'
	}
});