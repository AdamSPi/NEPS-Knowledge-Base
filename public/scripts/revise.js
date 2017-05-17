$('#editFader').hide();

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

var quill = {};

$(document).ready( () => {
  var urlString = $(location).attr('href').toString();
  var url = urlString.substr(urlString.length-8);

  $.ajax({
      url: '/revisions?origin='+url,
      type: 'post',
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

          $('#no-revisions').remove();
          $('.revision-list').append('<li>'+
                                      '<div class="cell">'+
                                      '<a href="/prev/'+rev.Title.replace(/ /g, '-')+
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
                      'Solution Summary:<br> <textarea id="edit-summary" class="form-control" name="summary"> </textarea><br>'+
                      'Content:<br><div id="edit-content" class="content-editor" ></div>'+
                      '<input type="hidden" class="secret-content" name="content">'+
                      '<input type="hidden" class="secret-delta" name="delta">'+
                      //TODO: Include tag editing and customer editing too
                      // Pass Article ID to editor
                      '<input type="hidden" id="hidden-id" name="id" value="' + $('#edit-id').val() + '"/>'+
                      '<input type="hidden" id="hidden-customer-id" name="customer" value="'+( $('.customer-list').find('input').val() || 'n/a' )+'"/>'+
                      '<input type="hidden" id="hidden-tag" name="tags" />'+
                      '<input type="file" id="upload-input" name="uploads[]" multiple="multiple" />'+
                    '</div> </form>')
                 .hide();
  $('.article').after(editForm);
  $('#edit-title').val($('#post-title').text());
  $('#edit-symptoms').val($('.symptoms').text().trim());
  if($('.summary').text().trim() !== "This issue isn't solved yet...")
  {
    $('#edit-summary').val($('.summary').text().trim());
  }
  else {
    $('#edit-summary').val("");
  }


  editForm.fadeIn(250);
  $('.com').fadeIn(250);
  $('.sidebar-post').hide();
  $('.sidebar').fadeIn(250);

  quill = new Quill('.content-editor', {
    modules: {
      toolbar: toolbarOptions
    },
    theme: 'snow'   // Specify theme in configuration
  });

  quill.setContents(JSON.parse($('#delta').text()));
});

$(document).on('click', '#cancel',
  function() {
    $('#editor').remove();

    $('.sidebar').hide();
    $('.sidebar-post').fadeIn(250);

    $('.com').hide();
    $('.article').fadeIn(250);
    $('.com').fadeIn(250);
  }
);

var socket = io();

$(document).on('click', '#save',
  function() {
    let tagString = "";
    $('.tag-list li a').each( function(idx, li) {
        if(!$(li).is('#no-tag')) {
            var trimmed = $(this).text().trim();
            tagString += (trimmed + ';');
        }
    });
    if (tagString.trim()) {
      $("#hidden-tag").val(tagString.trim());
    }
    else{
      $('#hidden-tag').val(null);
    }

    if (!$("#hidden-customer-id").val()) {
      $("#hidden-customer-id").val("n/a");
    }

    var delta = quill.getContents();
    $('.secret-delta').val(JSON.stringify(delta));
    var html = $('.ql-editor').html();
    $('.secret-content').val(html);


    var data = $("#editor").serializeArray();
    socket.emit('update', data);
    location.href = "/";
  });

socket.on('success', function(data){
  console.log('success');
  var url = ("/articles/"+data.Title.replace(/\?/g,"")+"?id="+data.ID).replace(/ /g,"-");
  // Redirect
  location.href = url;
});
