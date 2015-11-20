var myApp = angular.module('myApp', ['ngResource', 'ui.router', 'ui.bootstrap']);

myApp.run(function($rootScope) {
  $rootScope.$on("$stateChangeError", console.log.bind(console));
});

myApp.config(function($stateProvider, $urlRouterProvider) {
  // Now set up the states
  $stateProvider
    .state('index', {
      url: "/?page&search",
      templateUrl: "/static/tmpls/index.html",
      controller: 'listCtrl',
      resolve: {
      	POIS: function(POIFactory, $stateParams) {
      		return POIFactory.query($stateParams).$promise;
      	}
      }
    }).state('tags', {
      url: "/tags",
      templateUrl: "/static/tmpls/tags.html",
      controller: 'tagCtrl',
      resolve: {
      	Tags: function(TagFactory) {
      		return TagFactory.query().$promise;
      	}
      }
    });

	// For any unmatched url, redirect to /index
  	$urlRouterProvider.otherwise("/");
});

myApp.factory('POIFactory', function($resource) {
	return $resource('/api/pois/:id/', null, {
		'query': {'action': 'GET', 'isArray': false}
	});
});

myApp.factory('TagFactory', function($resource) {
	return $resource('/api/tags/:id/', null, {
		'query': {'action': 'GET', 'isArray': false}
	});
});

myApp.controller('listCtrl', function($scope, $state, $stateParams, POIS) {
	$scope.max = 5;
	$scope.page = $stateParams.page || 1;
	$scope.pois = POIS.results;

	$scope.search = function() {
		$state.go('index', {page: $scope.page, search: $scope.search_query});
	};
});

myApp.controller('tagCtrl', function($scope, $stateParams, Tags) {
	$scope.tags = Tags.results;
});