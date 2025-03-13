(function () {

    #include "../src/inc/api_all.jsx"

    DuAEF.init("Duik", "0.0.0", "RxLaboratory");
    DuAEF.enterRunTime();

    // Functions

    /**
     * 
     * @param {string} path 
     * @return {frames[]}
     */
    function parseTRFFile(path) {
        var trfFile = new File(path);

        //open and parse file
        if (!trfFile.open('r')) return [];

        if (getVSVersion(trfFile.readln()) < 1) {
            alert("Sorry, version is too old or unknown.");
            return [];
        }

        var numFrames = 0;
        var frames = {};
        frames.frames = [];
        frames.size = [0, 0];
        frames.center = [0, 0];

        while (!trfFile.eof) {

            var line = trfFile.readln();

            // Ignore comments
            if (line[0] == "#") continue;
            if (line.substring(0, 5) != "Frame") {
                alert("Invalid or corrupt file, sorry");
                break;
            }

            var frame = parseVSFrame(line);
            frames.frames.push(frame);

            if (frame.fields.size[0] > frames.size[0])
                frames.size[0] = frame.fields.size[0];
            if (frame.fields.size[1] > frames.size[1])
                frames.size[1] = frame.fields.size[1];

            numFrames++;
        }

        frames.center = [
            frames.size[0] / 2,
            frames.size[1] / 2
        ];

        // Compute the angles
        for (var i = 0; i < numFrames; i++) {
            var frame = frames.frames[i];
            var a = 0;
            var s = 0;
            var numFields = frame.fields.motionData.length;
            for (var j = 0; j < numFields; j++) {
                var field = frame.fields.motionData[j];
                var angle = calcVSFieldAngle(field, frames.center) * field.match;
                if (angle === null) continue;
                a += angle;
                s += field.match;
            }
            if (s > 0)
                frame.angle = a / s;
        }

        trfFile.close();

        return frames;
    }

    /**
     * 
     * @param {string} str 
     * @returns {int}
     */
    function getVSVersion(str) {
        if (str.substring(0, 8) != "VID.STAB") return -1;
        var arr = str.split(" ");
        if (arr.length != 2) return 0;
        return parseInt(arr[1]);
    }

    /**
     * 
     * @param {string} str 
     * @returns {Object} frame object with:
     * - {int} number
     * - {fields[]} fields
     */
    function parseVSFrame(str) {
        var frame = {};

        frame.number = -1;
        frame.fields = [];
        frame.maxDist = [0, 0];
        frame.angle = 0;
        frame.vector = [0, 0];

        var fieldsBegin = str.indexOf("(") + 1;

        // Get the frame number
        frame.number = parseInt(str.substring(6, fieldsBegin - 2));
        if (isNaN(frame.number) || frame.number < 0) {
            frame.number = -1;
            return frame;
        }

        var fieldsEnd = str.lastIndexOf(")");
        frame.fields = parseVSFields(str.substring(fieldsBegin, fieldsEnd));
        frame.vector = frame.fields.vector;

        return frame;
    }

    /**
     * 
     * @param {string} str
     * @return {Object[]} field objects:
     * - {int[]} vector
     * - {int[]} position
     * - {int} size
     * - {float} contrast
     * - {float} match
     */
    function parseVSFields(str) {
        var fields = {}
        fields.motionData = [];
        fields.size = [0, 0];
        fields.center = [0, 0];
        fields.vector = [0, 0];

        var x = 0;
        var y = 0;
        var s = 0;

        var fieldsBegin = str.indexOf("[") + 1;
        var fieldsEnd = str.lastIndexOf("]");
        var fieldsStr = str.substring(fieldsBegin, fieldsEnd);
        var fieldsArr = fieldsStr.split(",");
        var numFields = fieldsArr.length;
        for (var i = 0; i < numFields; i++) {
            var field = parseVSField(fieldsArr[i])

            x += field.vector[0] * field.match;
            y += field.vector[1] * field.match;
            s += field.match;

            fields.motionData.push(field);
            if (field.position[0] > fields.size[0])
                fields.size[0] = field.position[0];
            if (field.position[1] > fields.size[1])
                fields.size[1] = field.position[1];
        }

        if (s > 0)
            fields.vector = [
                x / s,
                y / s
            ];

        fields.center = [
            fields.size[0] / 2,
            fields.size[1] / 2
        ]
        return fields;
    }

    /**
     * 
     * @param {string} str
     * @return {Object} field
     */
    function parseVSField(str) {
        var field = {};
        field.vector = [0, 0];
        field.position = [-1, -1];
        field.size = 0;
        field.contrast = 0;
        field.match = 0;

        var fieldBegin = str.indexOf("(") + 1;
        var fieldEnd = str.indexOf(")");
        var fieldStr = str.substring(fieldBegin, fieldEnd);
        var fieldArr = fieldStr.split(" ");
        if (fieldArr[0] != "LM") return field;
        if (fieldArr.length != 8) return field;

        var vx = parseInt(fieldArr[1]);
        var vy = parseInt(fieldArr[2]);
        var fx = parseInt(fieldArr[3]);
        var fy = parseInt(fieldArr[4]);
        var size = parseInt(fieldArr[5]);
        var contrast = parseFloat(fieldArr[6]);
        var match = parseFloat(fieldArr[7]);

        if (!isNaN(vx) && !isNaN(vy))
            field.vector = [vx, vy];
        if (!isNaN(fx) && !isNaN(fy))
            field.position = [fx, fy];
        if (!isNaN(size))
            field.size = size;
        if (!isNaN(contrast))
            field.contrast = contrast;
        if (!isNaN(match))
            field.match = match;

        return field;
    }

    function calcVSFieldAngle(field, center) {
        var px = field.position[0];
        var py = field.position[1];
        var cx = center[0];
        var cy = center[1];
        var vx = field.vector[0];
        var vy = field.vector[1];
        // we better ignore fields that are to close to the rotation center
        if (Math.abs(px - cx) + Math.abs(py - cy) < field.size * 2) {
            return null;
        } else {
            var a1 = Math.atan2(py - cy, px - cx);
            var a2 = Math.atan2(py - cy + vy, px - cx + vx);
            var diff = a2 - a1;
            if (diff > Math.PI)
                return diff - 2 * Math.PI
            else if (diff < -Math.PI)
                return diff + 2 * Math.PI
            else
                return diff;
        }
    }

    function vsFramesToAEKeyframes(frames, layer) {
        var posvalues = [];
        var rotvalues = [];
        var times = [];

        var comp = layer.containingComp;
        var frameDuration = comp.frameDuration;
        var origin = layer.transform.position.value;
        var angle = layer.transform.rotation.value;

        var scale = comp.width / frames.size[0];

        var numFrames = frames.frames.length;
        for (var i = 0; i < numFrames; i++) {
            var frame = frames.frames[i];
            posvalues.push(frame.vector * scale + origin);
            rotvalues.push(frame.angle * 180 / Math.PI + angle);
            times.push((frame.number - 1) * frameDuration);
        }

        layer.transform.position.setValuesAtTimes(times, posvalues);
        layer.transform.rotation.setValuesAtTimes(times, rotvalues);
    }

    var comp = DuAEProject.getActiveComp();
    if (!comp) {
        alert("Please select a composition");
        return;
    }

    var thisPath = File($.fileName).parent.absoluteURI;
    var frames = parseTRFFile(thisPath + "/test.trf");

    var nullLayer = DuAEComp.addNull(comp);
    vsFramesToAEKeyframes(frames, nullLayer);
})();