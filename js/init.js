$( document ).ready(function(){
  $("#rememberCreds").on('change', function(e){
    $.cookie('do-oauth',   $('#oauthToken').val(),   { expires: 7, path: '/' });
  });

  if ($.cookie('do-oauth')) {
    $('#oauthToken').val($.cookie('do-oauth'));
    $("#rememberCreds").prop('checked', true);
  }

  $('#list-droplets').on('ajax:success', function(ajax,response,status){
    console.log(response);
    $.do.common.loadColumn('droplet', response.droplets, 'central');
  })

  $('#list-images').on('ajax:success', function(ajax,response,status){
    console.log(response);
    var privimages = [];
    var pubimages  = [];
    $.each(response.images, function(index, image){
      if (!image.public){
        privimages.push(image);
      } else {
        pubimages.push(image);
      }
    })
    $.do.common.loadColumn('imagesgroups', {privimages: privimages, pubimages: pubimages}, 'central');
  })

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
    fetchfrom = 'empty' + loaderType;
    data.push({});
  }

  $.Mustache.load("./templates/" + fetchfrom + ".html?cb="+(new Date().getTime()))
  .done(function () {
    $('#' + destination + '-col').mustache(fetchfrom + "template", data);
    $('#' + destination + '-col').trigger('do:' + loaderType + ':column:loaded');
  });
}
