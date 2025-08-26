
const levenshteinDistance = (s, t) => {
    if (!s.length) return t.length;
    if (!t.length) return s.length;
    const arr = [];
    for (let i = 0; i <= t.length; i++) {
        arr[i] = [i];
        for (let j = 1; j <= s.length; j++) {
            arr[i][j] =
                i === 0
                    ? j
                    : Math.min(
                        arr[i - 1][j] + 1,
                        arr[i][j - 1] + 1,
                        arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
                    );
        }
    }
    return arr[t.length][s.length];
};

var source = {};
var alias = {  documentIssuingState : "documentAddressState" }

var dispatchData = ()=> {
    var variables = {
    }
    var textElements = document.getElementsByClassName("input-text");
    for(docKey in textElements){
        variables[textElements[docKey].id] = textElements[docKey].value;
    }
    var selectElements = document.getElementsByClassName("review-details-select");
    for(docKey in selectElements){
        variables[selectElements[docKey].id] = selectElements[docKey].value;
    }
    let levenshtein = {aggregate : 0,  fieldsAffected: 0 };
    if(Object.keys(source).length > 0){
        for(docKey in variables){
            try{
                if(source[docKey]){
                    var lev = levenshteinDistance(source[docKey], variables[docKey]);
                    if(lev > 0){
                        levenshtein[docKey] = lev;
                        levenshtein.fieldsAffected++;
                        levenshtein.aggregate += lev;
                    }
                }else{
                    // Handle variable is omitted at input
                    var lev = variables[docKey].length;
                    if(lev > 0) {
                        levenshtein[docKey] = lev;
                        levenshtein.fieldsAffected++;
                        levenshtein.aggregate += lev;
                    }
                }
            }catch(err){
                console.log("lev calc err " + err);
            }
        }
        variables.changeSummary = levenshtein;
        variables.action = "CORRECT OCR";
    } else {
        variables.action = "DATA ENTRY";
        variables.documentClassification = "DRIVERS_LICENSE"
        variables.documentType = "Australia Driving License";
    }
    variables.message = "SUCCESS";
    console.log ("postMessage " + JSON.stringify(variables));
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
    let dvsAttempt = 0;

    if(trustXData.variables.sessionData.idv != undefined){
        isIDV = true;
        formSource = trustXData.variables.sessionData.idv.doc;
    }
    if(trustXData.variables.sessionData._iddoc != undefined){
        isIDDOC = true;
        formSource = trustXData.variables.sessionData._iddoc;
    }
    if (trustXData.variables.sessionData.dvsAttempt != undefined){
        dvsAttempt = trustXData.variables.sessionData.dvsAttempt;
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
    if (dvsAttempt > 1) {
        renderElementsAfterFirstAttempt()
    }
}

const renderElementsAfterFirstAttempt = () => {
    const confirmRadioElements = document.getElementsByClassName('radio-confirm');
    const notificationPanelElement = document.getElementById('dvs-fail-panel');

    notificationPanelElement.style.display = 'flex';

    for (const el of confirmRadioElements) {
        el.style.display = 'flex';
    }
}

function populateFromIDV(formSource){
    for(key in formSource){
        if(document.getElementById(key) != undefined) {
            if (formSource[key] == undefined) {
                document.getElementById(key).value = "";

            }else {
                document.getElementById(key).value = formSource[key];
                source[key] = formSource[key];
            }
        }else if(alias[key] != undefined && document.getElementById(alias[key]) != undefined){
            document.getElementById(alias[key]).value = formSource[key];
            source[alias[key]] = formSource[key];
        }

    }
}

function populateFromIDDOC(formSource){

}


var requireConfirm = () => {
    const docList = document.getElementsByClassName('require-confirm');
    for(docKey in docList){
        try {
            docList[docKey].style.visibility = 'visible';
        }catch (err){

        }
        try{
            docList[docKey].style.display = "inline";
        }catch(err){

        }
    }
}

window.onload = subscribeTrustX;