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
  });

  $( 'body' ).on("do:imagesgroups:column:loaded", function() {
    $('.dlt-image').on('ajax:success', function() {
      $.do.common.messageDisplay('success', 'Image deleted!');
      $(this).closest('.alert').remove();
    });
  });

  $('[name="list-droplets"]').on('ajax:success', function(ajax,response,status){
    $('#central-col').empty();
    $('#central-col').append($('<p id="central-new-droplet-col"></p>'));
    $.do.common.loadColumn('droplet', response.droplets, 'central');

    var createDropletButton = $('<p id="createDroplet"><button type="button" class="btn btn-info">Create Droplet</button></p>');
    createDropletButton.on('click', $.do.newDroplet);
    $('#central-col').prepend(createDropletButton);
  });

  $('[name="list-keys"]').on('ajax:success', function(ajax,response,status){
    $('#central-col').empty();
    $('#central-col').append($('<p id="central-new-key-col"></p>'));
    $.do.common.loadColumn('key', response.ssh_keys, 'central');
  });

  $( 'body' ).on("do:key:column:loaded", function() {
    var createKeyButton = $('<p id="createKey"><button type="button" class="btn btn-info">Create Key</button></p>');
    createKeyButton.on('click', function() {
      $('#createKey').remove();
      $.do.common.loadColumn('newkey', {}, 'central-new-key');
      $( 'body' ).on("do:newkey:column:loaded", function() {
        $('#new-key-form').on('ajax:success', function(ajax, response, status) {
          $('#central-col').mustache("keytemplate", [response.ssh_key], { method: 'prepend' });

          $.do.common.messageDisplay('success', 'Key created!');

          $('.dlt-key').on('ajax:success', function() {
            $.do.common.messageDisplay('success', 'Key deleted!');
            $(this).closest('.well').remove();
          });

          $(this).parent().remove();
        });
      });
    });

    $('#central-col').prepend(createKeyButton);

    $('.dlt-key').on('ajax:success', function() {
      $.do.common.messageDisplay('success', 'Key deleted!');
      $(this).closest('.well').remove();
    });
  });

  $('.dlt-droplet').on('ajax:success', function() {
    $.do.common.messageDisplay('success', 'Droplet deleted!');
    $(this).closest('.well').remove();
  });

});
