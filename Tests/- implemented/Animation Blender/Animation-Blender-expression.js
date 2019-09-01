var ctrl = comp("vraie anim").layer("anims");
var loop = ctrl.effect("Event LoopOut")(1).value;
var blendingDuration = ctrl.effect("Event Blending")(1).value;
var blendingEasing = ctrl.effect("Blending Ease | Linear")(1).value;

function getAnim(ind)
{
	anim = time;

	var animStartTime = ctrl.marker.key(ind).time;
	var animName = ctrl.marker.key(ind).comment;
	var animMarker = null;
	try { animMarker = thisComp.marker.key(animName); } catch(e) {}

	if (animMarker)
	{
		var start = animMarker.time;
		var end = animMarker.time + animMarker.duration;
		var dur = animMarker.duration;
		anim = linear(time, animStartTime , animStartTime + dur, start, end);
		//=========== LOOP ==========
		if (loop)
		{
			var loopNumber = Math.ceil((time-animStartTime)/dur);
			if (loopNumber > 1) anim =  linear(time,animStartTime+dur*(loopNumber-1), animStartTime+dur*loopNumber,start,end);
		}//loop
	}//layer
	return valueAtTime(anim);
}//function getAnim

result = valueAtTime(0);

if (ctrl.marker.numKeys > 0) {
	//find previous marker
	var currentMarker = ctrl.marker.nearestKey(time).index;
	if (ctrl.marker.key(currentMarker).time > time) currentMarker--;

	if (currentMarker > 0)
	{
		var animA = getAnim(currentMarker);
		result = animA;
		//========== BLEND ANIMS ========
		if (blendingDuration != 0)
		{
			//find marker before
			var prevMarker = currentMarker -1;
			animB = value;
			if (prevMarker > 0)
			{
				var markerTime = ctrl.marker.key(currentMarker).time;
				//if no loop, check if anim is still going on
				if (!loop)
				{
					var prevMarkerTime = ctrl.marker.key(prevMarker).time;
					var prevMarkerName = ctrl.marker.key(prevMarker).comment;
					var animMarker = null;
					try { animMarker = thisComp.marker.key(prevMarkerName); } catch(e) {}
					if (animMarker)
					{
						var prevDuration = animMarker.duration;
						var prevEndTime = animMarker.time + prevDuration;
						var maxBlendingDuration = prevEndTime-markerTime;
						if (maxBlendingDuration < 0) blendingDuration = 0;
						else if (maxBlendingDuration < blendingDuration) blendingDuration = maxBlendingDuration;
					}// layer
				}// !loop

				if (blendingDuration != 0)
				{
					//get prev anim
					animB = getAnim(prevMarker);
					//blend
					if (blendingEasing) result = linear(time,markerTime , markerTime+blendingDuration, animB, animA);
					else result = ease(time,markerTime , markerTime+blendingDuration, animB, animA);
				}
			}//prevMarker
		}//blending

	}//currentMarker
	else //if we're before the first marker
	{
		currentMarker++;
		markerName = ctrl.marker.key(currentMarker).comment;
		var animMarker = null;
		try { animMarker = thisComp.marker.key(animName); } catch(e) {}
		if (animMarker) result = valueAtTime(animMarker.time);
	}
}//marker.numKeys
result;
