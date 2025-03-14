// Controller icons
#include "ctrl_icons.jsx"

/**
 * Controller related tools.
 * @namespace
 * @category Duik
 */
Duik.Controller = {};

/**
 * The shapes/type/icon of the controllers
 * @enum {Number}
 * @readonly
 * @ts-ignore */
Duik.Controller.Type = {
    ROTATION: 1,
    X_POSITION: 2,
    Y_POSITION: 3,
    POSITION: 4,
    TRANSFORM: 5,
    SLIDER: 6,
    DOUBLE_SLIDER: 7,
    ANGLE: 8,
    CAMERA: 9,
    HEAD: 10,
    HAND: 11,
    FOOT: 12,
    CLAWS: 13,
    HOOF: 14,
    EYE: 15,
    EYES: 16,
    FACE: 17,
    SQUARE: 18,
    HIPS: 19,
    BODY: 20,
    SHOULDERS: 21,
    TAIL: 22,
    PENIS: 23,
    VULVA: 24,
    WALK_CYCLE: 25,
    BLENDER: 26,
    NULL: 27,
    CONNECTOR: 28,
    EXPOSE_TRANSFORM: 29,
    EAR: 30,
    HAIR: 31,
    MOUTH: 32,
    NOSE: 33,
    EYEBROW: 34,
    PONEYTAIL: 35,
    PINCER: 36,
    WING: 37,
    FIN: 38,
    AUDIO: 39,
    VERTEBRAE: 40,
    TORSO: 41,
    AE_NULL: 42
}

/**
 * The pre-rigged pseudo effects
 * @enum {File}
 * @readonly
 * @ts-ignore */
Duik.Controller.PseudoEffect = {
    EYES: preset_eyes.toFile(),
    FINGERS: preset_fingers.toFile(),
    HAND: preset_hand.toFile(),
    HEAD: preset_head.toFile()
}

/**
 * The type of layers to use for controllers
 * @enum {Number}
 * @readonly
 * @ts-ignore */
Duik.Controller.LayerMode = {
    NULL: 0,
    SHAPE: 1,
    DRAFT_SHAPE: 2,
    RASTER: 3
};

/**
    * Some (localized) controller names
    * @enum {string[]}
*/
Duik.Controller.Name = {};

/**
    * The PNG files to be used as raster controllers
    * @enum {DuBinary}
    */
Duik.Controller.RasterIconFile = {};

Duik.Controller.aeInit = function() {
    Duik.Controller.Name[Duik.Controller.Type.ROTATION] = [
        i18n._p("controller_shape", "rotation"),
        i18n._p("controller_shape", "orientation")
        ];
    Duik.Controller.Name[Duik.Controller.Type.X_POSITION] = [
        i18n._p("controller_shape", "x position"),
        i18n._p("controller_shape", "x pos"), /// TRANSLATORS: "pos" as in Position
        i18n._p("controller_shape", "h position"), /// TRANSLATORS: "h" as in Horizontal
        i18n._p("controller_shape", "h pos"), /// TRANSLATORS: "pos" as in Position
        i18n._p("controller_shape", "horizontal position"),
        i18n._p("controller_shape", "horizontal"),
        i18n._p("controller_shape", "x location"),
        i18n._p("controller_shape", "x loc"), /// TRANSLATORS: "loc" as in Location
        i18n._p("controller_shape", "h location"), /// TRANSLATORS: "h" as in Horizontal
        i18n._p("controller_shape", "h loc"), /// TRANSLATORS: "loc" as in Location
        i18n._p("controller_shape", "horizontal location"),
        ];
    Duik.Controller.Name[Duik.Controller.Type.Y_POSITION] = [
        i18n._p("controller_shape", "y position"),
        i18n._p("controller_shape", "y pos"), /// TRANSLATORS: "pos" as in Position
        i18n._p("controller_shape", "v position"), /// TRANSLATORS: "v" as in Vertical
        i18n._p("controller_shape", "v pos"), /// TRANSLATORS: "pos" as in Position
        i18n._p("controller_shape", "vertical position"),
        i18n._p("controller_shape", "vertical"),
        i18n._p("controller_shape", "y location"),
        i18n._p("controller_shape", "y loc"), /// TRANSLATORS: "loc" as in Location
        i18n._p("controller_shape", "v location"), /// TRANSLATORS: "v" as in Vertical
        i18n._p("controller_shape", "v loc"), /// TRANSLATORS: "loc" as in Location
        i18n._p("controller_shape", "vertical location"),
        ];
    Duik.Controller.Name[Duik.Controller.Type.POSITION] = [
        i18n._p("controller_shape", "position"),
        i18n._p("controller_shape", "location"),
        i18n._p("controller_shape", "pos"), /// TRANSLATORS: "pos" as in Position
        i18n._p("controller_shape", "loc") /// TRANSLATORS: "loc" as in Location
        ];
    Duik.Controller.Name[Duik.Controller.Type.TRANSFORM] = [
        i18n._p("controller_shape", "transform"),
        i18n._p("controller_shape", "prs") /// TRANSLATORS: short for Position Rotation Scale
        ];
    Duik.Controller.Name[Duik.Controller.Type.SLIDER] = [
        i18n._p("controller_shape", "slider")
        ];
    Duik.Controller.Name[Duik.Controller.Type.DOUBLE_SLIDER] = [
        i18n._p("controller_shape", "2d slider"),
        i18n._p("controller_shape", "joystick")
        ];
    Duik.Controller.Name[Duik.Controller.Type.ANGLE] = [
        i18n._p("controller_shape", "angle")
        ];
    Duik.Controller.Name[Duik.Controller.Type.CAMERA] = [
        i18n._p("controller_shape", "camera"),
        i18n._p("controller_shape", "cam") /// TRANSLATORS: short for Camera
        ];
    Duik.Controller.Name[Duik.Controller.Type.HEAD] = [
        i18n._p("controller_shape", "head"),
        i18n._p("controller_shape", "skull")
        ];
    Duik.Controller.Name[Duik.Controller.Type.HAND] = [
        i18n._p("controller_shape", "hand"),
        i18n._p("controller_shape", "carpus")
        ];
    Duik.Controller.Name[Duik.Controller.Type.FOOT] = [
        i18n._p("controller_shape", "foot"),
        i18n._p("controller_shape", "tarsus")
        ];
    Duik.Controller.Name[Duik.Controller.Type.CLAWS] = [
        i18n._p("controller_shape", "claws"),
        i18n._p("controller_shape", "claw")
        ];
    Duik.Controller.Name[Duik.Controller.Type.HOOF] = [
        i18n._p("controller_shape", "hoof")
        ];
    Duik.Controller.Name[Duik.Controller.Type.EYE] = [
        i18n._p("controller_shape", "eye")
        ];
    Duik.Controller.Name[Duik.Controller.Type.EYES] = [
        i18n._p("controller_shape", "eyes")
        ];
    Duik.Controller.Name[Duik.Controller.Type.FACE] = [
        i18n._p("controller_shape", "face")
        ];
    Duik.Controller.Name[Duik.Controller.Type.SQUARE] = [
        i18n._p("controller_shape", "square")
        ];
    Duik.Controller.Name[Duik.Controller.Type.HIPS] = [
        i18n._p("controller_shape", "hips"),
        i18n._p("controller_shape", "hip")
        ];
    Duik.Controller.Name[Duik.Controller.Type.BODY] = [
        i18n._p("controller_shape", "body")
        ];
    Duik.Controller.Name[Duik.Controller.Type.SHOULDERS] = [
        i18n._p("controller_shape", "shoulders"),
        i18n._p("controller_shape", "neck")
        ];
    Duik.Controller.Name[Duik.Controller.Type.TAIL] = [
        i18n._p("controller_shape", "tail")
        ];
    Duik.Controller.Name[Duik.Controller.Type.PENIS] = [
        i18n._p("controller_shape", "penis")
        ];
    Duik.Controller.Name[Duik.Controller.Type.VULVA] = [
        i18n._p("controller_shape", "vulva")
        ];
    Duik.Controller.Name[Duik.Controller.Type.WALK_CYCLE] = [
        i18n._p("controller_shape", "walk cycle"),
        i18n._p("controller_shape", "run cycle"),
        i18n._p("controller_shape", "animation cycle"),
        i18n._p("controller_shape", "cycle")
        ];
    Duik.Controller.Name[Duik.Controller.Type.BLENDER] = [
        i18n._p("controller_shape", "blender"),
        i18n._p("controller_shape", "animation blender")
        ];
    Duik.Controller.Name[Duik.Controller.Type.NULL] = [
        i18n._p("controller_shape", "null"),
        i18n._p("controller_shape", "empty")
        ];
    Duik.Controller.Name[Duik.Controller.Type.CONNECTOR] = [
        i18n._p("controller_shape", "connector"),
        i18n._p("controller_shape", "connection"),
        i18n._p("controller_shape", "connect")
        ];
    Duik.Controller.Name[Duik.Controller.Type.EXPOSE_TRANSFORM] = [
        i18n._p("controller_shape", "etm"), /// TRANSLATORS: short for "Expose Trasnform"
        i18n._p("controller_shape", "expose transform")
        ];
    Duik.Controller.Name[Duik.Controller.Type.EAR] = [
        i18n._p("controller_shape", "ear")
        ];
    Duik.Controller.Name[Duik.Controller.Type.HAIR] = [
        i18n._p("controller_shape", "hair"),
        i18n._p("controller_shape", "strand"),
        i18n._p("controller_shape", "hair strand")
        ];
    Duik.Controller.Name[Duik.Controller.Type.MOUTH] = [
        i18n._p("controller_shape", "mouth")
        ];
    Duik.Controller.Name[Duik.Controller.Type.NOSE] = [
        i18n._p("controller_shape", "nose")
        ];
    Duik.Controller.Name[Duik.Controller.Type.EYEBROW] = [
        i18n._p("controller_shape", "brow"),
        i18n._p("controller_shape", "eyebrow"),
        i18n._p("controller_shape", "eye brow")
        ];
    Duik.Controller.Name[Duik.Controller.Type.PONEYTAIL] = [
        i18n._p("controller_shape", "poney tail"),
        i18n._p("controller_shape", "poneytail")
        ];
    Duik.Controller.Name[Duik.Controller.Type.PINCER] = [
        i18n._p("controller_shape", "pincer")
        ];
    Duik.Controller.Name[Duik.Controller.Type.WING] = [
        i18n._p("controller_shape", "wing")
        ];
    Duik.Controller.Name[Duik.Controller.Type.FIN] = [
        i18n._p("controller_shape", "fin"),
        i18n._p("controller_shape", "fishbone"),
        i18n._p("controller_shape", "fish bone")
        ];
    Duik.Controller.Name[Duik.Controller.Type.AUDIO] = [
        i18n._p("controller_shape", "audio"),
        i18n._p("controller_shape", "sound")
        ];
    Duik.Controller.Name[Duik.Controller.Type.VERTEBRAE] = [
        i18n._p("controller_shape", "vertebrae"),
        i18n._p("controller_shape", "spine")
        ];
    Duik.Controller.Name[Duik.Controller.Type.TORSO] = [
        i18n._p("controller_shape", "torso"),
        i18n._p("controller_shape", "lungs"),
        i18n._p("controller_shape", "chest"),
        i18n._p("controller_shape", "ribs"),
        i18n._p("controller_shape", "rib")
        ];

    Duik.Controller.RasterIconFile[Duik.Controller.Type.ROTATION] = w50_rotate;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.X_POSITION] = w50_move_h;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.Y_POSITION] = w50_move_v;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.POSITION] = w50_move;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.TRANSFORM] = w50_move_rotate;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.SLIDER] = w50_slider;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.DOUBLE_SLIDER] = w50_2d_slider;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.ANGLE] = w50_angle;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.CAMERA] = w50_camera;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.HEAD] = w50_head;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.HAND] = w50_controller;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.FOOT] = w50_foot;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.CLAWS] = w50_digitigrade;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.HOOF] = w50_ungulate;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.EYE] = w50_eye;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.EYES] = w50_eye;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.FACE] = w50_head;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.SQUARE] = w50_move;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.HIPS] = w50_hips;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.BODY] = w50_body;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.SHOULDERS] = w50_shoulders;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.TAIL] = w50_tail_ctrl;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.WALK_CYCLE] = w50_walk_cycle;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.BLENDER] = w50_move_rotate;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.CONNECTOR] = w50_connector;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.EXPOSE_TRANSFORM] = w50_expose_transform;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.EAR] = w50_ear;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.HAIR] = w50_hair;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.MOUTH] = w50_mouth;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.NOSE] = w50_nose;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.EYEBROW] = w50_eyebrow;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.PONEYTAIL] = w50_hair_strand;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.PINCER] = w50_arthropod;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.WING] = w50_wing;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.FIN] = w50_fin;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.AUDIO] = w50_audio;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.VERTEBRAE] = w50_vertebrae;
    Duik.Controller.RasterIconFile[Duik.Controller.Type.TORSO] = w50_torso;
}
DuESF.initMethods.push(Duik.Controller.aeInit);

