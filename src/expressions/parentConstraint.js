//Duik.parent
function getParentTransform(l, origin, startT, endT) {
    var sT = startT - thisComp.displayStartTime;
    var eT = endT - thisComp.displayStartTime;
    try {
        var pos = l.fromWorld(origin, sT);
    } catch (e) {
        var pos = [0, 0];
    }
    var prevPos = l.toWorld(pos, sT);
    var newPos = l.toWorld(pos, eT);
    return newPos - prevPos;
}
var result = thisLayer.position.valueAtTime(0);
for (var i = 1; i <= thisLayer("Effects").numProperties; i++)
{
    var fx = effect(i);
    if (fx.name.indexOf("Parent constraint") != 0) continue;
    if (!fx(4).value) continue;
    try {
        var parentLayer = fx(1);
    } catch (e) {
        continue;
    }
    if (parentLayer.index == index) continue;
    var moBlurPrecision = fx(7);
    var step = framesToTime(1)/moBlurPrecision;
    var cT = step;
    while (cT <= time)
    {
        var weight = fx(2).valueAtTime(cT - thisComp.displayStartTime) / 100;
        if (weight == 0) continue;
        result += getParentTransform(parentLayer, result, cT - step, cT) * weight;
        result += valueAtTime(cT - thisComp.displayStartTime) - valueAtTime(cT - step - thisComp.displayStartTime);
        cT += step;
    }
}
result;