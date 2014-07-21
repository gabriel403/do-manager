$( document ).ready(function(){
  $('[name="list-images"]').on('ajax:success', function(ajax, response, status){


    $.do.common.simpleGET('https://api.digitalocean.com/v2/regions', {}, function(data, status, xhr){
      var privimages = [];
      var pubimages  = [];
      $.each(response.images, function(index, image){
        if (!image.public){
          var regions = $.extend(true, [], data.regions);
          $.each(regions, function(index,region){
            if ($.inArray(region.slug, image.regions) >= 0) {
              region.disabled = true;
            } else {
              region.disabled = false;
            }
          });
          image.globalregions = regions;
          privimages.push(image);
        } else {
          pubimages.push(image);
        }
      });
      $('#central-col').empty();
      $.do.common.loadColumn('imagesgroups', {privimages: privimages, pubimages: pubimages}, 'central');
    });
  });

  $( 'body' ).on("do:imagesgroups:column:loaded", function() {
    $('.dlt-image').on('ajax:success', function() {
      $.do.common.messageDisplay('success', 'Image deleted!');
      $(this).closest('.alert').remove();
    });
  });
});
