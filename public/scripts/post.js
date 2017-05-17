var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['code-block','link'],

  ['image', 'video'],

  [{ 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' },{ 'align': [] }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript

  [{ 'color': [] }],          // dropdown with defaults from theme

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
];

var quill = new Quill('.content-editor', {
  modules: {
    toolbar: toolbarOptions
  },
  theme: 'snow'   // Specify theme in configuration
});

// SOCKET.IO CODE -------------------------

var socket = io();

$('#article_form').on('submit',function(e) {
  let tagString = "";
  $('.tag-list li').each( function(li) {
      if(!$(this).is('#no-tag')) {
          var trimmed = $(this).text().trim();
          tagString += (trimmed + ';');
      }
  });
  if(!tagString){
    $('#tag-input').val(null);
  }
  else
  {
    $('#tag-input').val(tagString.trim());
  }

  if (!$("#customer-input").val()) {
    $("#customer-input").val("n/a");
  }

  var delta = quill.getContents();
  $('.secret-delta').val(JSON.stringify(delta));
  var html = $('.ql-editor').html();
  $('.secret-content').val(html);

  if(!$('.secret-content').val() || !$('.title').val() || !$('.symptoms').val()){
    return;
  }
  var data = $("#article_form").serializeArray();
  socket.emit('send', data);
  location.href = "/";
});

socket.on('receieved', function(data){
  var url = ("/articles/"+data.Title.replace(/\?/g,"")+"?id="+data.ID).replace(/ /g,"-");
  // Redirect
  location.href = url;
});
