$( document ).ready(function(){
  $( document.body ).on( 'click', '.dropdown-menu li', function( event ) {
   var $target = $(event.currentTarget);
   $target.closest('.dropdown')
      .find('.toggle-text').text("List "+$target.text()).end().children('.dropdown-toggle').dropdown('toggle');
  });

  $("#rememberCreds").on('change', function(e){
    $.cookie('do-oauth',   $('#oauthToken').val(),   { expires: 7, path: '/' });
  });

  if ($.cookie('do-oauth')) {
    $('#oauthToken').val($.cookie('do-oauth'));
    $("#rememberCreds").prop('checked', true);
  }

  $('[name="list-droplets"]').on('ajax:success', function(ajax,response,status){
    $('#central-col').empty();
    var createDropletButton = $('<button type="button" class="btn btn-info">Create Droplet</button>');
    createDropletButton.on('click', function(){
      // show newdroplet template in modal
      $.do.common.loadColumn('newdroplet', [], 'central');
    });
    $('#central-col').append(createDropletButton);
    $.do.common.loadColumn('droplet', response.droplets, 'central');
  })

  $('[name="list-images"]').on('ajax:success', function(ajax,response,status){
    var privimages = [];
    var pubimages  = [];
    $.each(response.images, function(index, image){
      if (!image.public){
        privimages.push(image);
      } else {
        pubimages.push(image);
      }
    })
    $('#central-col').empty();
    $.do.common.loadColumn('imagesgroups', {privimages: privimages, pubimages: pubimages}, 'central');
  })


  $( document ).on('ajax:error', function(event, xhr, status) {
    if ('unauthorized' == xhr.responseJSON.id) {
      $('.navbar, .alert').css("opacity", "0.4");
      var restoreLink = $("<a href='#' style='position: absolute; top: 0; right: 0; border: 0; z-index: 1050;'>Restore</a>");
      restoreLink.on('click', function(){
        $('.navbar, .alert').css("opacity", "1.0");
        $('body').removeClass('unauthorized');
        $(this).remove();
      });
      $('body').append(restoreLink);
      $('body').addClass('unauthorized');
    }
  });

});

$.do = {};
$.do.common = {};

$.do.common.loadColumn = function(loaderType, data, destination) {
  if (data) {
    $.do.common.columnMoustache(loaderType, data, destination);
    return;
  }

  $.do.common.simpleGET(loaderType, {}, function(data, status, xhr) {
    $.do.common.columnMoustache(loaderType, xhr.responseJSON, destination);
  });
}

$.do.common.columnMoustache = function(loaderType, data, destination) {
  if (!destination) {
    destination = loaderType;
  }

  var fetchfrom = loaderType;
  if (data.length == 0) {
  //   fetchfrom = 'empty' + loaderType;
    data.push({});
  }

  $.Mustache.load("./templates/" + fetchfrom + ".html?cb="+(new Date().getTime()))
  .done(function () {
    $('#' + destination + '-col').mustache(fetchfrom + "template", data);
    $('#' + destination + '-col').trigger('do:' + loaderType + ':column:loaded');
  });
}
