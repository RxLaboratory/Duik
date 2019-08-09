//Duik.Wheel
var fx = thisLayer.effect("Wheel");
var R = fx(1);
var Rev = fx(2);
var curved = fx(3) == 2;
var moBlurPrecision = fx(4).value;

function pos(t) {
    return thisLayer.toWorld(thisLayer.anchorPoint, t);
}
var result = 0;
if (R > 0) {
    var distance = 0;
    if (curved) {
        var start = thisLayer.inPoint > thisComp.displayStartTime ? thisLayer.inPoint : thisComp.displayStartTime;
        var end = time < thisLayer.outPoint ? time : thisLayer.outPoint;
        var step = framesToTime(1)/moBlurPrecision;
        var cT = start;
        while (cT <= end)
        {
            if (pos(cT+step)[0] - pos(framesToTime(i))[0] > 0) distance += length(pos(cT+step), pos(cT));
            else distance -= length(pos(cT+step), pos(cT));
            cT += step;
        }
    } else {
        distance = pos(time)[0];
    }
    result = radiansToDegrees(distance / R);
}
Rev == 1 ? value - result : value + result;