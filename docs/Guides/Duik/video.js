// Load Videos in the Docs
$(document).ready(function () {
    //YOUTUBE
    $('img[alt="YOUTUBE"]').each(function () {
        var id = $(this).attr('src').split('/')[$(this).attr('src').split('/').length - 1];
        var video = '<div class="ratio-1-78"><iframe src="https://www.youtube.com/embed/' + id + '?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe></div>';
        $(this).replaceWith(video);
    });
});
