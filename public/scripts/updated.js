$(document).ready( () => {
  var urlString = $(location).attr('href').toString();
  var url = urlString.substr(urlString.length-8);

  $.ajax({
      url: '/update?origin='+url,
      type: 'POST',
      processData: false,
      contentType: false,
      success: function(data) {
        data.forEach( (rev) => {

           function mod(n, m) {
             return ((n % m) + m) % m;
           }

           var dateOnly = rev.Time.split(' ')[0];
           var yearFormat = dateOnly.split('/');
           var yy =  yearFormat[2].substr(2, 2);
           var finalDateString = yearFormat[0] +'/'+ yearFormat[1] +'/'+ yy;

           var timeOnly = rev.Time.split(' ')[1];
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

          $('.revision-list').append('<li>'+
                                      '<div class="cell">'+
                                      '<a href="/articles/'+rev.Title.replace(/ /g, '-')+
                                      '?id='+rev.ID+'">'+rev.Title +'</a>'+
                                      '</div>'+
                                      '<div class="cell" style="font-size: 11px;">'+
                                          finalDateString + ' at ' + finalTimeString +
                                      '</div>'+
                                     '</li>'
                                   );
            });
        }
      });
});
