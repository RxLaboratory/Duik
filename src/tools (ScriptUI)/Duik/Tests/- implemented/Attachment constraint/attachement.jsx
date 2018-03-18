/**
* Adds an attachment constraint to a layer
* @param {Layer} layer - The layer
*/
DuAEF.Duik.Rigging.attachmentConstraint = function (layer)
{
	var options = DuAEF.DuAE.Layer.addPseudoEffect(layer,DuAEF.Duik.PseudoEffects.ATTACHMENT_OPTIONS,DuAEF.Duik.PseudoEffectsMatchNames.ATTACHMENT_OPTIONS,'::: Attachment options');
	var effect1 = DuAEF.DuAE.Layer.addPseudoEffect(layer,DuAEF.Duik.PseudoEffects.ATTACHMENT,DuAEF.Duik.PseudoEffectsMatchNames.ATTACHMENT,'Attachment');
	var effect2 = DuAEF.DuAE.Layer.addPseudoEffect(layer,DuAEF.Duik.PseudoEffects.ATTACHMENT,DuAEF.Duik.PseudoEffectsMatchNames.ATTACHMENT,'Attachment');

	if (layer.parent != null)
	{
		var comp = layer.containingComp;
		var time = comp.time;
		comp.time = 0;
		var parent = layer.parent;
		layer.parent = null;
		layer.effect(DuAEF.Duik.PseudoEffectsMatchNames.ATTACHMENT)(1).setValue(parent.index);
		comp.time = time;
	}

	layer.position.expression = '//Duik.attachment\n' +
						'function getParentTransform(l,origin,sF,eF)\n' +
						'{\n' +
						'var sT = framesToTime(sF);\n' +
						'var eT = framesToTime(eF);\n' +
						'var pos = l.fromWorld( origin , sT ) ;\n' +
						'var prevPos = l.toWorld( pos , sT );\n' +
						'var newPos =  l.toWorld( pos , eT );\n' +
						'return newPos - prevPos;\n' +
						'}\n' +
						'var result = toWorld(anchorPoint,0);\n' +
						'var totalWeights = 0;\n' +
						'var translation = [0,0,0];\n' +
						'var normalize = effect("::: Attachment options")(1).value;\n' +
						'for (var i = 1 ; i <= thisLayer("Effects").numProperties ; i++)\n' +
						'{\n' +
						'var fx = effect(i);\n' +
						'if (fx.name.indexOf("Attachment") != 0) continue;\n' +
						'if (!fx(4).value) continue;\n' +
						'try { var parentLayer = fx(1); } catch (e){ continue; }\n' +
						'if (parentLayer.index == index) continue;\n' +
						'weight = fx(2).value / 100;\n' +
						'if (weight == 0) continue;\n' +
						'totalWeights += weight;\n' +
						'translation += getParentTransform( parentLayer , result , 0 , timeToFrames() )*weight;\n' +
						'}\n' +
						'if (totalWeights > 0 && normalize) result += translation/totalWeights;\n' +
						'else result += translation;\n' +
						'if (thisLayer.hasParent) result = thisLayer.parent.fromWorld(result);\n' +
						'result;';

	layer.rotation.expression = '//Duik.attachment\n' +
						'function o(l,t)\n' +
						'{\n' +
						'if (t == undefined) t = time;\n' +
						'var r = 0;\n' +
						'r += l.rotation.valueAtTime(t);\n' +
						'while(l.hasParent)\n' +
						'{\n' +
						'l = l.parent;\n' +
						'r += l.rotation.valueAtTime(t);\n' +
						'}\n' +
						'return r;\n' +
						'}\n' +
						'var result = value;\n' +
						'var totalWeights = 0;\n' +
						'var translation = 0;\n' +
						'var normalize = effect("::: Attachment options")(1).value;\n' +
						'for (var i = 1 ; i <= thisLayer("Effects").numProperties ; i++)\n' +
						'{\n' +
						'var fx = effect(i) ;\n' +
						'if (fx.name.indexOf("Attachment") != 0) continue;\n' +
						'if (!fx(5).value) continue;\n' +
						'try { var l = fx(1); } catch (e){ continue; }\n' +
						'if (l.index == index) continue;\n' +
						'var w = fx(2).value/100;\n' +
						'if (w == 0) continue;\n' +
						'totalWeights += w;\n' +
						'var P = o(l);\n' +
						'var oP = o(l,0);\n' +
						'translation += (P - oP)*w;\n' +
						'}\n' +
						'if (totalWeights > 0 && normalize) result += translation/totalWeights;\n' +
						'else result += translation;\n' +
						'result;';


}
