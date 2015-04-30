@dom.controller 'DropletsNewController', ['$scope', '$timeout', '$route', 'Droplets', 'Regions', 'Sizes', 'Images', 'BroadcastService', ($scope, $timeout, $route, Droplets, Regions, Sizes, Images, BroadcastService) ->
  $scope.droplet = {}

  Images.query {'private': true, 'per_page': 50}, (data) ->
    $scope.images = data.images

  Regions.query (data) ->
    $scope.regions = data.regions

  Sizes.query (data) ->
    $scope.sizes = data.sizes

  $scope.submitForm = (isValid) ->
    return unless $scope.droplet.name and $scope.droplet.size and $scope.droplet.region and $scope.droplet.image
    $scope.droplet.image = $scope.droplet.image.id
    console.log $scope.droplet
    Droplets.save $scope.droplet, (response) ->
      console.log response
      BroadcastService('xhr-success', 'New droplet created.')

]