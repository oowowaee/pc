var myApp = angular.module('myApp', ['ngResource', 'ui.router', 'ui.bootstrap']);

myApp.run(function($rootScope) {
  $rootScope.$on("$stateChangeError", console.log.bind(console));
});

myApp.constant("paginationConstants", {
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
      url: "/?page&search",
      templateUrl: "/static/tmpls/index.html",
      controller: 'listCtrl',
      resolve: {
        POI: 'POIFactory',
      	POIS: function(POIFactory, $stateParams) {
      		return POIFactory.query($stateParams).$promise;
      	}
      }
    }).state('tags', {
      url: "/tags?page",
      templateUrl: "/static/tmpls/tags.html",
      controller: 'tagCtrl',
      resolve: {
        Tag: 'TagFactory',
      	Tags: function(TagFactory, $stateParams) {
      		return TagFactory.query($stateParams).$promise;
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


/*  Simple pagination directive.  */
myApp.directive('paginationControl', function() {
  return {
    restrict: 'E',
    replace: true,
    controller: function($scope, $state) {      
      $scope.getPrevPage = function() {
        $state.go('.', {page: +$scope.page - 1, search: $scope.search_query})
      };

      $scope.getNextPage = function() {
        $state.go('.', {page: +$scope.page + 1, search: $scope.search_query})
      };
    },
    template: '<nav>' +
      '<ul class="pager">' +
        '<li ng-click="getPrevPage()" class="pull-left" ng-show="{{ page > 1 }}"><a href="#">Previous</a></li>' +
        '<li ng-click="getNextPage()" class="pull-right" ng-show="{{ page < totalPages }}"><a href="#">Next</a></li>' +
      '</ul>' +
    '</nav>'
  };
});

/*  Controller for POI list page/main page */
myApp.controller('listCtrl', function($scope, $state, $stateParams, POIS, POI, paginationConstants) {
	$scope.max = 5;
	$scope.page = $stateParams.page || 1;
  $scope.totalPages = POIS.count / paginationConstants.page_size;

	$scope.pois = POIS.results;

	$scope.search = function() {
		$state.go('index', {page: $scope.page, search: $scope.search_query});
	};
});


/*  Controller for Tags list page */
myApp.controller('tagCtrl', function($scope, $state, $stateParams, Tags, Tag, paginationConstants) {
	$scope.tags = Tags.results;
  $scope.page = $stateParams.page || 1;  
  $scope.totalPages = Tags.count / paginationConstants.page_size;

  $scope.addTag = function() {
    var tag = new Tag({'name': $scope.tag_name});
    tag.$save(function(result) {
      $state.go('tags', {page: 1}, {reload: true});

      /* Handle errors. */
    });
  };

  $scope.removeTag = function(id) {
    var tag = new Tag();
    tag.$delete({'id': id}, function(result) {
      $state.go('tags', $stateParams, {reload: true});

      /* Handle errors. */
    });
  };
});