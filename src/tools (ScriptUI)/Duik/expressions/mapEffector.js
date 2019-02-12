//Duik.effector
var fx = null;
var ctrl = null;
var result = value;

try
{
    ctrl = effect( "Rotation Effector" )( 1 );
    fx = ctrl.effect( "Effector" );
}
catch ( e )
{}

// Get layer world position
function p ( l )
{
    return l.toWorld( l.anchorPoint )
}

function effector ()
{
    var min = fx( 2 ).value;
    var max = fx( 3 ).value;
    var reverse = fx( 4 ).value;
    var channel = fx( 1 ).value;

    min = min / 100;
    max = max / 100;

    var distance = effectorDistance( max, mode, channel );
    return effectorValue( distance, min, max, reverse );

}

function effectorDistance ( channel )
{
    var distance = 0;

    var worldPos = p( thisLayer );

    if ( typeof channel === "undefined" ) channel = 4;
    var colorPoint = ctrl.fromWorld( worldPos );
    var color = ctrl.sampleImage( colorPoint );
    if ( channel < color.length && channel >= 0 ) distance = color[ channel ];
    else distance = color[ 0 ];

    return distance;
}

function effectorValue ( distance, min, max, reverse )
{
    var t = 0;
    var beginTime = key( 1 ).time;
    var endTime = key( numKeys ).time;

    if ( !reverse ) t = linear( distance, min, max, endTime, beginTime );
    else t = linear( distance, min, max, beginTime, endTime );

    return valueAtTime( t );
}

result = ( fx && numKeys >= 2 ) ? effector() : result;
