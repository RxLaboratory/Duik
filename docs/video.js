// Load Videos in the Docs
$(document).ready(function () {
    //YOUTUBE
    $('img[alt="YOUTUBE"]').each(function () {
        var id = $(this).attr('src').split('/')[$(this).attr('src').split('/').length - 1];
        var video = '<div class="ratio-1-78"><iframe src="https://www.youtube.com/embed/' + id + '?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe></div>';
        $(this).replaceWith(video);
    });
    $('img[alt="YOUTUBE_1-1"]').each(function () {
        var id = $(this).attr('src').split('/')[$(this).attr('src').split('/').length - 1];
        var video = '<div class="ratio-1-78"><iframe src="https://www.youtube.com/embed/' + id + '?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe></div>';
        $(this).replaceWith(video);
    });
    $('img[alt="VIMEO"]').each(function () {
        var id = $(this).attr('src').split('/')[$(this).attr('src').split('/').length - 1];
        var video = '<div class="ratio-1-78"><iframe src="https://player.vimeo.com/video/' + id + '?color=ec1818&title=0&byline=0&portrait=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>';
        $(this).replaceWith(video);
    });
    $('img[alt="RXLAB_VIDEO"]').each(function() {
        // Generate ID
        const id = 'plyr' + Date.now();
        var source = $(this).attr('src');
        var video = [
            '<div class="video-plyr">',
            '<video id="' + id + '" controls>',
            '<source src="' + source + '" type="video/mp4" />',
            '</video>',
            '</div>',
            '<script>',
            'const evplayerplyr'+ id + ' = new Plyr(document.getElementById("' + id + '"));',
            'evplayerplyr'+ id + '.ratio = "16:9";',
            'evplayerplyr'+ id + '.iconUrl = "https://rxlaboratory.org/wp-content/plugins/easy-video-player/lib/plyr.svg";',
            'evplayerplyr'+ id + '.blankVideo = "https://rxlaboratory.org/wp-content/plugins/easy-video-player/lib/blank.mp4";',
            '</script>'
        ].join('\n');
        $(this).replaceWith(video);
    });
});
