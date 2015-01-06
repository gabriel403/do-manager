$( document ).ready(function(){
  var datas = {};
  $('[name="list-droplets"]').on('ajax:success', function(ajax, response, status){
    datas.droplets = response.droplets
    $.do.common.simpleGET('https://api.digitalocean.com/v2/sizes', {}, function(data, status, xhr){
      datas.sizes = data.sizes;

      $.each(datas.droplets, function(index, droplet){
        // active, new is on
        // off
        droplet.isPoweredOn = (droplet.status !== "off");

        droplet.backupsEnabled = false;

        if (droplet.features.indexOf('backups') > -1) {
          droplet.backupsEnabled = true;
        }
      });

      $('#central-col').empty();
      $('#central-col').append($('<p id="central-new-droplet-col"></p>'));
      $.do.common.loadColumn('droplet', datas, 'central');
    });
  });

  $( 'body' ).on("do:droplet:column:loaded", function() {
    var createDropletButton = $('<p id="createDroplet"><button type="button" class="btn btn-info">Create Droplet</button></p>');
    createDropletButton.on('click', $.do.newDroplet);
    $('#central-col').prepend(createDropletButton);

    $('.dlt-droplet').on('ajax:success', function() {
      $.do.common.messageDisplay('success', 'Droplet deleted!');
      $(this).closest('.well').remove();
    });

    $('.droplet-action').on('ajax:success', function(ajax,response,status) {
      $.do.common.messageDisplay('success', 'Droplet ' + response.action.type.replace('_', ' ') + ' ' + response.action.status.replace('-', ' '));
    });
  });
});
