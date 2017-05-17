//TODO cache search results so when user goes back it will show their previous results
$("#app > div > div > div > input").on("keydown", function search(e) {
    if (e.keyCode == 13) {
        // location.href = '/search/' + $("#app > div > div > div > input").val().replace(/ /g, "-");

        $('#failer').hide();
        $('#failer').css('padding-top', '55px');
        $('.article-holder').empty();
        $('#loader').fadeIn(500);
        $('.article-holder').css('padding-top', '0px');

        //AJAX call here
        $.ajax({
            url: '/search/' + $("#app > div > div > div > input").val().replace(/ /g, "-"),
            type: 'post',
            processData: false,
            contentType: false,
            success: function(data) {

                if (data[0].ID === "-1") {
                    $('#loader').fadeOut(500, function() {
                        $('#failer').fadeIn(250);
                        $('#failer').css('padding-top', '75px');
                    });
                    return;
                }

                data.forEach((obj) => {
                    var dateOnly = obj.Time.split(' ')[0];
                    var timeOnly = obj.Time.split(' ')[1]
                    var timeFormat = timeOnly.split(':');
                    var yearFormat = dateOnly.split('/');
                    var yy = yearFormat[2].substr(2, 2);
                    var finalDateString = yearFormat[0] + '/' + yearFormat[1] + '/' + yy;
                    if (timeFormat[0] >= 0 && timeFormat[0] < 4) {
                        var date = parseInt(yearFormat[1]) - 1;
                        finalDateString = yearFormat[0] + '/' + date + '/' + yy;
                    }

                    var updatedfinalDateString = null;
                    if (obj.Updated) {
                        var updateddateOnly = obj.Updated.split(' ')[0];
                        var updatedtimeOnly = obj.Updated.split(' ')[1]
                        var updatedtimeFormat = updatedtimeOnly.split(':');
                        var updatedyearFormat = updateddateOnly.split('/');
                        var updatedyy = updatedyearFormat[2].substr(2, 2);
                        updatedfinalDateString = updatedyearFormat[0] + '/' + updatedyearFormat[1] + '/' + updatedyy;
                        if (updatedtimeFormat[0] >= 0 && updatedtimeFormat[0] < 4) {
                            var updateddate = parseInt(updatedyearFormat[1]) - 1;
                            updatedfinalDateString = updatedyearFormat[0] + '/' + updateddate + '/' + updatedyy;
                        }
                    }

                    tagstring = '';
                    if (obj.Tags) {
                        var taglist = obj.Tags.split(';');
                        taglist.forEach(function(tag) {
                            tagstring += (tag + ', ')
                        });
                        tagstring = tagstring.substring(0, tagstring.length - 2);
                    }

                    var url = ("/articles/" + obj.Title.replace(/\?/g, "") + "?id=" + obj.ID).replace(/ /g, "-");

                    let menuItem = $('<div class="line">' +
                                        '<div class="article-title cell" style="width: 205px;">' +
                                            '<a href=' + url + '>' + obj.Title + '</a>' +
                                        '</div>' +
                                        '<div class="article-customer cell" style="width: 128px;">' +
                                            (obj.Name || '<div style="color: #AAA;"> n/a </div>') +
                                        '</div>' +
                                        '<div class="article-tag cell" style="width: 204px;">' +
                                          (tagstring || '<div style="color: #AAA;"> n/a </div>') +
                                        '</div>' + '<div class="article-date cell" style="width: 73px;">' +
                                          finalDateString +
                                         '</div>' +
                                         '<div class="article-revised cell" style="width: 75px;">' +
                                           (updatedfinalDateString || '<div style="color: #AAA;"> n/a </div>') +
                                          '</div>' +
                                        '</div>' +
                                        '<div class="line-spacer"></div>').hide();

                    $('.article-holder').append(menuItem);
                });

                $('.article-holder').css('position', 'relative').css('top', '-50px');
                $('#loader').fadeOut(500, function() {
                    $('.article-holder > div').each(function(idx) {
                        $('.article-holder').css('padding-top', '50px');
                        $(this).delay(20 * idx).fadeIn(1000);
                    });
                });

            }

        });
    }
});
