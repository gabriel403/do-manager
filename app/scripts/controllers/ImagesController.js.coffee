@dom.controller 'ImagesController', ['$scope', '$timeout', '$route', 'Images', 'ImageActions', 'Regions', 'BroadcastService', ($scope, $timeout, $route, Images, ImageActions, Regions, BroadcastService) ->
  Images.query {'private': true, 'per_page': 50}, (data) ->
    $scope.privateImages = data.images

  Regions.query (data) ->
    $scope.regions = data.regions

  $scope.delete = (id) ->
    angular.forEach($scope.privateImages, (privateImage) ->
      if privateImage.id is id
        Images.delete({id: id}, {}, (stuff) ->
          angular.forEach($scope.privateImages, (privateImage2, key) ->
            $scope.privateImages.splice(key, 1) if privateImage2.id is privateImage.id
          )
        )
    )

  $scope.transfer = (image, region) ->
    imageActionValues = { type: "transfer", region: region.slug }

    ImageActions.save({id: image.id}, imageActionValues, (response) ->
      BroadcastService('xhr-success', response.action.type+" "+response.action.status)
    )
]