/**
 * The list of controller functions
 * @namespace
 */
Duik.CmdLib[ 'Controller' ] = {};
Duik.CmdLib[ 'Controller' ][ "Rotation" ] = "Duik.Controller.fromLayers( Duik.Controller.Type.ROTATION )";
Duik.CmdLib[ 'Controller' ][ "X Position" ] = "Duik.Controller.fromLayers( Duik.Controller.Type.X_POSITION )";
Duik.CmdLib[ 'Controller' ][ "Y Position" ] = "Duik.Controller.fromLayers( Duik.Controller.Type.Y_POSITION )";
Duik.CmdLib[ 'Controller' ][ "Position" ] = "Duik.Controller.fromLayers( Duik.Controller.Type.POSITION )";
Duik.CmdLib[ 'Controller' ][ "Transform" ] = "Duik.Controller.fromLayers( Duik.Controller.Type.TRANSFORM )";
Duik.CmdLib[ 'Controller' ][ "Eye" ] = "Duik.Controller.fromLayers( Duik.Controller.Type.EYE )";
Duik.CmdLib[ 'Controller' ][ "Camera" ] = "Duik.Controller.fromLayers( Duik.Controller.Type.CAMERA )";
Duik.CmdLib[ 'Controller' ][ "Slider" ] = "Duik.Controller.fromLayers( Duik.Controller.Type.SLIDER )";
Duik.CmdLib[ 'Controller' ][ "2D Slider" ] = "Duik.Controller.fromLayers( Duik.Controller.Type.DOUBLE_SLIDER )";
Duik.CmdLib[ 'Controller' ][ "Angle" ] = "Duik.Controller.fromLayers( Duik.Controller.Type.ANGLE )";
Duik.CmdLib[ 'Controller' ][ "Head" ] = "Duik.Controller.fromLayers( Duik.Controller.Type.HEAD )";
Duik.CmdLib[ 'Controller' ][ "Foot" ] = "Duik.Controller.fromLayers( Duik.Controller.Type.FOOT )";
Duik.CmdLib[ 'Controller' ][ "Claws" ] = "Duik.Controller.fromLayers( Duik.Controller.Type.CLAWS )";
Duik.CmdLib[ 'Controller' ][ "Paw" ] = "Duik.Controller.fromLayers( Duik.Controller.Type.CLAWS )";
Duik.CmdLib[ 'Controller' ][ "Hoof" ] = "Duik.Controller.fromLayers( Duik.Controller.Type.HOOF )";
Duik.CmdLib[ 'Controller' ][ "Hand" ] = "Duik.Controller.fromLayers( Duik.Controller.Type.HAND )";
Duik.CmdLib[ 'Controller' ][ "Hips" ] = "Duik.Controller.fromLayers( Duik.Controller.Type.HIPS )";
Duik.CmdLib[ 'Controller' ][ "Spine" ] = "Duik.Controller.fromLayers( Duik.Controller.Type.SPINE )";
Duik.CmdLib[ 'Controller' ][ "Shoulders" ] = "Duik.Controller.fromLayers( Duik.Controller.Type.SHOULDERS )";
Duik.CmdLib[ 'Controller' ][ "Tail" ] = "Duik.Controller.fromLayers( Duik.Controller.Type.TAIL )";
Duik.CmdLib[ 'Controller' ][ "Null" ] = "Duik.Controller.fromLayers( Duik.Controller.Type.NULL )";

/**
 * Creates an controller in the current comp on selected layers.
 * @param {Duik.Controller.Type} [type = Duik.Controller.Type.TRANSFORM] - The type of the controller.
 * @param {boolean} [parent = false] - Whether to parent the selected layers to the controllers or not.
 * @param {boolean} [single = false] - Whether to create a single controller for all the layers or not.
 * @return {ShapeLayer[]} The new controllers.
 */
Duik.Controller.fromLayers = function ( type, parent, single ) {
    type = def( type, Duik.Controller.Type.TRANSFORM );
    parent = def( parent, false );
    single = def( single, false );

    var comp = DuAEProject.getActiveComp();
    if ( !comp ) return null;

    DuAE.beginUndoGroup( i18n._("Create controller"), false );
    DuAEProject.setProgressMode( true );

    var layers = DuAEComp.unselectLayers();
    var ctrls = [];

    if ( layers.length == 0 ) ctrls.push( Duik.Controller.create( comp, type ) );
    else if ( single ) {
        var ctrl = Duik.Controller.create( comp, type, layers, parent );
        ctrls.push( ctrl );
    } else {
        for ( var i = 0, n = layers.length; i < n; i++ ) {
            var ctrl = Duik.Controller.create( comp, type, layers[ i ], parent, parent );
            ctrls.push( ctrl );
        }
    }

    DuAEComp.selectLayers( ctrls );

    DuAEProject.setProgressMode( false );
    DuAE.endUndoGroup(i18n._("Create controller"));

    return ctrls;
}

/**
 * Gets the controllers in the comp
 * @param {Boolean} [selectedOnly=true] Whether to get only the selected layers or all of them
 * @param {CompItem} [comp=DuAEProject.getActiveComp()] The comp
 * @returns {ShapeLayer[]} The controllers
 */
Duik.Controller.get = function ( selectedOnly, comp ) {
    return Duik.Layer.get( Duik.Layer.Type.CONTROLLER, selectedOnly, comp );
}

/**
 * Creates a new controller
 * @param {CompItem} [comp] - The composition
 * @param {Duik.Controller.Type} [type=Duik.Controller.Type.TRANSFORM] - The type of Controller.
 * @param {Layer|Layer[]|LayerCollection} [layer] - The layer(s) where to create the controller.<br />
 * If several layers are provided, will create the controller at the average center of their world positions.
 * @param {boolean} [parent=false] - True to automatically parent the layer(s) to the controller
 * @return {ShapeLayer|AVLayer|null} The controller or null if it couldn't be created.
 */
