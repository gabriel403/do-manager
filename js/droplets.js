$( document ).ready(function(){
  $('[name="list-droplets"]').on('ajax:success', function(ajax,response,status){
    $('#central-col').empty();
    $('#central-col').append($('<p id="central-new-droplet-col"></p>'));
    $.do.common.loadColumn('droplet', response.droplets, 'central');
  });

  $( 'body' ).on("do:droplet:column:loaded", function() {
    var createDropletButton = $('<p id="createDroplet"><button type="button" class="btn btn-info">Create Droplet</button></p>');
    createDropletButton.on('click', $.do.newDroplet);
    $('#central-col').prepend(createDropletButton);

    $('.dlt-droplet').on('ajax:success', function() {
      $.do.common.messageDisplay('success', 'Droplet deleted!');
      $(this).closest('.well').remove();
    });
  });
});
