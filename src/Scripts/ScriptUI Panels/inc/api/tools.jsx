/**
 * Miscellaneous tools
 * @namespace
 * @category Duik
 */
Duik.Tool = {};

/**
 * The list of expressions currently being edited
 * Associative array filename -> DuAEProperty.
 * @type {object}
*/
if (typeof $.global["DUIK_DATA"].editingExpressions === 'undefined') $.global["DUIK_DATA"].editingExpressions = {};

/**
 * The list of tool functions
 * @namespace
 */
Duik.CmdLib["Tool"] = {};

Duik.CmdLib["Tool"]["Crop Precompositions"] = 'Duik.Tool.cropPrecompositions()';
/**
 * Crops the precompositions without moving them, using the bounds of their masks
 * @param {AVLayer[]|LayerCollection|DuList|AVLayer} [precomps] The precompositions to crop. The selected layers by default.
 */
Duik.Tool.cropPrecompositions = function(precomps) {
    precomps = def(precomps, DuAEComp.getSelectedLayers());
    precomps = new DuList(precomps);

    // Util to update masks
    function adjustPoint( point, ratio, bounds )
    {
        bounds = def(bounds, [0,0,0,0]);
        var x = point[0] / ratio[0] - bounds[1];
        var y = point[1] / ratio[1] - bounds[0];
        return [x, y];
    }

    DuAE.beginUndoGroup( i18n._("Crop precompositions"), false);
    DuAEProject.setProgressMode(true);

    // Keep a list of comps already cropped to prevent multiple crops
    var ids = new DuList();

    precomps.do(function(layer) {
        if (!DuAELayer.isComp(layer)) return;

        // Get comp
        var comp = layer.source;
        var id = comp.id;

        // Already done
        if (ids.contains(id)) return;

        // Get mask bounds
        var bounds = DuAELayer.sourceRect(layer);

        // We need the ratio to be able to reset masks
        var xRatio = bounds[2] / comp.width;
        var yRatio = bounds[3] / comp.height;
        var ratio = [xRatio, yRatio];

        // Resize source comp
        DuAEComp.crop(bounds, comp);

        // Move anchor points and masks for all layers using this comp
        var usedIn = comp.usedIn;
        for (var i = 0, n = usedIn.length; i < n; i++) {
            // Get layers using this comp
            var containingComp = usedIn[i];
            for (var l = 1, nl = containingComp.numLayers; l <= nl; l++) {
                var precompLayer = containingComp.layer(l);
                // Not a precomp
                if (!DuAELayer.isComp(precompLayer)) continue;
                // Not the same comp
                if (precompLayer.source.id != id) continue;

                // Adjust anchor point
                var ap = adjustPoint( precompLayer.transform.anchorPoint.value, ratio, bounds);
                precompLayer.transform.anchorPoint.setValue(ap);

                // Adjust Masks - Revert what Ae does, and offset like the anchor point
                var masks = DuAEProperty.getProps(precompLayer.property('ADBE Mask Parade'), 'ADBE Mask Shape');
                for (var m = 0, nm = masks.length; m < nm; m++) {
                    var shapeProp = masks[m].getProperty();
                    var shape = shapeProp.value;
                    var vertices = shape.vertices;
                    var inTs = shape.inTangents;
                    var outTs = shape.outTangents;
                    for (var v = 0, nv = vertices.length; v < nv; v++) {
                        vertices[v] = adjustPoint( vertices[v], ratio, bounds);
                        inTs[v] = adjustPoint( inTs[v], ratio);
                        outTs[v] = adjustPoint( outTs[v], ratio);
                    }
                    shape.vertices = vertices;
                    shape.inTangents = inTs;
                    shape.outTangents = outTs;
                    shapeProp.setValue(shape);
                }
            }
        }

        ids.push(id);
    });

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Crop precompositions"));
}

Duik.CmdLib["Tool"]["Edit Expression"] = 'Duik.Tool.editExpression()';
/**
 * Edits the selected expression using an external editor
 * @param {Property|DuAEProperty} [prop] The propety containing the expression. The first selected property if omited.
 * @return {File} The file used to edit the expression.
 */
Duik.Tool.editExpression = function (prop) {
    prop = def(prop, DuAEComp.getSelectedProperty());
    if (!prop) return null;

    prop = new DuAEProperty(prop);

    // Get a temp file
    // Locate it in the Duik folder
    var expressionPath = DuESF.scriptSettings.file.parent.absoluteURI;
    expressionPath += '/expressions/';
    // Create if it doesn't exist
    var expressionFolder = new Folder(expressionPath);
    if (!expressionFolder.exists) expressionFolder.create();
    // Create the file
    var expName = DuPath.fixName( prop.layer.name + ' - ' + prop.name + ' - ' + prop.id );
    var expressionFile = new File(expressionPath + expName + '.jsx');
    if (expressionFile.open('w')) {
        expressionFile.write(prop.expression());
        expressionFile.close();
    }
    else return null;
    // Open
    var editorPath = DuESF.scriptSettings.get("expression/expressionEditor", "");
    var editorFile = new File(editorPath);
    if (editorFile.exists) DuProcess.run(editorPath, [expressionFile.fsName], true);
    else expressionFile.execute();

    $.global["DUIK_DATA"].editingExpressions[expressionFile.absoluteURI] = prop;

    return expressionFile;
}

/**
 * Reloads all expression edited with an external editor (using {@link Duik.Tool.editExpression})
 */
Duik.Tool.reloadExpressions = function() {
    DuAE.beginUndoGroup( i18n._("Edit expression"), false);

    for (var f in $.global["DUIK_DATA"].editingExpressions) {
        if (!$.global["DUIK_DATA"].editingExpressions.hasOwnProperty(f)) continue;
        var file = new File(f);
        if (file.exists) {
            if (file.open('r')){
                $.global["DUIK_DATA"].editingExpressions[f].setExpression(file.read(), false);
                file.close();
            }
        }
        else {
            delete editingExpressions[f];
        }
    };

    DuAE.endUndoGroup( i18n._("Edit expression"));
}