Duik.Controller.create = function ( comp, type, layer, parent ) {
    if ( typeof comp === 'undefined' ) {
        if ( typeof layer !== 'undefined' ) {
            comp = layer.containingComp;
        } else {
            comp = DuAEProject.getActiveComp();
        }
    }
    if ( !comp ) return null;

    type = def( type, Duik.Controller.Type.TRANSFORM );
    var mode = OCO.config.get('after effects/controller layer type', Duik.Controller.LayerMode.SHAPE);
    layer = def( layer, null );
    parent = def( parent, false );

    // Adjust mode and type
    // Sliders must be shape layers (for now)
    if (type == Duik.Controller.Type.SLIDER || type == Duik.Controller.Type.DOUBLE_SLIDER || type == Duik.Controller.Type.ANGLE) {
        mode = Duik.Controller.LayerMode.SHAPE;
    }
    // If mode is null, type must be AE Null
    else if (mode == Duik.Controller.LayerMode.NULL) {
        type = Duik.Controller.Type.AE_NULL;
    }

    // --- CREATE LAYER ---

    var ctrl;
    if ( type == Duik.Controller.Type.NULL ) {
        ctrl = DuAEComp.addNull();
    }
    else if (type == Duik.Controller.Type.AE_NULL) {
        ctrl = comp.layers.addNull();
        // Center the anchor point
        ctrl.transform.anchorPoint.setValue([50,50]);
        ctrl.transform.position.setValue( [comp.width/2, comp.height/2] );
    }
    else if (mode != Duik.Controller.LayerMode.RASTER) ctrl = comp.layers.addShape();
    else {

        // Check if it's already here
        var folderName = 'Duik::' + i18n._("Controllers");
        var folder = DuAEProject.getItemByName( folderName );
        var count = 1;
        // In case there's an item with the same name which is not the folder
        while (folder && !(folder instanceof FolderItem)) {
            folder.name = folderName + '_' + count;
            count++;
            folder = DuAEProject.getItemByName( folderName );
        }
        if (!folder) folder = app.project.items.addFolder(folderName);

        // Look for the controller
        var ctrlName = type;
        if (Duik.Controller.Name[type] instanceof Array) ctrlName = Duik.Controller.Name[type][0];
        
        var ctrlFootage = DuAEProject.getItemByName( ctrlName, folder );
        
        // Extract and import
        if (!ctrlFootage || ctrlFootage.footageMissing) {
            // Try to get the project path
            var projectFile = app.project.file;
            var path;
            if (projectFile) path = projectFile.parent.absoluteURI;
            else path = DuESF.scriptSettings.file.parent.absoluteURI;

            path += '/Duik_assets/' + ctrlName + '.png';

            var ctrlFile = Duik.Controller.RasterIconFile[type].toFile(path);
            if (!ctrlFootage)
                ctrlFootage = app.project.importFile(new ImportOptions(ctrlFile));
            else
                ctrlFootage.replace(ctrlFile);
            ctrlFootage.name = ctrlName;
            ctrlFootage.parentFolder = folder;
        }
        
        ctrl = comp.layers.add(ctrlFootage, comp.duration);
    }

    // --- SETUP ---

    // Tag
    DuAETag.setValue( ctrl, DuAETag.Key.DUIK_CONTROLLER_TYPE, type );

    // Appearance
    if (
            (type != Duik.Controller.Type.NULL && type != Duik.Controller.Type.AE_NULL) ||
            DuESF.scriptSettings.get('controllers/lockNullScale', true)
        )
            DuAELayer.lockScale( ctrl );

    if ( layer != null ) {
        var topLayer = layer;
        if ( layer instanceof Array ) {
            layer = DuAELayer.sortByIndex( layer );
            topLayer = layer[ 0 ];
        }

        // if it's a null, switch to 3D if the layer is 3D
        // and move it just above the layer
        if ( type == Duik.Controller.Type.NULL || type == Duik.Controller.Type.AE_NULL) {
            if ( DuAELayer.isThreeD( topLayer ) ) ctrl.threeDLayer = true;
            ctrl.moveBefore( topLayer );
        }

        //center the controller and name it after the layer(s)
        var pos = [ 0, 0 ];
        if ( layer instanceof Array ) {
            new DuList( layer ).do( function ( l ) {
                pos = pos + DuAELayer.getWorldPos( l );
            } );
            pos = pos / layer.length;
        } else {
            pos = DuAELayer.getWorldPos( layer );
        }

        ctrl.transform.position.setValue( pos );

        // Attributes
        Duik.Layer.copyAttributes( ctrl, topLayer, Duik.Layer.Type.CONTROLLER );

        //parent
        if ( parent && type != Duik.Controller.Type.SLIDER && type != Duik.Controller.Type.DOUBLE_SLIDER && type != Duik.Controller.Type.ANGLE ) {
            DuAELayer.parent( layer, ctrl, false, true );
        }
    }

    // Specific controllers
    if ( type == Duik.Controller.Type.SLIDER || type == Duik.Controller.Type.DOUBLE_SLIDER || type == Duik.Controller.Type.ANGLE)
    {
        var scaExp = '';
        var opaExp = '';
        var colExp = '';
        var bgSizeExp = '';
        var bgRoundnessExp = '';
        var bgStrokeExp = '';
        var valueExp = '';
        var valueIndex = -1;
        
        // Add pseudo effects, anchor, generate expressions
        if ( type == Duik.Controller.Type.SLIDER ) {
            pseudoEffect = Duik.PseudoEffect.CONTROLLER_SLIDER;
            //add effect
            effect = pseudoEffect.apply( ctrl );

            var sizeIndex = pseudoEffect.props[ 'Handle' ][ 'Size' ].index;
            var sliderSizeIndex = pseudoEffect.props[ 'Slider' ][ 'Size' ].index;
            var sliderColorIndex = pseudoEffect.props[ 'Slider' ][ 'Color' ].index;
            var colorIndex = pseudoEffect.props[ 'Handle' ][ 'Color' ].index;
            var opacityIndex = pseudoEffect.props[ 'Handle' ][ 'Opacity' ].index;
            valueIndex = pseudoEffect.props[ 'Value' ].index;

            scaExp = [ DuAEExpression.Id.CONTROLLER,
                'var c = effect("' + effect.name + '")(' + sizeIndex + ');',
                'c = c/5-2;',
                '[c, c];'
            ].join( '\n' );
            colExp = DuAEExpression.Id.CONTROLLER + '\neffect("' + effect.name + '")(' + colorIndex + ');';
            opaExp = DuAEExpression.Id.CONTROLLER + '\neffect("' + effect.name + '")(' + opacityIndex + ')';
            bgSizeExp = [ DuAEExpression.Id.CONTROLLER,
                'var fx = thisComp.layer("{layerName}").effect("' + effect.name + '");',
                'c = fx(' + sizeIndex + ').value/100*20;',
                'x = fx(' + sliderSizeIndex + ').value+c;',
                '[x,c]'
            ].join( '\n' );
            bgRoundnessExp = [ DuAEExpression.Id.CONTROLLER,
                'thisComp.layer("{layerName}").effect("' + effect.name + '")(' + sizeIndex + ')/100*10;'
            ].join( '\n' );
            bgColorExp = [ DuAEExpression.Id.CONTROLLER,
                'thisComp.layer("{layerName}").effect("' + effect.name + '")(' + sliderColorIndex + ').value;'
            ].join( '\n' );
            bgStrokeExp = DuAEExpression.Id.CONTROLLER + '\n100/content("Anchor").transform.scale[0]';
            valueExp = [ DuAEExpression.Id.CONTROLLER,
                'var ctrl = thisComp.layer("{layerName}");',
                'var x = ctrl.transform.position[0];',
                'var c = ctrl.effect("' + effect.name + '")(' + sizeIndex + ').value/100*20;',
                'var h = ctrl.effect("' + effect.name + '")(' + sliderSizeIndex + ').value+c;',
                'h = h-c;',
                'h = h/2;',
                'linear(x,-h,h,-100,100);'
            ].join( '\n' );

        } else if ( type == Duik.Controller.Type.DOUBLE_SLIDER ) {
            pseudoEffect = Duik.PseudoEffect.CONTROLLER_2DSLIDER;
            //add effect
            effect = pseudoEffect.apply( ctrl );

            var sizeIndex = pseudoEffect.props[ 'Handle' ][ 'Size' ].index;
            var sliderSizeIndex = pseudoEffect.props[ 'Slider' ][ 'Size' ].index;
            var sliderColorIndex = pseudoEffect.props[ 'Slider' ][ 'Color' ].index;
            var colorIndex = pseudoEffect.props[ 'Handle' ][ 'Color' ].index;
            var opacityIndex = pseudoEffect.props[ 'Handle' ][ 'Opacity' ].index;
            var xIndex = pseudoEffect.props[ 'X Value' ].index;
            var yIndex = pseudoEffect.props[ 'Y Value' ].index;
            valueIndex = pseudoEffect.props[ '2D Value' ].index;

            scaExp = [ DuAEExpression.Id.CONTROLLER,
                'var c = effect("' + effect.name + '")(' + sizeIndex + ');',
                'c = c/5-2;',
                '[c, c];'
            ].join( '\n' );
            colExp = DuAEExpression.Id.CONTROLLER + '\neffect("' + effect.name + '")(' + colorIndex + ');';
            opaExp = DuAEExpression.Id.CONTROLLER + '\neffect("' + effect.name + '")(' + opacityIndex + ')';
            bgSizeExp = [ DuAEExpression.Id.CONTROLLER,
                'var fx = thisComp.layer("{layerName}").effect("' + effect.name + '");',
                'c = fx(' + sizeIndex + ').value/100*20;',
                'x = fx(' + sliderSizeIndex + ').value + c;',
                '[x,x]'
            ].join( '\n' );
            bgRoundnessExp = [ DuAEExpression.Id.CONTROLLER,
                'thisComp.layer("{layerName}").effect("' + effect.name + '")(' + sizeIndex + ')/100*10;'
            ].join( '\n' );
            bgColorExp = [ DuAEExpression.Id.CONTROLLER,
                'thisComp.layer("{layerName}").effect("' + effect.name + '")(' + sliderColorIndex + ').value;'
            ].join( '\n' );
            bgStrokeExp = DuAEExpression.Id.CONTROLLER + '\n100/content("Anchor").transform.scale[0];';
            effect( xIndex ).expression = [ DuAEExpression.Id.CONTROLLER,
                'effect("' + effect.name + '")(' + valueIndex + ').value[0];'
            ].join( '\n' );
            effect( yIndex ).expression = [ DuAEExpression.Id.CONTROLLER,
                'effect("' + effect.name + '")(' + valueIndex + ').value[1];'
            ].join( '\n' );
            valueExp = [ DuAEExpression.Id.CONTROLLER,
                'var ctrl = thisComp.layer("{layerName}");',
                'var x = ctrl.transform.position[0];',
                'var y = ctrl.transform.position[1];',
                'var c = ctrl.effect("' + effect.name + '")(' + sizeIndex + ')/100*20;',
                'h = ctrl.effect("' + effect.name + '")(' + sliderSizeIndex + ')+c;',
                'h = h-c;',
                'h = h/2;',
                'x = linear(x,-h,h,-100,100);',
                'y = linear(y,-h,h,-100,100);',
                '[x, y]'
            ].join( '\n' );

        } else if ( type == Duik.Controller.Type.ANGLE ) {
            pseudoEffect = Duik.PseudoEffect.CONTROLLER_ANGLE;
            //add effect
            effect = pseudoEffect.apply( ctrl );

            var sizeIndex = pseudoEffect.props[ 'Handle' ][ 'Size' ].index;
            var sliderSizeIndex = pseudoEffect.props[ 'Slider' ][ 'Size' ].index;
            var sliderColorIndex = pseudoEffect.props[ 'Slider' ][ 'Color' ].index;
            var colorIndex = pseudoEffect.props[ 'Handle' ][ 'Color' ].index;
            var opacityIndex = pseudoEffect.props[ 'Handle' ][ 'Opacity' ].index;
            valueIndex = pseudoEffect.props[ 'Angle' ].index;

            scaExp = [ DuAEExpression.Id.CONTROLLER,
                'var s = effect("' + effect.name + '")(' + sizeIndex + ')*2;',
                '[s, s];'
            ].join( '\n' );
            colExp = DuAEExpression.Id.CONTROLLER + '\neffect("' + effect.name + '")(' + colorIndex + ');';
            opaExp = DuAEExpression.Id.CONTROLLER + '\neffect("' + effect.name + '")(' + opacityIndex + ')';
            bgSizeExp = [ DuAEExpression.Id.CONTROLLER,
                'var x = thisComp.layer("{layerName}").effect("' + effect.name + '")(' + sliderSizeIndex + ');',
                '[x,x]'
            ].join( '\n' );
            bgColorExp = [ DuAEExpression.Id.CONTROLLER,
                'thisComp.layer("{layerName}").effect("' + effect.name + '")(' + sliderColorIndex + ').value;'
            ].join( '\n' );
            bgStrokeExp = DuAEExpression.Id.CONTROLLER + '\n100/content("Anchor").transform.scale[0];';
            valueExp = DuAEExpression.Id.CONTROLLER + '\nthisComp.layer("{layerName}").transform.rotation;'

        }

        // Create icon
        var iconGroup = ctrl( "ADBE Root Vectors Group" ).addProperty( "ADBE Vector Group" );
        iconGroup.name = 'Icon';
        var iconContent = iconGroup.property( "ADBE Vectors Group" );

        if ( type == Duik.Controller.Type.SLIDER ) {
            var shape1 = iconContent.addProperty( "ADBE Vector Shape - Ellipse" );
            shape1( 'ADBE Vector Ellipse Size' ).expression = scaExp;
            var stroke = iconContent.addProperty( "ADBE Vector Graphic - Fill" );
            stroke( "ADBE Vector Fill Color" ).expression = colExp;

            iconGroup.transform.opacity.expression = opaExp;

            //create anchor
            var ctrlBG = comp.layers.addShape();
            ctrlBG.transform.position.setValue( ctrl.transform.position.value );
            ctrl.parent = ctrlBG;
            ctrl.position.expression = '[value[0],0];';
            ctrlBG.moveAfter( ctrl );

            // Tag
            DuAETag.setValue( ctrlBG, DuAETag.Key.DUIK_CONTROLLER_TYPE, type );
            DuAETag.setValue( ctrlBG, DuAETag.Key.CONTROLLER_ID, new Date().getTime() );

            ctrlBG.selected = false;
            ctrl.selected = true;
            ctrlBG.guideLayer = true;

            //name
            if ( !layer ) {
                Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Slider" ) );
            }
            Duik.Layer.copyAttributes( ctrlBG, ctrl, Duik.Layer.Type.CONTROLLER_BG );

            var anchorGroup = ctrlBG( "ADBE Root Vectors Group" ).addProperty( "ADBE Vector Group" );
            anchorGroup.name = 'Anchor';
            var anchorContent = anchorGroup.property( "ADBE Vectors Group" );
            var rectangle = anchorContent.addProperty( "ADBE Vector Shape - Rect" );
            rectangle( "ADBE Vector Rect Size" ).expression = DuString.replace( bgSizeExp, '{layerName}', ctrl.name );
            rectangle( "ADBE Vector Rect Roundness" ).expression = DuString.replace( bgRoundnessExp, '{layerName}', ctrl.name );
            var stroke = anchorContent.addProperty( "ADBE Vector Graphic - Stroke" );
            stroke( "ADBE Vector Stroke Color" ).expression = DuString.replace( bgColorExp, '{layerName}', ctrl.name );
            stroke( "ADBE Vector Stroke Width" ).expression = DuString.replace( bgStrokeExp, '{layerName}', ctrl.name );
            stroke( "ADBE Vector Stroke Line Cap" ).setValue( 2 );
            effect( valueIndex ).expression = DuString.replace( valueExp, '{layerName}', ctrl.name );
        } else if ( type == Duik.Controller.Type.DOUBLE_SLIDER ) {
            var shape1 = iconContent.addProperty( "ADBE Vector Shape - Ellipse" );
            shape1( 'ADBE Vector Ellipse Size' ).expression = scaExp;
            var stroke = iconContent.addProperty( "ADBE Vector Graphic - Fill" );
            stroke( "ADBE Vector Fill Color" ).expression = colExp;

            iconGroup.transform.opacity.expression = opaExp;

            //create anchor
            var ctrlBG = comp.layers.addShape();
            ctrlBG.transform.position.setValue( ctrl.transform.position.value );
            ctrl.parent = ctrlBG;
            ctrlBG.moveAfter( ctrl );

            // Tag
            DuAETag.setValue( ctrlBG, DuAETag.Key.DUIK_TYPE, Duik.Layer.Type.CONTROLLER );
            DuAETag.setValue( ctrlBG, DuAETag.Key.DUIK_CONTROLLER_TYPE, type );
            DuAETag.setValue( ctrlBG, DuAETag.Key.CONTROLLER_ID, new Date().getTime() );
            DuAETag.addGroup( ctrlBG, i18n._( "Controller" ) );

            ctrlBG.selected = false;
            ctrl.selected = true;
            ctrlBG.guideLayer = true;

            //name
            if ( !layer ) {
                Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Slider" ) );
            }
            Duik.Layer.copyAttributes( ctrlBG, ctrl, Duik.Layer.Type.CONTROLLER_BG );

            //create anchor
            var anchorGroup = ctrlBG( "ADBE Root Vectors Group" ).addProperty( "ADBE Vector Group" );
            anchorGroup.name = 'Anchor';
            var anchorContent = anchorGroup.property( "ADBE Vectors Group" );
            var rectangle = anchorContent.addProperty( "ADBE Vector Shape - Rect" );
            rectangle( "ADBE Vector Rect Size" ).expression = DuString.replace( bgSizeExp, '{layerName}', ctrl.name );
            rectangle( "ADBE Vector Rect Roundness" ).expression = DuString.replace( bgRoundnessExp, '{layerName}', ctrl.name );
            var stroke = anchorContent.addProperty( "ADBE Vector Graphic - Stroke" );
            stroke( "ADBE Vector Stroke Color" ).expression = DuString.replace( bgColorExp, '{layerName}', ctrl.name );
            stroke( "ADBE Vector Stroke Width" ).expression = DuString.replace( bgStrokeExp, '{layerName}', ctrl.name );
            stroke( "ADBE Vector Stroke Line Cap" ).setValue( 2 );
            effect( valueIndex ).expression = DuString.replace( valueExp, '{layerName}', ctrl.name );
        } else if ( type == Duik.Controller.Type.ANGLE ) {
            var shape1 = iconContent.addProperty( "ADBE Vector Shape - Rect" );
            shape1( "ADBE Vector Rect Size" ).setValue( [ 2, 25 ] );
            shape1( "ADBE Vector Rect Position" ).setValue( [ 0, -12 ] );
            var fill = iconContent.addProperty( "ADBE Vector Graphic - Fill" );
            fill( "ADBE Vector Fill Color" ).expression = colExp;

            iconGroup.transform.opacity.expression = opaExp;
            iconGroup.transform.scale.expression = scaExp;

            //create anchor
            var ctrlBG = comp.layers.addShape();
            ctrlBG.transform.position.setValue( ctrl.transform.position.value );
            ctrl.parent = ctrlBG;
            ctrlBG.moveAfter( ctrl );

            // Tag
            DuAETag.setValue( ctrlBG, DuAETag.Key.DUIK_TYPE, Duik.Layer.Type.CONTROLLER );
            DuAETag.setValue( ctrlBG, DuAETag.Key.DUIK_CONTROLLER_TYPE, type );
            DuAETag.setValue( ctrlBG, DuAETag.Key.CONTROLLER_ID, new Date().getTime() );
            DuAETag.addGroup( ctrlBG, i18n._( "Controller" ) );

            ctrlBG.selected = false;
            ctrl.selected = true;
            ctrlBG.guideLayer = true;

            //name
            if ( !layer ) {
                Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Slider" ) );
            }
            Duik.Layer.copyAttributes( ctrlBG, ctrl, Duik.Layer.Type.CONTROLLER_BG );

            //create anchor
            var anchorGroup = ctrlBG( "ADBE Root Vectors Group" ).addProperty( "ADBE Vector Group" );
            anchorGroup.name = 'Anchor';
            var anchorContent = anchorGroup.property( "ADBE Vectors Group" );
            var circle = anchorContent.addProperty( "ADBE Vector Shape - Ellipse" );
            circle( "ADBE Vector Ellipse Size" ).expression = DuString.replace( bgSizeExp, '{layerName}', ctrl.name );
            var stroke = anchorContent.addProperty( "ADBE Vector Graphic - Stroke" );
            stroke( "ADBE Vector Stroke Color" ).expression = DuString.replace( bgColorExp, '{layerName}', ctrl.name );
            stroke( "ADBE Vector Stroke Width" ).expression = DuString.replace( bgStrokeExp, '{layerName}', ctrl.name );
            stroke( "ADBE Vector Stroke Line Cap" ).setValue( 2 );
            effect( valueIndex ).expression = DuString.replace( valueExp, '{layerName}', ctrl.name );
        }

        Duik.Controller.setColor( DuColor.Color.APP_HIGHLIGHT_COLOR, ctrl );

        return ctrl;
    }

    // Null and raster are ready
    if ( type == Duik.Controller.Type.NULL || type == Duik.Controller.Type.AE_NULL ||  mode == 3) {
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Null" ) );
        return ctrl;
    }

    // Other controllers

    // Create Icon and effect
    var preset;
    if ( type == Duik.Controller.Type.HAND ) {
        preset = preset_ctrl_hand.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Hand" ) );
    } else if ( type == Duik.Controller.Type.ROTATION ) {
        preset = preset_ctrl_rotation.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Rotation" ) );
    } else if ( type == Duik.Controller.Type.X_POSITION ) {
        preset = preset_ctrl_xPosition.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "X Position" ) );
    } else if ( type == Duik.Controller.Type.Y_POSITION ) {
        preset = preset_ctrl_yPosition.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Y Position" ) );
    } else if ( type == Duik.Controller.Type.POSITION ) {
        preset = preset_ctrl_position.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Position" ) );
    } else if ( type == Duik.Controller.Type.TRANSFORM ) {
        preset = preset_ctrl_transform.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Transform" ) );
    } else if ( type == Duik.Controller.Type.EYE ) {
        preset = preset_ctrl_eye.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Eye" ) );
    } else if ( type == Duik.Controller.Type.CAMERA ) {
        preset = preset_ctrl_camera.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Camera" ) );
    } else if ( type == Duik.Controller.Type.HAND ) {
        preset = preset_ctrl_hand.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Hand" ) );
    } else if ( type == Duik.Controller.Type.HEAD ) {
        preset = preset_ctrl_head.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Head" ) );
    } else if ( type == Duik.Controller.Type.HIPS ) {
        preset = preset_ctrl_hips.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Hips" ) );
    } else if ( type == Duik.Controller.Type.BODY ) {
        preset = preset_ctrl_body.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Body" ) );
    } else if ( type == Duik.Controller.Type.SHOULDERS ) {
        preset = preset_ctrl_shoulders.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Shoulders" ) );
    } else if ( type == Duik.Controller.Type.TAIL ) {
        preset = preset_ctrl_tail.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Tail" ) );
    } else if ( type == Duik.Controller.Type.FOOT ) {
        preset = preset_ctrl_foot.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Foot" ) );
    } else if ( type == Duik.Controller.Type.EAR ) {
        preset = preset_ctrl_ear.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Ear" ) );
    } else if ( type == Duik.Controller.Type.HAIR ) {
        preset = preset_ctrl_hair.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Hair" ) );
    } else if ( type == Duik.Controller.Type.MOUTH ) {
        preset = preset_ctrl_mouth.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Mouth" ) );
    } else if ( type == Duik.Controller.Type.NOSE ) {
        preset = preset_ctrl_nose.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Nose" ) );
    } else if ( type == Duik.Controller.Type.EYEBROW ) {
        preset = preset_ctrl_eyebrow.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Eyebrow" ) );
    } else if ( type == Duik.Controller.Type.PONEYTAIL ) {
        preset = preset_ctrl_hair2.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Hair" ) );
    } else if ( type == Duik.Controller.Type.CLAWS ) {
        preset = preset_ctrl_paw.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Claws" ) );
    } else if ( type == Duik.Controller.Type.HOOF ) {
        preset = preset_ctrl_hoof.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Hoof" ) );
    } else if ( type == Duik.Controller.Type.PINCER ) {
        preset = preset_ctrl_pincer.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Pincer" ) );
    } else if ( type == Duik.Controller.Type.WING ) {
        preset = preset_ctrl_wing.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Wing" ) );
    } else if ( type == Duik.Controller.Type.FIN ) {
        preset = preset_ctrl_fin.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Fin" ) );
    } else if ( type == Duik.Controller.Type.AUDIO ) {
        preset = preset_ctrl_audio.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Audio" ) );
    } else if ( type == Duik.Controller.Type.TORSO ) {
        preset = preset_ctrl_torso.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Torso" ) );
    } else if ( type == Duik.Controller.Type.VERTEBRAE ) {
        preset = preset_ctrl_vertebrae.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Vertebrae" ) );
    } else if ( type == Duik.Controller.Type.PENIS ) {
        preset = preset_ctrl_penis.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._p("Easter egg ;)", "Penis" ) );
    } else if ( type == Duik.Controller.Type.VULVA ) {
        preset = preset_ctrl_vulva.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._p("Easter egg ;)", "Vulva" ) );
    } else if ( type == Duik.Controller.Type.WALK_CYCLE ) {
        preset = preset_ctrl_walkCycle.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Animation Cycles" ) );
    } else if ( type == Duik.Controller.Type.BLENDER ) {
        preset = preset_ctrl_blender.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Animation Blender" ) );
    } else if ( type == Duik.Controller.Type.CONNECTOR ) {
        preset = preset_ctrl_connector.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Connector" ) );
    } else if ( type == Duik.Controller.Type.EXPOSE_TRANSFORM ) {
        preset = preset_ctrl_exposeTm.toFile();
        if ( !layer ) Duik.Layer.setAttributes( ctrl, Duik.Layer.Type.CONTROLLER, i18n._( "Expose Transform" ) );
    }

    DuAELayer.applyPreset( ctrl, preset );
    Duik.Controller.setColor( DuColor.Color.APP_HIGHLIGHT_COLOR, ctrl );

    // Reset the side (to flip the controller if needed)
    if ( layer != null) {
        var side = Duik.Layer.side(layer);
        Duik.Controller.setSide( side , ctrl);
    }

    return ctrl;
}

