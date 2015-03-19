#include libDuik.jsxinc

var rig = Duik.utils.prepIK(app.project.activeItem.selectedLayers);

alert(rig.type);

if (rig.controller !=null)
{
    alert("controller: " + rig.controller.name);
    }

if (rig.layer1 !=null)
{
    alert("root: " + rig.layer1.name);
    }

if (rig.layer2 !=null)
{
    alert("middle: " + rig.layer2.name);
    }

if (rig.layer3 !=null)
{
    alert("end: " + rig.layer3.name);
    }

if (rig.goal !=null)
{
    alert("goal: " + rig.goal.name);
    }
