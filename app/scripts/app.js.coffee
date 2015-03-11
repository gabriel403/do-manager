@dom = angular.module('dom', ['ngRoute','ngResource','ngCookies','ngStorage'])

@dom.service('RateLimitService', ['BroadcastService', (BroadcastService) ->
    rateLimit = 1200;

    this.updateRateLimit = (rl, rle) ->
      rateLimit = rl
      BroadcastService('ratelimit:updated', rateLimit, rle);
]);

@dom.factory('myHttpInterceptor', ['$q', '$rootScope', 'BroadcastService', 'RateLimitService', ($q, $rootScope, BroadcastService, RateLimitService) ->
  return {
    response: (response) ->
      # console.log(RateLimitService)
      ratelimit = response.headers('ratelimit-remaining')
      RateLimitService(ratelimit)
      response || $q.when response

   responseError: (rejection) ->
      if rejection.status is 403
        $('body').addClass('unauthorized')
        $('.navbar, .well, .panel-group').css("opacity", "0.4")

        $rootScope.$on('alert-hidden', (e) ->
          $('body').removeClass('unauthorized')
          $('.navbar, .well, .panel-group').css("opacity", "1.0")
        )

      message = 'An unkown error occured'
      if 'data' of rejection and 'message' of rejection.data
        message = rejection.data.message
      else if 'statusText' of rejection
        message = rejection.statusText

      BroadcastService('xhr-error', message);

      $q.reject(rejection);
  };
]);

@dom.config(['$httpProvider', ($httpProvider) ->
  $httpProvider.interceptors.push('myHttpInterceptor');
])

@dom.config(['$routeProvider', ($routeProvider) ->
  $routeProvider.
    when('/images', {
      templateUrl: '../templates/images.html',
      controller: 'ImagesController'
    }).
    when('/droplets', {
      templateUrl: '../templates/droplets.html',
      controller: 'DropletsController'
    }).
    when('/droplets/new', {
      templateUrl: '../templates/droplets-new.html',
      controller: 'DropletsNewController'
    }).
    otherwise({
      templateUrl: '../templates/home.html',
      controller: 'HomeController'
    })
])

@dom.factory('Droplets', ['$resource', '$http', ($resource, $http) ->
  return $resource('https://api.digitalocean.com/v2/droplets/:id', null, {'update': { method:'PUT' }, 'query': {isArray:false}});
]);

@dom.factory('DropletActions', ['$resource', '$http', ($resource, $http) ->
  return $resource('https://api.digitalocean.com/v2/droplets/:droplet_id/actions', null, {'update': { method:'PUT' }, 'query': {isArray:false}});
]);

@dom.factory('Regions', ['$resource', '$http', ($resource, $http) ->
  return $resource('https://api.digitalocean.com/v2/regions', null, {'query': {isArray:false}});
]);

@dom.factory('Sizes', ['$resource', '$http', ($resource, $http) ->
  return $resource('https://api.digitalocean.com/v2/sizes', null, {'query': {isArray:false}});
]);

@dom.factory('Images', ['$resource', '$http', ($resource, $http) ->
  return $resource('https://api.digitalocean.com/v2/images', null, {'query': {isArray:false}});
]);

@dom.service('BroadcastService', ['$rootScope', ($rootScope) ->
  this.broadcast = (type, message) ->
    this.message = message;
    $rootScope.$broadcast(type, message);
]);

@dom.directive("loadingIndicator", ['$rootScope', ($rootScope) ->
  return {
    restrict : "A",
    link : (scope, element, attrs) ->
      scope.$on("loading-started", (e) ->
        console.log('loading started for loading indicator')
        element.removeClass("hidden")
      );

      scope.$on("loading-complete", (e) ->
        console.log('loading complete for loading indicator')
        element.addClass("hidden")
      );
  };
]);

@dom.directive("postLoadingIndicator", ['$rootScope', ($rootScope) ->
  return {
    restrict : "A",
    link : (scope, element, attrs) ->
      scope.$on("loading-started", (e) ->
        element.addClass("hidden")
      );

      scope.$on("loading-complete", (e) ->
        element.removeClass("hidden")
      );
  };
]);

@dom.directive('ngConfirmClick', ->
    return {
      link: (scope, element, attr) ->
        msg = attr.ngConfirmClick || "Are you sure?";
        clickAction = attr.ngClick;
        element.bind('click', (e) ->
          scope.$eval(clickAction) if window.confirm(msg)
          e.stopImmediatePropagation();
          e.preventDefault();
        );
    };
);

@dom.directive("statusAlert", ['$rootScope', '$timeout', 'BroadcastService', ($rootScope, $timeout, BroadcastService) ->
  $rootScope.errorMessage = '...'
  $rootScope.successMessage = '...'
  return {
    restrict : "A",
    link : (scope, element, attrs) ->
      scope.$on('xhr-error', (e, message) ->
        $rootScope.errorMessage = message
        template =  "<div class='alert alert-danger alert-dismissible status-alerts' role='alert'>" + message + "</div>"
        element.html(template)
        callback = -> $(".alert-dismissible").slideUp(500, -> BroadcastService('alert-hidden'); $(this).remove();)
        setTimeout callback, 5000
      )
      scope.$on('xhr-success', (e, message) ->
        $rootScope.successMessage = message
        template =  "<div class='alert alert-success alert-dismissible status-alerts' role='alert'>
            <button type='button' class='close' data-dismiss='alert'>
              <span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span>
            </button>
            " + message + "
          </div>"
        element.html(template)
        callback = -> $(".alert-dismissible").slideUp(500, -> $(this).remove();)
        setTimeout callback, 1000
      )
  };
]);