/**
 * Gets an existing controller if there  is one at the correct location, or creates a new one.
 * @param {Layer} layer - The layer where to create the controller.
 * @param {Duik.Controller.Type} [type=Duik.Controller.Type.TRANSFORM] - The type of Controller.
 * @param {Layer[]|DuList.<Layer>} [controllers] - A list of existing controllers. If omitted, will get all the controllers of the comp.
 * @return {Layer} The controller
 */
Duik.Controller.getCreate = function ( layer, type, controllers ) {
    var comp = layer.containingComp;
    type = def( type, Duik.Controller.Type.TRANSFORM );
    controllers = def( controllers, Duik.Layer.get( Duik.Layer.Type.CONTROLLER, false, comp ) );

    //get the layer position
    var pos = DuAELayer.getWorldPos( layer );
    var ctrl = null;

    //look for an existing controller
    controllers = new DuList( controllers );
    var dist = 10;
    var ctrls = [];
    while ( ctrl = controllers.next() ) {
        var ctrlPos = DuAELayer.getWorldPos( ctrl );
        // get the closest one at less than 10px distance
        var d = DuMath.length(ctrlPos, pos);
        // 2px tolerance
        if (Math.abs(d - dist) < 2) {
            ctrls.push(ctrl);
            continue;
        }
        // Closer
        if (d < dist) {
            dist = d;
            ctrls = [ctrl];
            continue;
        }
    }

    if (ctrls.length == 1) return ctrls[0];
    if (ctrls.length == 0) return Duik.Controller.create( comp, type, layer );

    //if found multiple, check type and side
    var side = Duik.Layer.side(layer);
    var loc = Duik.Layer.location(layer);
    var foundCtrl = null;
    for (var i = 0; i < ctrls.length; i++) {
        var ctrl = ctrls[i];
        // if it's the same type and side, return it
        var ctrlSide = Duik.Layer.side(ctrl);
        var ctrlLoc = Duik.Layer.location(ctrl);
        var ctrlType = Duik.Controller.type(ctrl);
        if (ctrlSide == side && ctrlLoc == loc && ctrlType == type) return ctrl;
        if (ctrlSide == side && ctrlLoc == loc) {
            foundCtrl = ctrl;
            continue;
        }
        if (!foundCtrl && (ctrlSide == side  || ctrlLoc == loc))
        {
            foundCtrl = ctrl;
            continue;
        }
    }
    if (foundCtrl) return foundCtrl;
    return ctrls[0];
}

