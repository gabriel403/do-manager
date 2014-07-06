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
});
