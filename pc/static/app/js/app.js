'use strict';

var myApp = angular.module('myApp', ['ngResource', 'ui.router', 'ui.bootstrap']);

//Show the routing changes while we're building the page
myApp.run(function($rootScope) {
  $rootScope.$on('$stateChangeError', console.log.bind(console));
});

myApp.constant('paginationConstants', {
  'page_size': 5,
});

//Django freaks out if the trailing slash gets removed
myApp.config(function($resourceProvider, $httpProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
});

myApp.config(function($stateProvider, $urlRouterProvider) {
  // Now set up the states
  $stateProvider
    .state('index', {
      url: '/?page&search',
      templateUrl: '/static/tmpls/index.html',
      controller: 'listCtrl',
      resolve: {
        POI: 'POIFactory',
      	POIS: function(POIFactory, $stateParams) {
      		return POIFactory.query($stateParams).$promise;
      	}
      }
    }).state('tags', {
      url: '/tags?page',
      templateUrl: '/static/tmpls/tags.html',
      controller: 'tagCtrl',
      resolve: {
        Tag: 'TagFactory',
      	Tags: function(TagFactory, $stateParams) {
      		return TagFactory.query($stateParams).$promise;
      	}
      }
    });

	// For any unmatched url, redirect to /index
  	$urlRouterProvider.otherwise('/');
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


/*  Simple pagination directive.  */
myApp.directive('paginationControl', function() {
  return {
    restrict: 'E',
    replace: true,
    controller: function($scope, $state, paginationConstants) {      
      $scope.totalPages = Math.ceil($scope.count / paginationConstants.page_size);

      $scope.getPrevPage = function() {
        $state.go('.', {page: +$scope.page - 1, search: $scope.search_query});
      };

      $scope.getNextPage = function() {
        $state.go('.', {page: +$scope.page + 1, search: $scope.search_query});
      };
    },
    template: '<nav>' +
      '<ul class="pager row">' +
        '<li ng-click="getPrevPage()" class="col-xs-4 text-left" ng-show="{{ page > 1 }}"><a href="#">Previous</a></li>' +
        '<li class="col-xs-4 text-center">{{ page }} / {{ totalPages }}</li>' +
        '<li ng-click="getNextPage()" class="col-xs-4 text-right" ng-show="{{ page < totalPages }}"><a href="#">Next</a></li>' +
      '</ul>' +
    '</nav>'
  };
});

/*  Controller for POI list page/main page */
myApp.controller('listCtrl', function($scope, $state, $stateParams, POIS, POI) {
	$scope.max = 5;
	$scope.page = $stateParams.page || 1;
  $scope.count = POIS.count;

	$scope.pois = POIS.results;

	$scope.search = function() {
		$state.go('index', {page: $scope.page, search: $scope.search_query});
	};
});


/*  Controller for Tags list page */
myApp.controller('tagCtrl', function($scope, $state, $stateParams, Tags, Tag) {
	$scope.tags = Tags.results;
  $scope.page = $stateParams.page || 1;  
  $scope.count = Tags.count;

  $scope.addTag = function() {
    var tag = new Tag({'name': $scope.tag_name});
    tag.$save(function() {
      $state.go('tags', {page: 1}, {reload: true});

      /* Handle errors. */
    });
  };

  $scope.removeTag = function(id) {
    var tag = new Tag();
    tag.$delete({'id': id}, function() {
      $state.go('tags', $stateParams, {reload: true});

      /* Handle errors. */
    });
  };
});