// low-level undocumented method to get a prop from a controller effect
Duik.Controller.getEffectProp = function ( layer, prop, anchor ) {
    anchor = def(anchor, false);
    // Test all pseudo effects
    var pe = Duik.PseudoEffect.CONTROLLER;
    var index = -1;
    var effect = layer.effect( pe.matchName );

    if ( effect && anchor) index = pe.props[ 'Anchor' ][ prop ].index;
    else if (effect) index = pe.props[ 'Icon' ][prop].index;
    else if (anchor) return null;

    if ( !effect ) {
        pe = Duik.PseudoEffect.CONTROLLER_SLIDER;
        effect = layer.effect( pe.matchName );
        if ( effect) index = pe.props[ 'Handle' ][ prop ].index;
    }
    if ( !effect ) {
        pe = Duik.PseudoEffect.CONTROLLER_2DSLIDER;
        effect = layer.effect( pe.matchName );
        if ( effect ) index = pe.props[ 'Handle' ][ prop ].index;
    }
    if ( !effect ) {
        pe = Duik.PseudoEffect.CONTROLLER_ANGLE;
        effect = layer.effect( pe.matchName );
        if ( effect ) index = pe.props[ 'Handle' ][ prop ].index;
    }

    if ( index < 0 ) return null;
    return effect( index );
}

