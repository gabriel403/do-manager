@dom.controller 'DropletsController', ['$scope', '$timeout', '$route', 'Droplets', 'DropletActions', 'BroadcastService', ($scope, $timeout, $route, Droplets, DropletActions, BroadcastService) ->
  $scope.droplets = []

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

  $scope.submitActionForm = (isValid, actionType, dropletId) ->
    angular.forEach($scope.droplets, (droplet) ->
      if 'actionType' of droplet and 'value' of droplet.actionType
        DropletActions.save({droplet_id: droplet.id}, {type: droplet.actionType.value}, (response) ->
          BroadcastService('xhr-success', response.action.type+" "+response.action.status)
          droplet.actions.push(response.action)
          droplet.actionType = {}
        )
    )

  $scope.dropletUpdate()
]
