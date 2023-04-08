(function() {

    //#include "inc/api_all.jsxinc"
    //DuAEF.init("Duik tests", "RxLaboratory", "0.0.0");
    //DuAEF.enterRunTime();

    //Duik.Tool.editExpression();
    //Duik.Tool.reloadExpressions();
    var folder = new Folder('X:/');
    try { folder.execute(); }
    catch(e) {alert(e);}
    finally {alert('not ok');}
    alert('ok');
})();