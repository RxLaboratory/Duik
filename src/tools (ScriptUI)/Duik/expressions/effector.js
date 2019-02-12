//Duik.effector
var fx = null;
var result = value;

try
{
    var ctrl = effect( "Rotation Effector" )( 1 );
    fx = ctrl.effect( "Effector" );
}
catch ( e )
{}

// Get layer world position
function p ( l )
{
    return l.toWorld( l.anchorPoint )
};

function effector ()
{
    var min = fx( 1 ).value;
    var max = fx( 2 ).value;
    var mode = fx( 3 ).value;
    var type = fx( 5 ).value;
    var reverse = fx( 6 ).value;
    var channel = 4;
    var map = null;
    try
    {
        map = effect( "Rotation Effector" )( 1 ).effect( "Map" )( 1 );
    }
    catch ( e )
    {}

    if ( mode == 2 ) //line
    {
        max = min;
        min = 0;
        reverse = !reverse;
    }
    else if ( mode == 3 )
    {
        min = 0;
        max = 1;
    }

    var distance = effectorDistance( max, mode, channel );
    return effectorValue( distance, min, max, type, reverse );

}

function effectorDistance ( max, mode, map, channel )
{
    var distance = 0;

    var worldPos = p( thisLayer );

    if ( mode == 1 ) //circle
    {
        distance = length( worldPos, p( ctrl ) );
    }
    else if ( mode == 2 ) //line
    {
        var coords = ctrl.fromWorld( worldPos );
        distance = -coords[ 0 ] + max / 2;
    }
    else if ( mode == 3 && map ) //map
    {
        if ( typeof channel === "undefined" ) channel = 4;
        var colorPoint = map.fromWorld( worldPos );
        var color = map.sampleImage( colorPoint );
        if ( channel < color.length && channel >= 0 ) distance = color[ channel ];
        else distance = color[ 0 ];
    }

    return distance;
}

function effectorValue ( distance, min, max, type, reverse )
{
    var t = 0;
    var beginTime = key( 1 ).time;
    var endTime = key( numKeys ).time;

    if ( type == 1 )
    {
        if ( !reverse ) t = linear( distance, min, max, endTime, beginTime );
        else t = linear( distance, min, max, beginTime, endTime );
    }
    else
    {
        var mid = ( min + max ) / 2;
        if ( !reverse )
        {
            if ( distance > mid ) t = linear( distance, mid, max, endTime, beginTime );
            else t = linear( distance, min, mid, beginTime, endTime );
        }
        else
        {
            if ( distance > mid ) t = linear( distance, mid, max, beginTime, endTime );
            else t = linear( distance, min, mid, endTime, beginTime );
        }
    }
    return valueAtTime( t );
}

result = ( fx && numKeys >= 2 ) ? effector() : result;
