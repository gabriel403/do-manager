$( document ).ready(function(){
  $('[name="list-domains"]').on('ajax:success', function(ajax,response,status){
    $('#central-col').empty();
    // $('#central-col').append($('<p id="central-new-droplet-col"></p>'));
    $.do.common.loadColumn('domain', response.domains, 'central');
  });

  $( 'body' ).on("do:domain:column:loaded", function() {
  });
});
