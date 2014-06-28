$( document ).ready(function(){

  $('[name="list-images"]').on('ajax:success', function(ajax,response,status){
    var privimages = [];
    var pubimages  = [];
    $.each(response.images, function(index, image){
      if (!image.public){
        privimages.push(image);
      } else {
        pubimages.push(image);
      }
    });
    $('#central-col').empty();
    $.do.common.loadColumn('imagesgroups', {privimages: privimages, pubimages: pubimages}, 'central');
  })


  $('[name="list-droplets"]').on('ajax:success', function(ajax,response,status){
    $('#central-col').empty();
    $('#central-col').append($('<p id="central-new-droplet-col"></p>'));
    $.do.common.loadColumn('droplet', response.droplets, 'central');

    if (!$.do.config.newdroplet ) {
      return;
    }

    var createDropletButton = $('<p><button type="button" class="btn btn-info">Create Droplet</button></p>');
    createDropletButton.on('click', $.do.newDroplet);
    $('#central-col').prepend(createDropletButton);
  });
});
