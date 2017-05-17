$(document).on('click', '.downloadable', (e) => {
  e.preventDefault();  //stop the browser from following
  let id = $(e.target).siblings('.cell').find('.hidden-attach').val();
  console.log(id);
  location.href = '/download?file='+id;
});
