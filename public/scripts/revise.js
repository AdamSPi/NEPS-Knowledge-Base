$('#editFader').hide();

$('#post-title').hover(
  function() {
    // Hover code
    var editButton = $('#editFader');
    editButton.fadeIn(500);
  }
);

$('#post-title').on('mouseout',
  function() {
    // Unhover
    $('#editFader').fadeOut(250);
  }
);

$('#post-title').click(function() {
  $('.article').hide();
  $('.com').hide();
  var editForm = $('<form id="editor" onsubmit="return false;">'+
                    '<div class="editForm">'+
                      '<div id="edit-toolbar" class="btn-group" role="group">'+
                        '<button id="save" type="submit" class="btn btn-default btn-secondary" name="submit">Save</button>'+
                        '<button id="view" type="button" class="btn btn-default btn-secondary">View</button>'+
                        '<button id="cancel" type="button" class="btn btn-default btn-secondary">Cancel</button>'+
                      '</div>'+
                      '<br><br>'+
                      'Title:<br> <input id="edit-title" type="text" class="form-control" name="title"><br>'+
                      'Symptoms:<br> <input id="edit-symptoms" type="text" class="form-control" name="Symptoms"><br>'+
                      'Summary:<br> <textarea id="edit-summary" class="form-control" name="summary"> </textarea><br>'+
                      'Content:<br><div id="edit-content" class="content-editor" ></div>'+
                      '<input type="hidden" class="secret-content" name="content">'+
                      '<input type="hidden" class="secret-delta" name="content">'+
                      //TODO: Include tag editing and customer editing too
                      // Pass Article ID to editor
                      '<input type="hidden" id="hidden-id" name="id" value="' + $('#edit-id').val() + '">'+
                    '</div> </form>')
                 .hide();
  $('.article').after(editForm);
  $('#edit-title').val($('#post-title').text());
  $('#edit-symptoms').val($('.symptoms').text().trim());
  $('#edit-summary').val($('.summary').text().trim());


  editForm.fadeIn(250);
  $('.com').fadeIn(250);

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
  }).setContents(JSON.parse($('#delta').text()));
});

$(document).on('click', '#cancel',
  function() {
    $('#editor').remove();
    $('.com').hide();
    $('.article').fadeIn(250);
    $('.com').fadeIn(250);
  }
);

var socket = io();

$(document).on('click', '#save',
  function() {
      var data = $("#editor").serializeArray();
      socket.emit('update', data);
  }
);

socket.on('success', function(data){
  var url = ("/articles/"+data.Title+"?id="+data.ID).replace(/ /g,"-");
  // Redirect
  location.href = url;
});
