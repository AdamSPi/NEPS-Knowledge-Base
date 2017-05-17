$(document).ready( () => {
  var urlString = $(location).attr('href').toString();
  var url = urlString.substr(urlString.length-8);

  $.ajax({
      url: '/attachments?origin='+url,
      type: 'post',
      processData: false,
      contentType: false,
      success: function(data) {
        data.forEach( (attachment) => {

           function mod(n, m) {
             return ((n % m) + m) % m;
           }

           var dateOnly = attachment.Time.split(' ')[0];
           var yearFormat = dateOnly.split('/');
           var yy =  yearFormat[2].substr(2, 2);
           var finalDateString = yearFormat[0] +'/'+ yearFormat[1] +'/'+ yy;

           var timeOnly = attachment.Time.split(' ')[1];
           var timeFormat = timeOnly.split(':');
           var AmOrPm = ' a.m';
           if(timeFormat[0] >= 0 && timeFormat[0] < 4){
             var date = parseInt(yearFormat[1])-1;
             finalDateString = yearFormat[0] +'/'+ date +'/'+ yy;
             AmOrPm = ' p.m';
           }
           if (timeFormat[0]-4 > 12)
           {
             AmOrPm = ' p.m';
           }
           var finalTimeString;
           var twelveHourFormat = mod(parseInt(timeFormat[0])-4, 12);
           if (twelveHourFormat == 0 ) {
            finalTimeString = "12:" + timeFormat[1] + AmOrPm;
           } else {
             finalTimeString =twelveHourFormat + ':' + timeFormat[1] + AmOrPm;
           }

          $('#no-attach').remove();
          $('.attachment-list').append('<div class="line" style="margin-bottom: 5px;">'+
                                      '<img class="downloadable" src="../images/download.ico" />'+
                                        '<div class="cell" style="text-align: left;width: 100px; font-size: 14px;">'+
                                          '<input class="hidden-attach" type="hidden" value="'+attachment.ID+'" />'+
                                          attachment.Name+
                                        '</div>'+
                                        '<div class="cell" style="text-align: right;width: 150px;margin-left: 5px;font-size: 12px;">'+
                                          finalDateString + ' at ' + finalTimeString +
                                        '</div>'+
                                     '</div>'
                                   );
            });
        }
      });
});


$('#upload').on('click', function (){
    $('#upload-input').click();
    $('#progressBar').width('0%');
});

$('#upload-input').on('change', function(){

  var files = $(this).get(0).files;
  var urlString = $(location).attr('href').toString();
  var url = urlString.substr(urlString.length-8);

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }

    $.ajax({
      url: '/upload?origin='+url,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          console.log('done');
          $.ajax({
              url: '/attachments?origin='+url,
              type: 'post',
              processData: false,
              contentType: false,
              success: function(data) {
                $('.attachment-list').empty();
                data.forEach( (attachment) => {
                   function mod(n, m) {
                     return ((n % m) + m) % m;
                   }

                   var dateOnly = attachment.Time.split(' ')[0];
                   var yearFormat = dateOnly.split('/');
                   var yy =  yearFormat[2].substr(2, 2);
                   var finalDateString = yearFormat[0] +'/'+ yearFormat[1] +'/'+ yy;

                   var timeOnly = attachment.Time.split(' ')[1];
                   var timeFormat = timeOnly.split(':');
                   var AmOrPm = ' a.m';
                   if(timeFormat[0] >= 0 && timeFormat[0] < 4){
                     var date = parseInt(yearFormat[1])-1;
                     finalDateString = yearFormat[0] +'/'+ date +'/'+ yy;
                     AmOrPm = ' p.m';
                   }
                   if (timeFormat[0] > 12)
                   {
                     AmOrPm = ' p.m';
                   }
                   var finalTimeString;
                   var twelveHourFormat = mod(parseInt(timeFormat[0])-4, 12);
                   if (twelveHourFormat == 0 ) {
                    finalTimeString = "12:" + timeFormat[1] + AmOrPm;
                   } else {
                     finalTimeString =twelveHourFormat + ':' + timeFormat[1] + AmOrPm;
                   }

                  $('#no-attach').remove();
                  $('.attachment-list').append('<div class="line" style="margin-bottom: 5px;">'+
                                                '<img class="downloadable" src="../images/download.ico" />'+
                                                  '<div class="cell" style="text-align: left;width: 100px; font-size: 14px;">'+
                                                    '<input class="hidden-attach" type="hidden" value="'+attachment.ID+'" />'+
                                                    attachment.Name+
                                                    '</div>'+
                                                    '<div class="cell" style="text-align: right;width: 150px;margin-left: 5px;font-size: 12px;">'+
                                                    finalDateString + ' at ' + finalTimeString +
                                                    '</div>'+
                                               '</div>' );
                });
              }
          });
      },
      xhr: function() {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);
            // update the Bootstrap progress bar with the new percentage
            $('#progressBar').width(percentComplete + '%');
            if (percentComplete === 100) {
              setTimeout(function() {
                $('#progressBar').width('0%');
              }, 250);

            }
          }

        }, false);

        return xhr;
      }
    });

  }
});
