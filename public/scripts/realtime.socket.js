var socket = io();

socket.on('receieved', function(data){
  var url = ("/articles/"+data.Title+"?id="+data.ID).replace(/ /g,"-");
  $('.Table').css('padding-top', '+=3px');
  var extra = $('<div class="row">'+
                  '<div class="cell"> <a href='+url+'>'+data.Title+'</a> </div>'+
                  '<div class="cell">'+ data.Customer +'</div>' +
                  '<div class="cell">'+data.Tags+'</div>' +
                  '<div class="cell">'+data.Created+
                '</div>').hide();
  $('.Table').prepend(extra);
  extra.fadeIn(500);
  $('.Table').css('padding-top', '-=3px');
});

$("#searchbar").on("keydown", function search(e) {
    if (e.keyCode == 13) {
        location.href = '/articles/search/' + $("#searchbar").val().replace(/ /g, "-");
    }
});
