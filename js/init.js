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
    var createDropletButton = $('<p><button type="button" class="btn btn-info">Create Droplet</button></p>');
    createDropletButton.on('click', function(){
      // show newdroplet template in modal
      var datas = {};
      $.do.common.simpleGET('https://api.digitalocean.com/v2/regions', {}, function(data, status, xhr){
        datas.regions = data.regions;
        $.do.common.simpleGET('https://api.digitalocean.com/v2/sizes',   {}, function(data, status, xhr){
          datas.sizes = data.sizes;
          $.do.common.loadColumn('newdroplet', datas, 'central-new-droplet');
            $('#central-new-droplet-col').on('do:newdroplet:column:loaded', function(){
              $('.popover-trigger').popover({});
              $('input[name=region]').on('change', function(e){
                $('input[name=region]').parent().find('.glyphicon').css("color", "white");
                $('input[name=region]:checked').parent().find('.glyphicon').css("color", "red");
              });

              $('input[name=size]').on('change', function(e){
                $('input[name=size]').parent().find('.glyphicon').css("color", "white");
                $('input[name=size]:checked').parent().find('.glyphicon').css("color", "red");
              });
            });
        });
      });

    });
    $('#central-col').append(createDropletButton);
    $('#central-col').append($('<p id="central-new-droplet-col"></p>'));
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
    return $.do.common.columnMoustache(loaderType, data, destination);
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
console.log(data);
  $.Mustache.load("./templates/" + fetchfrom + ".html?cb="+(new Date().getTime()))
  .done(function () {
    $('#' + destination + '-col').mustache(fetchfrom + "template", data);
    $('#' + destination + '-col').trigger('do:' + loaderType + ':column:loaded');
  });
}

$.do.common.simplePOST = function(location, data, successHandler, errorHandler) {
  return $.do.common.simpleAJAX('POST', location, data, successHandler, errorHandler);
}

$.do.common.simpleGET = function(location, data, successHandler, errorHandler) {
  return $.do.common.simpleAJAX('GET',  location, data, successHandler, errorHandler);
}

$.do.common.simpleAJAX = function(type, location, data, successHandler, errorHandler) {
  if (!errorHandler) {
    errorHandler = function(){};
  }

  if (!successHandler) {
    successHandler = function(){};
  }

  options = {
    url:        location,
    type:       type,
    dataType:   'json',
    data:       data,
    beforeSend: function(xhr, settings) {
        xhr.setRequestHeader('accept', 'application/json, text/javascript');
        xhr.setRequestHeader('Authorization',  "Bearer " + $('#oauthToken').val());
    },
    success:     successHandler,
    error:       errorHandler,
    crossDomain: true,
    xhrFields:   {
      withCredentials: true
    }
  };

  return $.ajax(options)
}