Duik.CmdLib[ 'Controller' ][ "Bake" ] = "Duik.Controller.bake()";
/**
 * Bakes the appearance of the selected controllers to improve performance by removing appearance-only expressions and effects.
 * @param {Layer[]|DuList.<Layer>|Layer} [layers] - The layers to bake; will use selected layers from the current comp if omitted.
 */
Duik.Controller.bake = function ( layers ) {
    layers = def( layers, DuAEComp.unselectLayers() );
    layers = new DuList( layers );
    if ( layers.isEmpty() ) return;

    DuAE.beginUndoGroup( i18n._( "Bake controllers" ), false );

    var pe = Duik.PseudoEffect.CONTROLLER;

    DuScriptUI.progressBar.addMax( layers.length() );

    layers.do( function ( layer ) {
        DuScriptUI.progressBar.hit( 1, 'Baking controller: %1' );
        // Nothing to do if this is not a shape
        if ( !layer instanceof ShapeLayer ) return;
        // or a controller
        if ( !Duik.Layer.isType( layer, Duik.Layer.Type.CONTROLLER ) ) return;

        function isCtrlExpression( exp ) {
            return exp.indexOf( DuAEExpression.Id.CONTROLLER ) == 0;
        }

        // remove expressions
        var group = layer( "ADBE Root Vectors Group" );
        if ( group ) {
            var groupInfo = new DuAEProperty( group );
            groupInfo.removeExpression( isCtrlExpression );
        }

        /*group = layer("ADBE Root Vectors Group").property('Icon');
          if (group)
        {
               var groupInfo = new DuAEProperty( group.transform );
               groupInfo.removeExpression( isCtrlExpression );

               fillProp = group.content('ADBE Vector Graphic - Fill');
               groupInfo = new DuAEProperty( fillProp );
               groupInfo.removeExpression( isCtrlExpression );
        }//*/

        // remove effect
        var effect = layer.effect( pe.matchName );
        if ( effect ) effect.remove();
    } );

    DuAEComp.selectLayers(layers);

    DuAE.endUndoGroup( i18n._( "Bake controllers" ) );
}

Duik.CmdLib[ 'Controller' ][ "Extract" ] = "Duik.Controller.extract()";
/**
 * Extracts the controllers from the precomposition,< br/>
 * and copies them to the composition, linking all precomposed controllers<br />
 * to the new ones.<br />
 * WARNING This method uses the native copy and paste commands of After Effects,<br />
 * DO NOT enclose it in an undoGroup.<br />
 * Undo groups will be handled by this method itself.
 * @param {AVLayer} preComposition - The precomposition layer
 * @param {boolean} [useEssentialProperties=true] - Only in Ae v15.1 (CC2018) and up, true to use Master Properties<br />
 * instead of expressions to link the controllers. Ignored on previous versions of After Effects.
 * @param {boolean} [bake=true] - Bakes the appearances of the controllers before extracting them.<br />
 * Note: this fixes some issues when extracting controllers between compositions of different sizes.
 * @return {int} Error code:<br >
 * -3: No controllers found in the precomp<br >
 * -2: The layer is not a precomposition<br >
 * -1: Some controllers can not be extracted<br >
 * 0: Unknown error<br >
 * 1: OK
 */
Duik.Controller.extract = function ( preComposition, useEssentialProperties, bake ) {
    if ( DuAE.version.version < 15.1 ) useEssentialProperties = false;
    if ( DuAE.version.version < 17.0 ) useEssentialProperties = def( useEssentialProperties, false );
    useEssentialProperties = def( useEssentialProperties, true );
    bake = def( bake, true );

    preComposition = def( preComposition, DuAEComp.getActiveLayer() );
    if ( !preComposition ) return -2;

    var comp = preComposition.containingComp;

    //get precomp.
    var preComp = preComposition.source;
    if ( !preComp ) return -2;
    if ( !( preComp instanceof CompItem ) ) return -2;

    //get all controllers from precomposition.
    var controllers = Duik.Controller.get( false, preComp );
    if ( controllers.length == 0 ) return -3;

    //get controllers from current comp, to check if some are already extracted
    var currentControllers = Duik.Controller.get( false, comp );

    DuAE.beginUndoGroup( i18n._( "Extract controllers" ), false );
    DuAEProject.setProgressMode( true );

    app.beginSuppressDialogs();

    DuAEComp.setUniqueCompName( comp );
    DuAEComp.setUniqueCompName( preComp );

    var controller;
    var ctrlLayers = [];
    var newCtrls = [];
    var ids = new DuList();
    var ctrlList = new DuList( controllers );

    // Prepare extraction: list already extracted controllers,
    // Check parents, make sure all controllers have unique ids,
    // Bake them
    ctrlList.do( function ( controller ) {
        var ctrlId = Duik.Controller.id( controller );
        if ( !ctrlId ) ctrlId = Duik.Controller.setId( controller );

        //check if it's already extracted
        for ( var i = 0, num = currentControllers.length; i < num; i++ ) {
            var currentCtrl = currentControllers[ i ];
            var currentId = Duik.Controller.id( currentCtrl );
            var extracted = currentId == ctrlId && currentId != -1;
            if ( extracted ) extracted = Duik.Controller.controlledComp( currentCtrl ) == preComp.id;

            if ( extracted ) {
                currentCtrl.reparent = false;
                newCtrls.push( currentCtrl );
                return;
            }
        }
        //check if the layer has a parent which is not a controller or nothing
        var ctrlParent = controller.parent;
        controller.reparent = true;
        if ( !ctrlParent ) controller.reparent = false;
        if ( Duik.Layer.isType( ctrlParent, Duik.Layer.Type.CONTROLLER ) ) controller.reparent = false;
        ctrlLayers.push( controller );

        //make sure all controllers have unique ids
        if ( ids.indexOf( ctrlId ) > -1 ) {
            var newId = Duik.Controller.setId( controller );
            ids.push( newId );
        }

        //bake them
        if ( bake ) Duik.Controller.bake( controller );
    } );

    // if this is a new extraction using MPs from an already extracted precomp,
    // this will be set to true to update the expressions in the MPs
    var reLink = false;

    // No new controller found to extract
    if ( ctrlLayers.length == 0 ) {
        //Let's ask if the user wants to extract them all once again.
        if ( !useEssentialProperties ) return;
        var ok = confirm( i18n._( "No new controller was found to extract.\nDo you want to extract all controllers from this pre-composition anyway?" ),
            false,
            i18n._( "Nothing new!" )
        );
        if ( !ok ) {
            app.endSuppressDialogs( false );
            DuAEProject.setProgressMode( false );
            DuAE.endUndoGroup( i18n._( "Extract controllers" ) );
            return;
        }
        reLink = true;
        newCtrls = [];
        ctrlList.do( function ( controller ) {
            var ctrlParent = controller.parent;
            controller.reparent = true;
            if ( !ctrlParent ) controller.reparent = false;
            if ( Duik.Layer.isType( ctrlParent, Duik.Layer.Type.CONTROLLER ) ) controller.reparent = false;
            ctrlLayers.push( controller );
            if ( bake ) Duik.Controller.bake( controller );
        } );
    }

    // Still nothing
    if ( ctrlLayers.length == 0 ) {
        app.endSuppressDialogs( false );
        DuAEProject.setProgressMode( false );
        DuAE.endUndoGroup( i18n._( "Extract controllers" ) );
        return;
    }

    //copy controllers
    //to apply all locators transform values in case controllers are children of locators and temporarily disable their expressions
    Duik.Constraint.applyLocatorValues( preComp.layers, true );
    newCtrls = newCtrls.concat( DuAELayer.copyToComp( ctrlLayers, comp ) );
    //enable the locators again
    Duik.Constraint.disableLocator( preComp.layers, false );

    //Add null at position precomp.width/2 precomp.height/2
    var nullLayer = DuAEComp.addNull( comp );
    nullLayer.transform.position.setValue( [ preComp.width / 2, preComp.height / 2 ] );

    //parent unparented controllers to the null
    DuAELayer.parent( newCtrls, nullLayer );
    //parent the null to the precomp using parentWithJump
    nullLayer.setParentWithJump( preComposition );
    //remove the null
    nullLayer.remove();

    //create Master Props or Expressions
    //link transformations and effects (only)
    ctrlList.do( function ( controller ) {
        //get the new controller 
        var newController = null;
        for ( var i = 0, num = newCtrls.length; i < num; i++ ) {
            var newCtrl = newCtrls[ i ];
            var newId = Duik.Controller.id( newCtrl );
            var currentId = Duik.Controller.id( controller );
            if ( newId == currentId ) {
                newController = newCtrl;
                break;
            }
        }

        if (!newController) return;

        //use locators for all controllers parented to something else than a controller or nothing
        if ( controller.reparent ) Duik.Constraint.parentAcrossComp( controller.parent, useEssentialProperties, newController );

        //remove expressions in the data of the child effect
        var p = new DuAEProperty( newController( 'ADBE Effect Parade' ) );
        p.removeDataExpressions();

        if ( useEssentialProperties ) {
            p = new DuAEProperty( controller.transform );
            p.addToEGP();
            p = new DuAEProperty( controller( 'ADBE Effect Parade' ) );
            p.addToEGP( controller( 'ADBE Effect Parade' ) );

            // get essential properties
            var mps = DuAEProperty.getProps( preComposition( 'ADBE Layer Overrides' ), PropertyType.PROPERTY );
            var mpList = new DuList( mps );
            //links
            mpList.do( function ( mp ) {
                // We need to get the source of the mp,
                // before 22.0 we had to use the name, after that the API has the info
                var newProp = null;
                if ( DuAE.version.version < 22.0 ) {
                    //get prop name
                    var nameArray = mp.name.split( ' / ' );
                    if ( nameArray.length != 2 ) return;
                    var pLink = nameArray[ 1 ];
                    var layerName = nameArray[ 0 ];
                    if ( layerName != controller.name ) return;
                    try {
                        newProp = eval( 'newController' + pLink );
                    } catch ( e ) {
                        return;
                    }
                } else {
                    var mpProp = mp.getProperty();
                    sourceProp = new DuAEProperty( mpProp.essentialPropertySource );
                    var source = new DuAEProperty( sourceProp );
                    if ( source.layer.name != controller.name ) return;
                    pLink = sourceProp.expressionLink( false, false );
                    try {
                        newProp = eval( 'newController' + pLink );
                    } catch ( e ) {
                        return;
                    }
                }


                //link
                if ( newProp ) {
                    mp.pickWhip( newProp, true );
                    //AE 17.0.0 bug workaround: need a keyframe on the master property to be sure it's not ignored.
                    if ( DuAE.version.version == 17 && DuAE.version.patch == 0 ) {
                        var mpProp = mp.getProperty();
                        mpProp.setValueAtTime( 0, mpProp.value );
                    }
                }
            } );
        } else {
            //transform
            p = new DuAEProperty( controller.transform );
            p.linkProperties( newController.transform, undefined, preComposition );
            //effects
            p = new DuAEProperty( controller( 'ADBE Effect Parade' ) );
            p.linkProperties( newController( 'ADBE Effect Parade' ), undefined, preComposition );
        }

        //set params to keep the link
        DuAETag.setValue( newController, DuAETag.Key.DUIK_CONTROLLED_COMP, preComp.id );
        DuAETag.setValue( newController, DuAETag.Key.DUIK_CONTROLLED_LAYER, controller.name );
        DuAETag.setValue( newController, DuAETag.Key.DUIK_CONTROLLED_USING_MP, useEssentialProperties );
    } );

    app.endSuppressDialogs( false );
    DuAEProject.setProgressMode( false );
    DuAE.endUndoGroup( i18n._( "Extract controllers" ) );

    return 1;
}

