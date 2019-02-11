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
    var mode = fx( 1 ).value;
    var min = fx( 3 ).value;
    var max = fx( 4 ).value;
    var map = null;
    var channel = fx( 8 ).value;
    var type = fx( 11 ).value;
    var reverse = fx( 12 ).value;

    try
    {
        map = fx( 7 );
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

    var distance = effectorDistance( max, mode, map, channel );
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
        if ( typeof channel === "undefined" ) channel = 7;
        var colorPoint = map.fromWorld( worldPos );
        var color = map.sampleImage( colorPoint );
        if (channel < 4) distance = color[ channel ];
        else if (channel == 7 && color.length == 4) distance = color[ 3 ];
        else if (channel == 7) distance = 1;
        else if (channel == 4)
        {
            color = rgbToHsl( color );
            distance = color[ 0 ]
        }
        else if (channel == 5)
        {
            color = rgbToHsl( color );
            distance = color[ 1 ]
        }
        else if (channel == 6)
        {
            color = rgbToHsl( color );
            distance = color[ 2 ]
        }
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
