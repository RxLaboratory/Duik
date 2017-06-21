{

function getStringFromFolder(folder){
if(folder == null){
    return "NULL";
    }
else {
    return folder.toString();
    }
};

var debug = 
    "Folder.appData="+ getStringFromFolder(Folder.appData)+"\n"  
    +"Folder.appPackage="+ getStringFromFolder(Folder.appPackage)+"\n"  
    +"Folder.commonFiles="+ getStringFromFolder(Folder.commonFiles)+"\n"  
    +"Folder.current="+ getStringFromFolder(Folder.current)+"\n"  
    +"Folder.desktop="+ getStringFromFolder(Folder.desktop)+"\n"  
    +"Folder.myDocuments="+ getStringFromFolder(Folder.myDocuments)+"\n"  
    +"Folder.startup="+ getStringFromFolder(Folder.startup)+"\n"  
    +"Folder.trash="+ getStringFromFolder(Folder.trash)+"\n"  
    +"Folder.system="+ getStringFromFolder(Folder.system)+"\n"  
    +"Folder.userData="+ getStringFromFolder(Folder.userData)+"\n"   //  <------ troublemaker!
    +"Folder.temp="+ getStringFromFolder(Folder.temp)+"\n"  
    +"Folder.fs="+ getStringFromFolder(Folder.fs) +"\n" ;
    
   alert(debug); 
}

