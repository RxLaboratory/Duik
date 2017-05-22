/*
Options
layers with audio active only or all layers with audio
copy audio files to export folder? (conformed files always automatically copied to Conformed Files folder)
choose sampling and bit depth
default master: mono/stereo/5.1
open audition after or not
*/

(function ()
{
    /**
     * Gets all the layers with audio in the collection
     * @param {LayerCollection}     layers              An Array or LayerCollection where the audio will be searched
     * @param {bool}                audioActiveOnly     If true, does not get muted layers. Default: false
     * @return {Array}              An array of AVLayer containing the audio layers
     */
    function getAudioLayers(layers,audioActiveOnly)
    {
        var audioLayers = [];
        for (var i = 0;i < layers.length ; i++)
        {
            if (audioActiveOnly == undefined) audioActiveOnly = false;

            var layer = layers[i];
            if (layer.hasAudio)
            {
                if (audioActiveOnly && layer.audioEnabled || !audioActiveOnly)
                {
                    audioLayers.push(layer);
                }
            }
        }
        return audioLayers;
    }

    /**
     * Creates an XML master track for an Audition session
     * @param {string}  name    The track name
     * @param {int}     id      A unique id for this track
     * @param {int}     index   The index of the track
     * @return {XML}    The track
     */
    function createMasterTrack(name,id,index)
    {
        var xmlString = '<masterTrack automationLaneOpenState="false" id="' + id + '" index="' + index + '" select="false" visible="true">' +
            '<trackParameters trackHeight="134" trackHue="-1" trackMinimized="false">' +
            '<name>' + name + '</name>' +
            '</trackParameters>' +
            '<trackAudioParameters audioChannelType="stereo" automationMode="1" monitoring="false" recordArmed="false" solo="false" soloSafe="true">' +
            '<trackOutput outputID="1" type="hardwareOutput"/>' +
            '<trackInput inputID="-1"/>' +
            '</trackAudioParameters>' +
            '<editParameter parameterIndex="0" slotIndex="4294967280"/>' +
            '</masterTrack>';
        var trackx = new XML(xmlString);
        return trackx;
    }

    /**
     * Creates an XML track for an Audition session
     * @param {string}  name    The track name
     * @param {int}     id      A unique id for this track
     * @param {int}     index   The index of the track
     * @return {XML}    The track
     */
    function createTrack(name,id,index)
    {
        var xmlString = '<audioTrack automationLaneOpenState="false" id="' + id + '" index="' + index + '" select="true" visible="true">' +
            '<trackParameters trackHeight="134" trackHue="-1" trackMinimized="false">' +
            '<name>' + name + '</name>' +
            '</trackParameters>' +
            '<trackAudioParameters audioChannelType="stereo" automationMode="1" monitoring="false" recordArmed="false" solo="false" soloSafe="false">' +
            '<trackOutput outputID="10000" type="trackID"/>' +
            '<trackInput inputID="1"/>' +
            '</trackAudioParameters>' +
            '</audioTrack>';
        var trackx = new XML(xmlString);
        return trackx;
    }

    /**
     * Creates an XML clip for an Audition session
     * @param {File}    file                The audio file
     * @param {int}     id                  A unique id for this clip
     * @param {float}   sourceInPoint       The audio source in point
     * @param {float}   sourceOutPoint      The audio source out point
     * @param {float}   startPoint          The clip start point in the track
     * @param {float}   endPoint            The clip end point in the track
     * @return {Array}  An array with two XML objects : the clip and the file [clipx,filex]
     */
    function createClip(file,id,sourceInPoint,sourceOutPoint,startPoint,endPoint)
    {
        var name = file.name.substring(0,file.name.lastIndexOf('.'));
        var xmlString = '<audioClip clipAutoCrossfade="true" crossFadeHeadClipID="-1" crossFadeTailClipID="-1" endPoint="' + endPoint + '" fileID="' + id + '" hue="-1" id="' + id + '" lockedInTime="false" looped="false" name="' + name + '" offline="false" select="false" sourceInPoint="' + sourceInPoint + '" sourceOutPoint="' + sourceOutPoint + '" startPoint="' + startPoint + '" zOrder="0">' +
            '<fadeIn crossFadeLinkType="linkedAsymmetric" endPoint="0" shape="0" startPoint="0" type="cosine"/>' +
            '<fadeOut crossFadeLinkType="linkedAsymmetric" endPoint="720000" shape="0" startPoint="720000" type="cosine"/>' +
            '<channelMap>' +
            '<channel index="0" sourceIndex="0"/>' +
            '<channel index="1" sourceIndex="1"/>' +
            '</channelMap>' +
            '</audioClip>';
        var clipx = new XML(xmlString);

        xmlString = '<file absolutePath="' + file.fsName + '" id="' + id + '" mediaHandler="AmioWav"/>';
        var filex = new XML(xmlString);

        return [clipx,filex];
    }

    //Options
    var comp = app.project.activeItem;
    var layers = comp.selectedLayers;
    var sampling = 48000;
    var bits = 32;
    var master = 'stereo';
    var execute = true;
    var saveFile = new File('E:/DEV SRC/Duik/Tests/IO/Audition/export_test.sesx');

    //get all layers with audio
    var audioLayers = getAudioLayers(layers,false);

    //build xml
    var xmlString = '<sesx version="1.4">' +
        '<session appBuild="10.1.0.174" appVersion="10.1" audioChannelType="' + master + '" bitDepth="' + bits + '" duration="' + (comp.duration * sampling) + '" sampleRate="' + sampling + '">' +
        '<name>Test Multitrack CC2017.sesx</name>' +
        '<tracks/>' +
        '<sessionState ctiPosition="0" smpteStart="0">' +
        '<selectionState selectionDuration="0" selectionStart="0"/>' +
        '<viewState horizontalViewDuration="0" horizontalViewStart="0" trackControlsWidth="0" verticalScrollOffset="0"/>' +
        '<timeFormatState beatsPerBar="4" beatsPerMinute="120" customFrameRate="12" linkToDefaultTimeSettings="true" noteLength="4" subdivisions="16" timeCodeDropFrame="false" timeCodeFrameRate="30" timeCodeNTSC="false" timeFormat="timeFormatDecimal"/>' +
        '<mixingOptionState defaultPanModeLogarithmic="false" panPower="-3"/>' +
        '</sessionState>' +
        '<clipGroups/>' +
        '<properties/>' +
        '</session>' +
        '<files/>' +
        '</sesx>';
    var sesx = new XML(xmlString);

    var lastIndex = 0;
    //add clips to xml
    for (i = 0 ; i < audioLayers.length ; i++)
    {
        var layer = audioLayers[i];
        var index = layer.index;
        if (index > lastIndex) lastIndex = index;
        //create a new track
        var trackx = createTrack('Track ' + (i+1),10001+i,index);
        //add the clip
        var clipFile = layer.source.mainSource.file;
        //gets cue points
        var startPoint = layer.inPoint*sampling;
        var endPoint = layer.outPoint*sampling;
        var sourceInPoint = layer.startTime*sampling;
        var sourceOutPoint = (layer.startTime + layer.source.duration)*sampling;

        var clipx = createClip(clipFile,i,sourceInPoint,sourceOutPoint,startPoint,endPoint);

        //add track and clipFile
        trackx = trackx.appendChild(clipx[0]);
        sesx.session.tracks = sesx.session.tracks.appendChild(trackx);
        sesx.files.appendChild(clipx[1]);
    }

    //add the master track
    var masterTrackx = createMasterTrack('Main',10000,lastIndex+1);
    sesx.session.tracks = sesx.session.tracks.appendChild(masterTrackx);


    //to string with header and doctype
    XML.prettyPrinting = true;
    var xml = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n<!DOCTYPE sesx>\n' + XML(sesx).toString();

    //save file
    saveFile.open('w');
    saveFile.write(xml);
    saveFile.close();


})();
