@dom.controller 'DropletsController', ['$scope', '$timeout', '$route', 'Droplets', 'DropletActions', 'Images', 'BroadcastService', ($scope, $timeout, $route, Droplets, DropletActions, Images, BroadcastService) ->
  $scope.droplets = []
  $scope.droplet  = {}

  Images.query {'private': true}, (data) ->
    $scope.privateImages = data.images

  $scope.dropletUpdate = ->
    Droplets.query((data) ->
      angular.forEach(data.droplets, (droplet) ->
        droplet.actionOptions = []
        if droplet.status is 'active'
          droplet.actionOptions.push({value: 'reboot', name: 'Reboot'})
          droplet.actionOptions.push({value: 'shutdown', name: 'Shutdown'})
          droplet.actionOptions.push({value: 'power_cycle', name: 'Force Power Off and On'})
          droplet.actionOptions.push({value: 'power_off', name: 'Force Power Off'})

        if droplet.status is 'off'
          droplet.actionOptions.push({value: 'power_on', name: 'Power On'})
          droplet.actionOptions.push({value: 'resize', name: 'Resize'})
          droplet.actionOptions.push({value: 'snapshot', name: 'Create Snapshot'})

        droplet.actionOptions.push({value: 'password_reset', name: 'Reset Root Password'})
        droplet.actionOptions.push({value: 'disable_backups', name: 'Disable Backups'})
        droplet.actionOptions.push({value: 'rebuild', name: 'Rebuild from Image'})


        DropletActions.query({droplet_id: droplet.id, page: 1, per_page: 5}, (response) ->
          droplet.actions = response.actions
          angular.forEach($scope.droplets, (sdroplet, key) ->
            if sdroplet.id is droplet.id
              angular.extend(sdroplet, droplet)
              sdroplet.actions = droplet.actions
              # $scope.droplets[key] = droplet
              # sdroplet = droplet
          )

        )

        dropletFound = false
        angular.forEach($scope.droplets, (sdroplet) ->
          if sdroplet.id is droplet.id
            dropletFound = true
        )

        if !dropletFound
          $scope.droplets.push(droplet)
      )

      if $route.current.controller is 'DropletsController'
        $timeout( $scope.dropletUpdate, 30000 )
    )

  $scope.submitActionForm = (isValid, droplet) ->
    return unless isValid

    dropletActionValues = { type: droplet.actionType.value }

    dropletActionValues.image = droplet.image.id if droplet.actionType.value is 'rebuild'
    console.log dropletActionValues
    DropletActions.save({droplet_id: droplet.id}, dropletActionValues, (response) ->
      BroadcastService('xhr-success', response.action.type+" "+response.action.status)
      droplet.actions.push(response.action)
      droplet.actionType = {}
    )

  $scope.deleteVm = (dropletId) ->
    angular.forEach($scope.droplets, (droplet) ->
      if droplet.id is dropletId
        Droplets.delete({id: dropletId}, {}, (stuff) ->
          console.log stuff
          angular.forEach($scope.droplets, (droplet2, key) ->
            $scope.droplets.splice(key, 1) if droplet2.id is droplet.id
          )
        )
    )



  $scope.dropletUpdate()
]
