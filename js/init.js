$( document ).ready(function(){
  $("#rememberCreds").on('change', function(e){
    $.cookie('do-client-id', $('#clientID').val(), { expires: 7, path: '/' });
    $.cookie('do-api-key',   $('#apiKey').val(),   { expires: 7, path: '/' });
  });

  if ($.cookie('do-client-id') && $.cookie('do-api-key')) {
    $('#clientID').val($.cookie('do-client-id'));
    $('#apiKey').val($.cookie('do-api-key'));
    $("#rememberCreds").prop('checked', true);
  }

});
