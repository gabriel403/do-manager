$.do.newDroplet = function(){
  // show newdroplet template in modal
  var datas = {};
  $.do.common.simpleGET('https://api.digitalocean.com/v2/images?per_page=100', {}, function(data, status, xhr){
    var images  = [];

    // make our private images the first ones listed
    $.each(data.images, function(index, image){
      if (!image.public){
        images.push(image);
      }
    });

    $.each(data.images, function(index, image){
      if (image.public){
        images.push(image);
      }
    });

    datas.images = images;

    $.do.common.simpleGET('https://api.digitalocean.com/v2/regions', {}, function(data, status, xhr){
      datas.regions = data.regions;

      $.do.common.simpleGET('https://api.digitalocean.com/v2/sizes',   {}, function(data, status, xhr){
        datas.sizes = data.sizes;

        $.do.common.simpleGET('https://api.digitalocean.com/v2/account/keys', {}, function(data, status, xhr){
          $.do.common.regionsSizes = datas;
          datas.keys = data.ssh_keys;

          $.do.common.loadColumn('newdroplet', datas, 'central-new-droplet');
          $('#central-new-droplet-col').on('do:newdroplet:column:loaded', function(){
            $('#createDroplet').remove();
            $('.popover-trigger').popover({});

            $('#new-droplet-form').on('ajax:success', function(ajax, response, status) {
              $('#central-col').mustache("droplettemplate", [response.droplet], { method: 'prepend' });

              $.do.common.messageDisplay('success', 'Droplet created!');

              $('.dlt-droplet').on('ajax:success', function() {
                $.do.common.messageDisplay('success', 'Droplet deleted!');
                $(this).closest('.well').remove();
              });

              $(this).parent().remove();
            });

            $('input[name=region]').on('change', function(e){
              $('input[name=size]').attr('disabled', false);

              // selecting a region will invalidate some sizes
              $.each($.do.common.regionsSizes.regions, function(index, region){
                if (region.slug == $('input[name=region]:checked').val()) {
                  $('input[name=size]').not('input[name=size][value=' + region.sizes.join('],[value=') + ']').attr('disabled', true);
                }
              });
            });

            $('input[name=size]').on('change', function(e){
              $('input[name=region]').attr('disabled', false);

              // selecting a size will invalidate some regions
              $.each($.do.common.regionsSizes.sizes, function(index, size){
                if (size.slug == $('input[name=size]:checked').val()) {
                  $('input[name=region]').not('input[name=region][value=' + size.regions.join('],[value=') + ']').attr('disabled', true);
                }
              });
            });
          });
        });
      });
    });
  });
}
