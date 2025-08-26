
var dispatchData = ()=> {
    var variables = {
        message: 'Success'
    }
    try {
        if (document.getElementById('firstName').value != undefined) {
            variables.documentFirstName = document.getElementById('firstName').value;
        }
    } catch (err) {
        console.log("assign firstName " + err);
    }
    try {
        if (document.getElementById('middleName').value != undefined) {
            variables.documentMiddleName = document.getElementById('middleName').value;
        }
    } catch (err) {
        console.log("assign middleName " + err);
    }
    try {
        if (document.getElementById('lastName').value != undefined) {
            variables.documentLastName = document.getElementById('lastName').value;
        }
    } catch (err) {
        console.log("assign lastName " + err);
    }
    try {
        if (document.getElementById('state').value != undefined) {
            variables.documentStateOfIssue = document.getElementById('state').value;
        }
    } catch (err) {
        console.log("assign state " + err);
    }
    try {
        if (document.getElementById('input-dob').value != undefined) {
            variables.documentDateOfBirth = document.getElementById('input-dob').value
        }
    } catch (err) {
        console.log("assign dateOfBirth " + err);
    }
    try {
        if (document.getElementById('input-doe').value != undefined) {
            variables.documentDateOfIssue = document.getElementById('input-doe').value
        }
    } catch (err) {
        console.log("assign dateOfIssue " + err);
    }
    try {
        if (document.getElementById('registrationNumber').value != undefined) {
            variables.documentRegistrationNumber = document.getElementById('registrationNumber').value
        }
    } catch (err) {
        console.log("assign input-doe " + err);
    }
    try {
        if (document.getElementById('documentNumber').value != undefined) {
            variables.documentNumber = document.getElementById('documentNumber').value
        }
    } catch (err) {
        console.log("assign input-doe " + err);
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
