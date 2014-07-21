$( document ).ready(function(){
  $('[name="list-domains"]').on('ajax:success', function(ajax,response,status){
    $('#central-col').empty();
    $.each(response.domains, function(index, domain){
      $.do.common.simpleGET('https://api.digitalocean.com/v2/domains/'+domain.name+'/records', {}, function(data, status, xhr){
        domain.dns = data.domain_records;
        $.do.common.loadColumn('domain', domain, 'central');
      });
    });
    // $('#central-col').append($('<p id="central-new-droplet-col"></p>'));
  });

  $( 'body' ).on("do:domain:column:loaded", function() {
  });
});
