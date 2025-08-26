function manualEntry() {
    var docSelected = documentFromSelection();
    var outcomeVariables = {
        selectedDocumentType: docSelected,
        isMinor: document.getElementById('checkbox-doc-minor').checked,
        isManual: true,
        hasNoPhotoId: document.getElementById('checkbox-doc-no-primary').checked,
        requiresManual: false,
        requiresAdditional: false,
        goback: false
    }
    if (outcomeVariables.isMinor || outcomeVariables.isManual || outcomeVariables.hasNoPhotoId) {
        outcomeVariables.requiresManual = true;
    }
    if (outcomeVariables.isMinor || (outcomeVariables.isManual && outcomeVariables.selecteDocumentType == "none") || outcomeVariables.hasNoPhotoId) {
        outcomeVariables.requiresAdditional = true;
    }
    console.log("trustX-postMessage: " + JSON.stringify(outcomeVariables));
    window.parent.postMessage({event: 'SEND', variables: outcomeVariables}, '*');
}

function dispatchData() {
    var docSelected = documentFromSelection();
    var outcomeVariables = {
        selectedDocumentType: docSelected,
        isManual: false,
        isMinor: false,
        hasNoPhotoId: false,
        requiresManual: false,
        requiresAdditional: false,
        goback: false
    }
    if (document.getElementById('checkbox-doc-minor') != undefined) {
        outcomeVariables.isMinor = document.getElementById('checkbox-doc-minor').checked;
    }
    if (document.getElementById('checkbox-doc-no-primary') != undefined) {
        outcomeVariables.hasNoPhotoId = document.getElementById('checkbox-doc-no-primary').checked;
    }

    if (outcomeVariables.isMinor || outcomeVariables.isManual || outcomeVariables.hasNoPhotoId) {
        outcomeVariables.requiresManual = true;
    }
    if (outcomeVariables.isMinor || (outcomeVariables.isManual && outcomeVariables.selectedDocumentType == "none") || outcomeVariables.hasNoPhotoId) {
        outcomeVariables.requiresAdditional = true;
    }
    console.log("trustX-postMessage: " + JSON.stringify(outcomeVariables));
    window.parent.postMessage({event: 'SEND', variables: outcomeVariables}, '*');

}

var dispatchBack = ()=> {
    var variables = {
        hasNoPhotoId: false,
        requiresManual: false,
        requiresAdditional: false,
        goback: true
    }
    window.parent.postMessage({event: 'SEND', variables: variables}, '*');
}

function subscribeTrustX() {
    window.addEventListener("message", subscribe, false);
    window.parent.postMessage({event: 'READY'}, '*');
    console.log("subscribed to trustx");
}


function manualReasonSelect(){
    let isChecked = this.checked;
    var docList = document.getElementsByClassName("manual-reason");
    for (const docListKey in docList) {
            docList[docListKey].checked = false;
    }
    this.checked = isChecked;
}

function documentFromSelection() {
    var value = "";
    var docList = document.getElementsByClassName("docSelection");
    for (const docListKey in docList) {
        if (docList[docListKey].checked) {
            return docList[docListKey].value;
        }
    }
    return "none";
}


var subscribe = (event) => {
    // listen for a TrustX event with label "PROCESS"
    var trustXData = event.data;
    var formSource;
    var docTranslate = {};
    var assistedChannels = ["assisted"];
    if (trustXData.variables.constants != undefined && trustXData.variables.constants.assistedChannels != undefined) {
        assistedChannels = trustXData.variables.constants.assistedChannels;
    }
    if (trustXData.variables.constants != undefined && trustXData.variables.constants.docTranslate != undefined) {
        docTranslate = trustXData.variables.constants.docTranslate;
    }
    var channel = "";
    if (trustXData.variables.sessionData && trustXData.variables.sessionData.channel != undefined) {
        channel = trustXData.variables.sessionData.channel;
    }
    if (!assistedChannels.includes(channel)) {
        console.log("channel is " + channel);
        handleAssistedBehaviour();
    }

}

var handleAssistedBehaviour = () => {
    var docList = document.getElementsByClassName("assistedChannelOnly");
    for (const docListKey in docList) {
        try {
            docList[docListKey].style.visibility = 'hidden';
        } catch (err) {

        }
        try {
            docList[docListKey].style.display = "none";
        } catch (err) {

        }
    }
}

window.onload = subscribeTrustX;
