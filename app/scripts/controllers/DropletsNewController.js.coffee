@dom.controller 'DropletsNewController', ['$scope', '$timeout', '$route', 'Droplets', 'Regions', 'Sizes', 'BroadcastService', ($scope, $timeout, $route, Droplets, Regions, Sizes, BroadcastService) ->
  Regions.query (data) ->
    $scope.regions = data.regions

  Sizes.query (data) ->
    $scope.sizes = data.sizes
]