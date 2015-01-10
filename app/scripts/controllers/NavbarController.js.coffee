@dom.controller 'NavbarController', ['$scope', '$http', '$cookies', ($scope, $http, $cookies) ->
  $scope.auth = {toggleAuthStorage: false, personalToken: '', rateLimit: 1200}
  $scope.rateLimit = {expires: '', limit: 1200}

  $scope.$on('ratelimit:updated', (bc, rateLimit, rateLimitExpires) ->
    $scope.rateLimit.limit = rateLimit;
  )

  $scope.updateAuth = ->
    $http.defaults.headers.common['Authorization'] = 'Bearer '+$scope.auth.personalToken;
    $scope.storeAuth()

  $scope.storeAuth = ->
    if $scope.auth.toggleAuthStorage
      $cookies.dom_auth = $scope.auth.personalToken
    else
      $cookies.dom_auth = ''

  if $cookies.dom_auth
    $scope.auth.personalToken = $cookies.dom_auth
    $scope.auth.toggleAuthStorage = true
    $scope.updateAuth()
]