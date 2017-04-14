$('.add-tag-link').click( () => {
  $('.add-tag-dialogue').hide();
  let tagDialogue = $('<div class="add-tag-dialogue">'+
                        '<label id="tag-header">Name</label>'+
                        '<input id="tag-name" type"text" name="name" maxLength="23">'+
                        '<a class="tag-dialogue-enter"> Enter </a>'+
                        '<a class="tag-dialogue-cancel"> Cancel </a>'+
                       '</div>').hide();
  $('#no-tag').hide();
  $('.tag-list').append(tagDialogue);
  tagDialogue.fadeIn(250);
  //$('.wrap').css('-webkit-filter', 'blur(5px)');
});

$(document).on('click', '.tag-dialogue-enter',
  () => {
    if($('#tag-name').val() !== "") {
      let tagObj = $(`<li> <a class="tag-item" href="#"> ${$('#tag-name').val()} </a> </li>`).hide();
      $('.add-tag-dialogue').remove();
      $('.tag-list').append(tagObj);
      tagObj.fadeIn(250);
    }
  }
);

$(document).on('click', '.tag-dialogue-cancel',
  () => {
    $('.add-tag-dialogue').fadeOut(250 , () => {
      $('.add-tag-dialogue').remove();
      if($('.tag-list li').length < 2) {
        $('#no-tag').fadeIn(250);
      }
    });
  }
);

$(document).on('hover', '.tag-item',
  (ev) => {
    console.log(ev.target);
    $(ev.target).css('width', '+=30');
  }
);
