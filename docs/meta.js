// Load Meta block in the Docs
$(document).ready(function () {
    //META
    $('img[alt="META"]').each(function () {
        //get meta
        var metas = $(this).attr('src').split(";");
        var metaBlock = '<div class="post-meta"><div class="meta-wrapper"><ul>';
        var copyright = "";
        var authors = "";
        var authorsList = "";
        var medias = "";
        var mediasList = "";
        var license = "";
        var updated = "";
        for (var i = 0, n = metas.length; i < n; i++)
        {
            var meta = metas[i].split(":");
            var key = meta[0];
            var val = meta[1];
            if (key == "authors")
            {
                authors += "<li><strong>Authors</strong>: " + val + "</li>";
                authorsList += val;
            }
            else if (key == "medias")
            {
                medias += "<li><strong>Images & Medias</strong>: " + val + "</li>";
                mediasList = val;
            }
            else if (key == "copyright")
            {
                copyright += "<li>This page content (text and media):<br /><strong>Copyright © " + val + " RxLaboratory</strong>";
            }
            else if (key == "license")
            {
                license += "<li><i>Licensed under the ";
                if (val == "CC-BY")
                {
                    license += '<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">Creative Commons Attribution 4.0 International (CC BY 4.0)</a></strong>';
                }
                else if (val == "CC-BY-SA")
                {
                    license += '<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank">Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)</a></strong>';
                }
                else if (val == "CC-BY-ND")
                {
                    license += '<a href="https://creativecommons.org/licenses/by-nd/4.0/" target="_blank">Creative Commons Attribution-NoDerivs 4.0 International (CC BY-ND 4.0)</a></strong>';
                }
                else if (val == "CC-BY-NC")
                {
                    license += '<a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank">Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)</a></strong>';
                }
                else if (val == "CC-BY-NC-SA")
                {
                    license += '<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)</a></strong>';
                }
                else if (val == "CC-BY-NC-ND")
                {
                    license += '<a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank">Creative Commons Attribution-NonCommercial-NoDerivs 4.0 International (CC BY-NC-ND 4.0)</a></strong>';
                }
                else if (val == "GNU-FDL")
                {
                    license += '<a href="https://www.gnu.org/licenses/fdl-1.3.html" target="_blank">GNU Free Documentation</a></strong>';
                }
                license += " license.</i></li>";
            }
            else if (key == "updated")
            {
                updated += "<li><i>Latest update: " + val + "</i></li>";
            }
        }

        if (authors != "") metaBlock += authors;
        if (medias != "") metaBlock += medias;
        if (copyright != "")
        {
            metaBlock += copyright;
            if (authorsList != "")
            {
                metaBlock += ",<br/>" + authorsList;
                if (mediasList != "") metaBlock += ", ";
            }
            if (mediasList != "") metaBlock += mediasList;
            metaBlock += "</li>";
        }
        if (license != "") metaBlock += license;
        if (updated != "") metaBlock += updated;

        metaBlock += "</ul></dev></div>";

        $('.footer-meta').replaceWith(metaBlock);

        this.style.display = "none";
    });
});
