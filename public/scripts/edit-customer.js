let ancestor = "";

$(document).on('click', '#react-item',
  (e) => {
    let target = $(e.target).siblings('img');
    let id = target.siblings('input').val();

    $('#customer-input').val(id);
    $('.customer-list').empty();
    let newCustomer = $('<li class="new-customer">'+
                        $(target).siblings('div').text().trim()+
                      '</li>').hide();


    ancestor = $(target).parents('div').last();
    ancestor.fadeOut(100);

    $('.customer-list').append(newCustomer);
    newCustomer.fadeIn(250);
    $('#hidden-customer-id').val(id);
  }
);

$(document).on('click', '#customer-app',
  () => {
  ancestor.fadeIn(250);
});
