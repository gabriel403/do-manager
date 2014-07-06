$( document ).ready(function(){
  $('#paypal-popover-trigger').popover({
    html : true,
    content: function() {
      return $('#paypal-form').html();
    },
    // container: 'paypal-popover-trigger'
  });

  if ($.cookie('do-hidebar')) {
    $('#dismisser').closest('.well').addClass('hide');
  }

  $('#dismisser').on('click', function(){
    $(this).closest('.well').addClass('hide');
    $.cookie('do-hidebar',   true,   { expires: 7, path: '/' });
  })

  $(document.body).on('click', '.dropdown-menu li', function( event ) {
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

  $(document).on('ajax:error', $.do.common.ajaxError);
  $("ul[data-remote='true']").on('ajax:error', $.do.common.ajaxError);

});

$.do.common.ajaxError = function(event, xhr, status) {
  if ('unauthorized' == xhr.responseJSON.id) {
    $.do.common.errorDisplay('unauthorized', xhr.responseJSON.message);
    $('body').addClass('unauthorized');
  } else if ('unprocessable_entity' == xhr.responseJSON.id) {
    $.do.common.errorDisplay('unprocessable', xhr.responseJSON.message);
    $('body').addClass('unprocessable');
  } else if ('not_found' == xhr.responseJSON.id) {
    $.do.common.errorDisplay('notfound', xhr.responseJSON.message);
    $('body').addClass('notfound');
  }
};

$.do.common.errorDisplay = function(type, message) {
  $('.navbar, .well, .panel-group').css("opacity", "0.4");
  var errorAlert = $.do.common.messageDisplay('danger', message)

  errorAlert.on('click', function(){
    $('.navbar, .well, .panel-group').css("opacity", "1.0");
    $('body').removeClass(type);
  });
}

$.do.common.messageDisplay = function(type, message) {
  var errorAlert = $('<div class="alert alert-' + type +' text-center fixed-vertical-mid" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' + message + '</div>');
  $('body').append(errorAlert);
  $(this).remove();
  return errorAlert;
}


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
