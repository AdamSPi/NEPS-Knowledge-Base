var quill;
$('.add-com-link').click( () => {
  $('#comment-form').remove();
  $('#no-coms').hide();
  let comDialogue = $('<div id="comment-form"> <form id="com-form"> <div class="com-dialogue"></div>'+
                      '<input type="hidden" class="hidden-comment" name="comment"/>'+
                      '<div id="add-toolbar" class="btn-group comment-toolbar" role="group">'+
                        '<button id="com-add" type="button" class="btn btn-default btn-secondary" name="submit">'+
                          'Post'+
                        '</button>'+
                        '<button id="com-cancel" type="button" class="btn btn-default btn-secondary">'+
                          'Cancel'+
                        '</button>'+
                        '<input type="hidden" id="secret-id" name="id" value="' + $('#edit-id').val() + '">'+
                      '</div></form></div>').hide();
  $('.com-body').append(comDialogue);
  comDialogue.fadeIn(250);

  var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['code-block','link'],

    [{ 'list': 'ordered'}, { 'list': 'bullet'}],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript

    [{ 'color': [] }],          // dropdown with defaults from theme

    [{ 'size': ['small', false] }],  // custom dropdown
  ];

  quill = new Quill('.com-dialogue', {
    modules: {
      toolbar: toolbarOptions
    },
    theme: 'snow'   // Specify theme in configuration
  });
});

$(document).on('click', '#com-cancel',
  () => {
      $('#comment-form').fadeOut(250, () =>{
          $('#comment-form').remove();
      });
  }
);

var socket = io();

$(document).on('click', '#com-add',
  () =>{
    var delta = quill.getContents();
    console.log(delta.ops);
    $('.hidden-comment').val(delta.ops);

    var data = $("#com-form").serializeArray();
    socket.emit('comment', data);
  }
);

socket.on('success', function(data){

});
