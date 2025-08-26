var dispatchData = ()=> {
    var variables = {
        message: 'Success',
        bypass: false,
        goback: false,
        useEmail: false
    }
    try {
        if (document.getElementById('phone').value != undefined) {
            variables.phone = document.getElementById('phone').value;
        }
    } catch (err) {
        console.log("assign firstName " + err);
    }
    try{
        if(document.getElementById('checkbox-mobile').value != undefined){
            variables.bypass = document.getElementById('checkbox-mobile').value;
        }
    }catch(err){
        console.log("assign Bypass OTP " + err);
    }
    try{
        if(document.getElementById('checkbox-use-email').value != undefined){
            variables.useEmail = document.getElementById('checkbox-use-email').checked;
        }
    }catch(err){
        console.log("assign use email " + err);
    }
    window.parent.postMessage({event: 'SEND', variables: variables}, '*');
}

var dispatchBack = ()=> {
    var variables = {
        message: 'Success',
        bypass: false,
        goback: true
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
    var assistedChannels = ["assisted"];
    var assistedFlowTypes = ["demo-name-change-1"];
    if(trustXData.variables.constants  != undefined && trustXData.variables.constants.assistedChannels != undefined){
        let assisted = trustXData.variables.constants.assistedChannels;
        try{
            assistedChannels = JSON.parse(assisted);
        }catch(err){
            assistedChannels = assisted;
        }
    }
    if(trustXData.variables.constants  != undefined && trustXData.variables.constants.assistedFlows != undefined){
        let assisted = trustXData.variables.constants.assistedFlows;
        try{
            assistedFlowTypes = JSON.parse(assisted);
        }catch(err){
            assistedFlowTypes = assisted;
        }
    }

    var channel = "";
    var flowType = "";
    if(trustXData.variables.sessionData && trustXData.variables.sessionData.channel != undefined){
        channel = trustXData.variables.sessionData.channel;
    }
    if(!assistedChannels.includes(channel)){
        handleAssistedBehaviour();
    }


    if(trustXData.variables.sessionData && trustXData.variables.sessionData.flowType != undefined){
        flowType = trustXData.variables.sessionData.flowType;
    }
    if(!assistedFlowTypes.includes(flowType)){
        handleAssistedBehaviour();
    }

}

var handleAssistedBehaviour = () => {
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

window.onload = subscribeTrustX;
