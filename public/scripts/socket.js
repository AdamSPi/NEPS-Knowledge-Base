var socket = io();

socket.on('receieved', function(data){
  var url = ("/articles/"+data.Title.replace(/\?/g, "")+"?id="+data.ID).replace(/ /g,"-");
  $('.article-holder').css('padding-top', '+=3px');

  tagstring = '';
  if (data.Tags) {
      var taglist = data.Tags.split(';');
      taglist.forEach(function(tag) {
          tagstring += (tag + ', ')
      });
      tagstring = tagstring.substring(0, tagstring.length - 2);
  }

  var extra = $('<div class="line">'+
                  '<div class="article-title cell" style="width: 205px;"> <a href='+url+'>'+data.Title+'</a> </div>'+
                  '<div class="article-customer cell" style="width: 128px;">'+ (data.Name || '<div style="color: #AAA;"> n/a </div>') +'</div>' +
                  '<div class="article-tag cell" style="width: 204px;">'+(tagstring || '<div style="color: #AAA;"> n/a </div>')  +'</div>' +
                  '<div class="article-date cell" style="width: 73px;">'+'<div style="color: #AAA;"> just now... </div>'+'</div>' +
                  '<div class="article-revised cell" style="width: 75px;">'+'<div style="color: #AAA;"> n/a </div>'+'</div>' +
                '</div>'+'<div class="line-spacer"></div>').hide();
  $('.article-holder').prepend(extra);
  extra.fadeIn(500);
  $('.article-holder').css('padding-top', '-=3px');
});
