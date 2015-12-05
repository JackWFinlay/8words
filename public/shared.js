// shared.js

var shared = angular.module('shared')
	.directive('siteNav', function() {
		return {
			restrict: 'E',
			templateUrl : 'views/site-nav.html'
	};
};