@dom.controller 'ImagesController', ['$scope', '$timeout', '$route', 'Images', 'BroadcastService', ($scope, $timeout, $route, Images, BroadcastService) ->
  Images.query {'private': true}, (data) ->
    $scope.privateImages = data.images
]