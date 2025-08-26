function documentFromSelection(){
    var value = "";
    var docList = document.getElementsByClassName("docSelection");
    for (const docListKey in docList) {
        if(docList[docListKey].checked){
            return docList[docListKey].value;
        }
    }
    return "none";
}

var dispatchData = () => {
    var docSelected = documentFromSelection();
    var outcomeVariables = {
        goback: false,
        selectedDocumentType:  docSelected
    }
    console.log("trustX-postMessage: " + outcomeVariables)
    window.parent.postMessage({ event: 'SEND', variables: outcomeVariables }, '*');
}


var dispatchBack = () => {
    var outcomeVariables = {
        goback: true
    }
    console.log("trustX-postMessage: " + outcomeVariables)
    window.parent.postMessage({ event: 'SEND', variables: outcomeVariables }, '*');
}


var subscribe = (event) => {
    // listen for a TrustX event with label "PROCESS"
    console.log("subscribe: START");
    var trustXData = event.data;
    var formSource;
    var docTranslate = {};
    var changeOfNameFlowTypes = ["demo-name-change-1"];
    var assistedChannels = ["assisted"];
    if(trustXData.variables.constants  != undefined && trustXData.variables.constants.assistedChannels != undefined){
        try{
            assistedChannels = JSON.parse(trustXData.variables.constants.assistedChannels);
        }catch(err){
            assistedChannels = trustXData.variables.constants.assistedChannels;
        }
        console.log("assistedChannel detected " + JSON.stringify(assistedChannels));
    }
    if(trustXData.variables.constants  != undefined && trustXData.variables.constants.docTranslate != undefined){
        docTranslate = trustXData.variables.constants.docTranslate;
    }
    if(trustXData.variables.constants != undefined && trustXData.variables.constants.changeOfNameFlowTypes != undefined){
        changeOfNameFlowTypes = trustXData.variables.constants.changeOfNameFlowTypes;
        console.log("changeOfNameFlowTypes detected " + JSON.stringify(changeOfNameFlowTypes));
    }
    let channel = "";
    let flowType = "";
    if(trustXData.variables.sessionData && trustXData.variables.sessionData.channel != undefined){
        channel = trustXData.variables.sessionData.channel;
        console.log("channel dectected " + channel);
    }
    if(!assistedChannels.includes(channel)){
        console.log("subscribe: is Not Assisted");
        // handleAssistedBehaviour();
    }
    if(trustXData.variables.sessionData && trustXData.variables.sessionData.flowType != undefined){
        flowType = trustXData.variables.sessionData.flowType;
        console.log("flowType dectected " + flowType);
    }
    if(changeOfNameFlowTypes.includes(flowType)){
        console.log("subscribe: is Change of Name");
        handleChangeOfName();
    }

}

function subscribeTrustX(){
    console.log("subscribeToTrustX:start");
    window.addEventListener("message", subscribe, false);
    window.parent.postMessage({ event: 'READY' }, '*');
}

var handleAssistedBehaviour = () => {
    console.log("handleAssistedBehaviour:START");
    var docList = document.getElementsByClassName("assistedChannelOnly");
    for (const docListKey in docList) {
        try {
            docList[docListKey].style.visibility = 'hidden';
        }catch (err){

        }
        try{
            docList[docListKey].style.display = "none";
        }catch(err){

        }
    }
}


var validateForm = () => {

}
var handleChangeOfName = () => {
    console.log("handleChangeOfName:START");
    var docList = document.getElementsByClassName("change-of-name-only");
    for (const docListKey in docList) {
        try {
            docList[docListKey].style.visibility = 'visible';
        }catch (err){

        }
        try{
            docList[docListKey].style.display = "block";
        }catch(err){

        }
    }
    var docList = document.getElementsByClassName("not-change-of-name");
    for (const docListKey in docList) {
        try {
            docList[docListKey].style.visibility = 'hidden';
        }catch (err){

        }
        try{
            docList[docListKey].style.display = "none";
        }catch(err){

        }
    }
}
const showType3DocumentList = () => {
    const $type3DocList = $('#type-3-doc-list')
    $type3DocList.css('display', 'block')
}

window.onload = subscribeTrustX;
