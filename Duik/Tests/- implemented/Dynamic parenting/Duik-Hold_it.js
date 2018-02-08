var calque = effect("Parent")(1);
var lien = effect("Follow")(1);

function p(layer,t)
{
	if (!t) t = time;
    return layer.toWorld(layer.anchorPoint,t);
}

var result = value;

if (lien.numKeys > 0)
{
	var pK = lien.nearestKey(time);
	var pI = pK.index;
	if (pK.time > time) pI = pK.index-1;
	
	var result = value;
	
	for (var i = pI;i>0;i--)
	{
		var k = lien.key(i);
		var t = time;
		if (i != pI) t = lien.key(i+1).time;
		if (k.value)
		{
			var P = p(calque,t);
			var oP = p(calque,k.time);
			result += P;
			result -= oP;
		}
	}
}
else if (lien.value) 
{
	var P = p(calque);
	var oP = p(calque,0);
	result += P;
	result -= oP;
}
result;