/**
 * Checks the tyoe of the controller layer
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected controller of the current comp
 * @returns {Duik.Controller.Type}
 */
Duik.Controller.type = function( layer ) {
    layer = def( layer, DuAEComp.getActiveLayer() );
    if ( !layer ) return Duik.Controller.Type.TRANSFORM;

    if ( !Duik.Layer.isType( layer, Duik.Layer.Type.CONTROLLER ) ) return Duik.Controller.Type.TRANSFORM;

    return DuAETag.getValue( layer, DuAETag.Key.DUIK_CONTROLLER_TYPE, DuAETag.Type.INT );
}

/**
 * Checks the color of the controller layer
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {DuColor}
 */
Duik.Controller.color = function ( layer ) {
    layer = def( layer, DuAEComp.getActiveLayer() );
    if ( !layer ) return new DuColor();

    if ( !Duik.Layer.isType( layer, Duik.Layer.Type.CONTROLLER ) ) return new DuColor();

    var col = Duik.Controller.getEffectProp( layer, 'Color' );
    if ( !col ) return new DuColor();

    return new DuColor( col.value );
}

/**
 * Sets the color of the controller layers
 * @param {DuColor|null} [color] The color. If omitted or null, will assign a random color for each bone.
 * @param {Layer|LayerCollection|Layer[]|DuList.<Layer>} [layers=DuAEComp.getSelectedLayers()] The layer(s). If omitted, will use all selected layers in the comp
 * @returns {DuColor}
 */
Duik.Controller.setColor = function ( color, layers ) {
    layers = def( layer, DuAEComp.getSelectedLayers() );
    layers = new DuList( layers );
    if ( layers.length() == 0 ) return;

    for ( var i = 0, n = layers.length(); i < n; i++ ) {
        var layer = layers.at( i );

        if ( !Duik.Layer.isType( layer, Duik.Layer.Type.CONTROLLER ) ) continue;

        var col = Duik.Controller.getEffectProp( layer, 'Color' );
        if ( !col ) continue;
        var c = [ 0, 0, 0, 0 ];
        if ( typeof color === 'undefined' || color == null ) c = DuColor.random().floatRGBA();
        else c = color.floatRGBA();
        col.setValue( c );
    }
}

/**
 * Checks the size of the controller layer
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {DuColor}
 */
Duik.Controller.size = function ( layer ) {
    layer = def( layer, DuAEComp.getActiveLayer() );
    if ( !layer ) return 100;

    if ( !Duik.Layer.isType( layer, Duik.Layer.Type.CONTROLLER ) ) return 100;

    var s = Duik.Controller.getEffectProp( layer, 'Size' );
    if ( !s ) return 100;

    s = new DuAEProperty( s );

    return s.value( true );
}

/**
 * Sets the size of the controller layers
 * @param {float} size The size
 * @param {Layer|LayerCollection|Layer[]|DuList.<Layer>} [layers=DuAEComp.getSelectedLayers()] The layer(s). If omitted, will use all selected layers in the comp
 * @returns {DuColor}
 */
Duik.Controller.setSize = function ( size, layers ) {
    layers = def( layer, DuAEComp.getSelectedLayers() );
    layers = new DuList( layers );
    if ( layers.length() == 0 ) return;

    for ( var i = 0, n = layers.length(); i < n; i++ ) {
        var layer = layers.at( i );

        if ( !Duik.Layer.isType( layer, Duik.Layer.Type.CONTROLLER ) ) continue;

        var s = Duik.Controller.getEffectProp( layer, 'Size' );
        if ( !s ) continue;
        s.setValue( size );
    }
}

/**
 * Checks the opacity of the controller layer
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {DuColor}
 */
Duik.Controller.opacity = function ( layer ) {
    layer = def( layer, DuAEComp.getActiveLayer() );
    if ( !layer ) return 100;

    if ( !Duik.Layer.isType( layer, Duik.Layer.Type.CONTROLLER ) ) return 100;

    var opa = Duik.Controller.getEffectProp( layer, 'Opacity' );
    if ( !opa ) return 100;

    return opa.value;
}

/**
 * Sets the opacity of the controller layers
 * @param {float} opacity The opacity
 * @param {Layer|LayerCollection|Layer[]|DuList.<Layer>} [layers=DuAEComp.getSelectedLayers()] The layer(s). If omitted, will use all selected layers in the comp
 * @returns {DuColor}
 */
Duik.Controller.setOpacity = function ( opacity, layers ) {
    layers = def( layer, DuAEComp.getSelectedLayers() );
    layers = new DuList( layers );
    if ( layers.length() == 0 ) return;

    for ( var i = 0, n = layers.length(); i < n; i++ ) {
        var layer = layers.at( i );

        if ( !Duik.Layer.isType( layer, Duik.Layer.Type.CONTROLLER ) ) continue;

        var opa = Duik.Controller.getEffectProp( layer, 'Opacity' );
        if ( !opa ) continue;
        opa.setValue( opacity );
    }
}

/**
 * Checks the color of the anchor of the controller layer
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {DuColor}
 */
Duik.Controller.anchorColor = function ( layer ) {
    layer = def( layer, DuAEComp.getActiveLayer() );
    if ( !layer ) return new DuColor();

    if ( !Duik.Layer.isType( layer, Duik.Layer.Type.CONTROLLER ) ) return new DuColor();

    var col = Duik.Controller.getEffectProp( layer, 'Color', true );
    if ( !col ) return new DuColor();

    return new DuColor( col.value );
}

/**
 * Sets the color of the anchor of the controller layers
 * @param {DuColor|null} [color] The color. If omitted or null, will assign a random color for each bone.
 * @param {Layer|LayerCollection|Layer[]|DuList.<Layer>} [layers=DuAEComp.getSelectedLayers()] The layer(s). If omitted, will use all selected layers in the comp
 * @returns {DuColor}
 */
Duik.Controller.setAnchorColor = function ( color, layers ) {
    layers = def( layer, DuAEComp.getSelectedLayers() );
    layers = new DuList( layers );
    if ( layers.length() == 0 ) return;

    for ( var i = 0, n = layers.length(); i < n; i++ ) {
        var layer = layers.at( i );

        if ( !Duik.Layer.isType( layer, Duik.Layer.Type.CONTROLLER ) ) continue;

        var col = Duik.Controller.getEffectProp( layer, 'Color', true );
        if ( !col ) continue;
        var c = [ 0, 0, 0, 0 ];
        if ( typeof color === 'undefined' || color == null ) c = DuColor.random().floatRGBA();
        else c = color.floatRGBA();
        col.setValue( c );
    }
}

/**
 * Checks the size of the anchor of the controller layer
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {DuColor}
 */
Duik.Controller.anchorSize = function ( layer ) {
    layer = def( layer, DuAEComp.getActiveLayer() );
    if ( !layer ) return 100;

    if ( !Duik.Layer.isType( layer, Duik.Layer.Type.CONTROLLER ) ) return 100;

    var s = Duik.Controller.getEffectProp( layer, 'Size', true );
    if ( !s ) return 100;

    s = new DuAEProperty( s );

    return s.value( true );
}

