let ancestor = "";

$(document).on('click', '.def-customer',
  (e) => {
    let id = $(e.target).siblings('div').text().trim();
    $('#customer-input').val(id);
    $('#no-customer').hide();
    $('.customer-list').empty();
    let newCustomer = $('<li class="new-customer">'+
                        $(e.target).text()+
                      '</li>').hide();
    $('.customer-list').append(newCustomer);
    newCustomer.fadeIn(250);
});

$(document).on('click', '#react-item',
  (e) => {
    let alreadyInList = false;
    let target = $(e.target).siblings('img');
    let id = target.siblings('input').val();

    $('.default-customers li').each( (idx, li) => {
      if($(li).find('div').text().trim() === id){
        alreadyInList = true;
      }
    });

    if(!alreadyInList)
    {
      if ( $('.default-customers li').length == 5 ) {
        $('.default-customers li:last').remove();
      }

      let searchCustmomer = $('<li>'+
                                '<a class="def-customer">'+target.siblings('div').text()+'</a>'+
                                '<div style="display:none;">' +target.siblings('input').val()+ '</div>'+
                              '</li>').hide();
      ancestor = $(target).parents('div').last();
      ancestor.fadeOut(100);

      $('.default-customers').prepend(searchCustmomer);
      searchCustmomer.fadeIn(250);
    }
  }
);

$(document).on('click', '#customer-app',
  () => {
  ancestor.fadeIn(250);
});
