
var dispatchData = ()=> {
    var variables = {
        message: 'Success'
    }
    var textElements = document.getElementsByClassName("input-text");
    for(docKey in textElements){
        variables[textElements[docKey].id] = textElements[docKey].value;
    }
    var selectElements = document.getElementsByClassName("review-details-select");
    for(docKey in selectElements){
        variables[selectElements[docKey].id] = selectElements[docKey].value;
    }
    window.parent.postMessage({event: 'SEND', variables: variables}, '*');
}


var subscribeTrustX = () =>  {
    window.addEventListener("message", subscribe, false);
    window.parent.postMessage({event: 'READY'}, '*');
}

var subscribe = (event) => {
    // listen for a TrustX event with label "PROCESS"
    var trustXData = event.data;
    var formSource;
    let isIDV = false;
    let isIDDOC = false;
    if(trustXData.variables.sessionData.idv != undefined){
        isIDV = true;
        formSource = trustXData.variables.sessionData.idv.doc;
    }
    if(trustXData.variables.sessionData._iddoc != undefined){
        isIDDOC = true;
        formSource = trustXData.variables.sessionData._iddoc;
    }
    var sourceData = formSource;
    if (trustXData.command = 'PROCESS') {
        console.log("event:" + JSON.stringify(trustXData));
        console.log("variables:" + JSON.stringify(trustXData.variables));
        console.log("sessionData:" + JSON.stringify(trustXData.variables.sessionData));
        console.log("idv:" + JSON.stringify(sourceData));
        if(isIDV){
            populateFromIDV(formSource);
        }
        if(isIDDOC){
            populateFromIDDOC(formSource);
        }
    }
}


window.onload = subscribeTrustX;