/**
 * Sets the size of the anchor of the controller layers
 * @param {float} size The size
 * @param {Layer|LayerCollection|Layer[]|DuList.<Layer>} [layers=DuAEComp.getSelectedLayers()] The layer(s). If omitted, will use all selected layers in the comp
 * @returns {DuColor}
 */
Duik.Controller.setAnchorSize = function ( size, layers ) {
    layers = def( layer, DuAEComp.getSelectedLayers() );
    layers = new DuList( layers );
    if ( layers.length() == 0 ) return;

    for ( var i = 0, n = layers.length(); i < n; i++ ) {
        var layer = layers.at( i );

        if ( !Duik.Layer.isType( layer, Duik.Layer.Type.CONTROLLER ) ) continue;

        var s = Duik.Controller.getEffectProp( layer, 'Size', true );
        if ( !s ) continue;
        s.setValue( size );
    }
}

/**
 * Checks the opacity of the anchor of the controller layer
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {DuColor}
 */
Duik.Controller.anchorOpacity = function ( layer ) {
    layer = def( layer, DuAEComp.getActiveLayer() );
    if ( !layer ) return 100;

    if ( !Duik.Layer.isType( layer, Duik.Layer.Type.CONTROLLER ) ) return 100;

    var opa = Duik.Controller.getEffectProp( layer, 'Opacity', true );
    if ( !opa ) return 100;

    return opa.value;
}

/**
 * Sets the opacity of the anchor of the controller layers
 * @param {float} opacity The opacity
 * @param {Layer|LayerCollection|Layer[]|DuList.<Layer>} [layers=DuAEComp.getSelectedLayers()] The layer(s). If omitted, will use all selected layers in the comp
 * @returns {DuColor}
 */
Duik.Controller.setAnchorOpacity = function ( opacity, layers ) {
    layers = def( layer, DuAEComp.getSelectedLayers() );
    layers = new DuList( layers );
    if ( layers.length() == 0 ) return;

    for ( var i = 0, n = layers.length(); i < n; i++ ) {
        var layer = layers.at( i );

        if ( !Duik.Layer.isType( layer, Duik.Layer.Type.CONTROLLER ) ) continue;

        var opa = Duik.Controller.getEffectProp( layer, 'Opacity', true );
        if ( !opa ) continue;
        opa.setValue( opacity );
    }
}

Duik.CmdLib[ 'Controller' ][ "Select" ] = "Duik.Controller.select()";
/**
 * Selects all the controllers in the comp (and deselects any other layer)
 * @param {CompItem} [comp=DuAEProject.getActiveComp()] The comp
 */
Duik.Controller.select = function ( comp ) {
    Duik.Layer.select( Duik.Layer.Type.CONTROLLER, comp );
}

Duik.CmdLib[ 'Controller' ][ "Show / Hide" ] = "Duik.Controller.toggleVisibility()";
/**
 * Show/hides all the controllers
 * @param {CompItem} [comp=DuAEProject.getActiveComp()] The comp
 * @param {bool} [notSelectedOnly=false] Hides only the controllers which are not selected
 */
Duik.Controller.toggleVisibility = function ( comp, notSelectedOnly ) {
    notSelectedOnly = def( notSelectedOnly, false );
    Duik.Layer.toggleVisibility( Duik.Layer.Type.CONTROLLER, comp, notSelectedOnly );
}

Duik.CmdLib[ 'Controller' ][ "Eyes Pseudo-Effect" ] = "Duik.Controller.pseudoEffect( Duik.Controller.PseudoEffect.EYES )";
Duik.CmdLib[ 'Controller' ][ "Fingers Pseudo-Effect" ] = "Duik.Controller.pseudoEffect( Duik.Controller.PseudoEffect.FINGERS )";
Duik.CmdLib[ 'Controller' ][ "Hand Pseudo-Effect" ] = "Duik.Controller.pseudoEffect( Duik.Controller.PseudoEffect.HAND )";
Duik.CmdLib[ 'Controller' ][ "Head Pseudo-Effect" ] = "Duik.Controller.pseudoEffect( Duik.Controller.PseudoEffect.HEAD )";
/**
 * Applies a pre-rigged pseudo effect to the layer
 * @param {Duik.Controller.PseudoEffect} preset The preset
 */
Duik.Controller.pseudoEffect = function ( preset ) {
    var layers = DuAEComp.getSelectedLayers();
    if ( layers.length == 0 ) return;

    DuAE.beginUndoGroup( "Add pre-rigged Pseudo-Effect" );

    for ( var i = 0, num = layers.length; i < num; i++ ) {
        //add effect
        DuAELayer.applyPreset( layers[ i ], preset );
    }

    DuAE.endUndoGroup();
}

/**
 * Sets the type of the layers to Controller
 * @param {Layer[]|LayerCollection|DuList.<Layer>|Layer} [layers] The layer. If omitted, will use all selected layers in the active comp
 * @param {Duik.Controller.Type} [type=Duik.Controller.Type.TRANSFORM] The type of controllers to set. If omitted, will try to guess it from the layer name.
 */
Duik.Controller.tag = function ( layers, type ) {
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    DuAE.beginUndoGroup( i18n._("Tag as ctrls"), false );

    Duik.Layer.setType( Duik.Layer.Type.CONTROLLER, layers );

    // Detect the type of controller using the limb name
    layers.do(function(layer) {
        var limbName = Duik.Layer.name(layer);
        var ctrlType = Duik.Controller.getControllerType( limbName );
        DuAETag.setValue( layer, DuAETag.Key.DUIK_CONTROLLER_TYPE, ctrlType );
    });

    DuAE.endUndoGroup( i18n._("Tag as ctrls") );
}

/**
 * Sets the character name of the controller layer
 * @param {string} characterName The character name.
 * @param {Layer} [layer=DuAEComp.getSelectedLayers()] The layers. If omitted, will use all selected layers in the comp
 */
Duik.Controller.setCharacterName = function ( characterName, layers ) {
    layers = def( layers, Duik.Controller.get() );
    Duik.Layer.setGroupName( characterName, layers );
}

/**
 * Sets the limb name of the controller layer
 * @param {string} limbName The limb name.
 * @param {Layer} [layer=DuAEComp.getSelectedLayers()] The layers. If omitted, will use all selected layers in the comp
 */
Duik.Controller.setLimbName = function ( limbName, layers ) {
    layers = def( layers, Duik.Controller.get() );
    Duik.Layer.setName( limbName, layers );
}

/**
 * Sets the side of the layer
 * @param {OCO.Side} side The side
 * @param {Layer[]|Layer|DuList.<Layer>|LayerCollection} [layers=Duik.Controller.get()] The controller. If omitted, will use all selected controllers in the comp
 */
Duik.Controller.setSide = function ( side, layers ) {
    layers = def( layers, Duik.Controller.get() );
    layers = new DuList(layers);

    Duik.Layer.setSide( side, layers );
    // Flip the Left controllers
    for (var i = 0, n = layers.length(); i < n; i++) {
        var layer = layers.at(i);
        if (layer instanceof ShapeLayer) {
            var effect = layer.effect('Pseudo/DUIK Ctrl v03');
            if (effect) {
                effect.property('Flip').setValue(
                    side == OCO.Side.LEFT ? 1 : 0
                );
            }
        }
    }
}

/**
 * Sets the location of the layer
 * @param {OCO.Side} side The side
 * @param {Layer[]} [layers=DuAEComp.getSelectedLayers()] The layers. If omitted, will use all selected layers in the comp
 */
Duik.Controller.setLocation = function ( location, layers ) {
    layers = def( layers, Duik.Controller.get() );
    Duik.Layer.setLocation( location, layers );
}

/**
 * Gets the unique ID of the controller layer.
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {int}
 */
Duik.Controller.id = function ( layer ) {
    layer = def( layer, DuAEComp.getActiveLayer() );
    if ( !layer ) return -1;
    return DuAETag.getValue( layer, DuAETag.Key.DUIK_CONTROLLER_ID, DuAETag.Type.INT );
}

/**
 * Gets the îd of the comp controlled by this extracted controller layer.
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {int}
 */
Duik.Controller.controlledComp = function ( layer ) {
    layer = def( layer, DuAEComp.getActiveLayer() );
    if ( !layer ) return -1;
    return DuAETag.getValue( layer, DuAETag.Key.DUIK_CONTROLLED_COMP, DuAETag.Type.INT );
}

// low-level undocumented method to set a new ID to a controller and returns the id
Duik.Controller.setId = function ( layer ) {
    //wait just a bit to be sure we won't have two identical ids
    $.sleep( 10 );
    var newId = new Date().getTime();
    DuAETag.setValue( layer, DuAETag.Key.DUIK_CONTROLLER_ID, newId );
    return newId
}


/**
 * Gets the controller type according to the (localized) given name, using the synonyms dictionnary
 * @param {string} name The name to look for
 * @param {boolean} [fuzzy=true] Performs a fuzzy search
 * @return {Duik.Controller.Type} The controller type
 */
Duik.Controller.getControllerType = function (name, fuzzy)
{
    fuzzy  = def( fuzzy, true );

    // Dicts are lower case
    name = name.toLowerCase();

    var id = "";
    var score = 32000;

    for (k in Duik.Controller.Name) {
        if (!Duik.Controller.Name.hasOwnProperty(k)) continue;
        for (var i = 0, ni = Duik.Controller.Name[k].length; i < ni; i++)
        {
            var synonym = Duik.Controller.Name[k][i];
            if (!fuzzy && name == synonym) return k;
            else if (fuzzy) {
                var s = DuString.match(synonym, name);
                if (s <= 0) continue;
                if (s >= score) continue;
                if (s < score) {
                    score = s;
                    id = k;
                    break;
                }
            }
        }
    }

    if (id == "") return Duik.Controller.Type.TRANSFORM;

    return id;
}