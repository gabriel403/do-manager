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
    $.do.common.loadColumn('droplet', response.droplets);
  })

});

$.do = {};
$.do.common = {};

$.do.common.loadColumn = function(loaderType, data) {
  if (data) {
    $.do.common.columnMoustache(loaderType, data);
    return;
  }

  $.do.common.simpleGET(loaderType, {}, function(data, status, xhr) {
    $.do.common.columnMoustache(loaderType, xhr.responseJSON);
  });
}

$.do.common.columnMoustache = function(loaderType, data) {
  var fetchfrom = loaderType;
  if (data.length == 0) {
    fetchfrom = 'empty' + loaderType;
    data.push({});
  }

  $.Mustache.load("./templates/" + fetchfrom + ".html?cb="+(new Date().getTime()))
  .done(function () {
    $('#' + loaderType + '-col').mustache(fetchfrom + "template", data);
    $('#' + loaderType + '-col').trigger('do:' + loaderType + ':column:loaded');
  });
}
