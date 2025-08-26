function dispatchData(){
    var outcomeVariables = {
              message: 'Success'
    }
    window.parent.postMessage({ event: 'SEND', variables: outcomeVariables }, '*');
}

function subscribeTrustX(){
    window.addEventListener("message", subscribe, false);
    window.parent.postMessage({ event: 'READY' }, '*');
}


function subscribe(event){
    // listen for a TrustX event with label "PROCESS"
    
}

const togglePrivacyNotification = () => {
    isPrivacyOpen = !isPrivacyOpen
    isElectronicCommOpen = false
    isDeclarationOfAccuracyOpen = false
    isInternetBankingOpen = false
    const $privacy = $('#consent-privacy')
    const display = isPrivacyOpen ? 'block' : 'none'
    $privacy.css('display', display)
    const $electronic = $('#consent-electronic')
    const edisplay = isElectronicCommOpen ? 'block' : 'none'
    $electronic.css('display', edisplay);
    const $terms = $('#consent-terms-and-conditions')
    const tdisplay = isInternetBankingOpen ? 'block' : 'none'
    $terms.css('display', tdisplay);
    const $accurate = $('#consent-accurate-information')
    const adisplay = isDeclarationOfAccuracyOpen ? 'block' : 'none'
    $accurate.css('display', adisplay);
}



const toggleDeclaration = (me) =>{
    let docs = document.getElementsByClassName("doc-overlay");
    for(dockey in docs){
        if(docs[dockey].id === me){
            let displayValue = docs[dockey].display == 'none' ? 'block': 'none';
            let z = docs[dockey].zIndex <= 0 ? 1 : -1;
            docs[dockey].display = displayValue;
            docs[dockey].zIndex = z;
            console.log("set " + dockey + "==" + me + " " + displayValue + " " + z);
        }else{
            docs[dockey].zIndex = -1;
            docs[dockey].display = 'none';
            console.log("set " + dockey + " "  + docs[dockey].display + " " + docs[dockey].zIndex);
            console.log(docs[dockey].innerHTML);
        }
    }
}

const toggleElectronicCommunication = () => {
    isPrivacyOpen = false
    isDeclarationOfAccuracyOpen = false
    isInternetBankingOpen = false
    isElectronicCommOpen = !isElectronicCommOpen
    const $electronic = $('#consent-electronic')
    const edisplay = isElectronicCommOpen ? 'block' : 'none'
    const ezindex = $electronic.zIndex
    $electronic.css('display', edisplay);
    $electronic.css('zindex', (-1*ezindex));
    const $privacy = $('#consent-privacy')
    const pzindex = $privacy.zIndex;
    const display = isPrivacyOpen ? 'block' : 'none'
    $privacy.css('display', display);
    $privacy.css('zindex', (-1*pzindex));
    const $terms = $('#consent-terms-and-conditions')
    const tdisplay = isInternetBankingOpen ? 'block' : 'none'
    const tzindex = $terms.zIndex;
    $terms.css('display', tdisplay);
    $terms.css('zindex'), (-1*tzindex);
    const $accurate = $('#consent-accurate-information')
    const azindex = $accurate.zIndex;
    const adisplay = isDeclarationOfAccuracyOpen ? 'block' : 'none'
    $accurate.css('display', adisplay);
    $accurate.css('zindex', (-1*azindex));
}


const toggleDeclarationOfAccurracy = () => {
    isPrivacyOpen = false
    isDeclarationOfAccuracyOpen = !isDeclarationOfAccuracyOpen
    isInternetBankingOpen = false
    isElectronicCommOpen = false
    const $electronic = $('#consent-electronic')
    const edisplay = isElectronicCommOpen ? 'block' : 'none'
    $electronic.css('display', edisplay);
    const $privacy = $('#consent-privacy')
    const display = isPrivacyOpen ? 'block' : 'none'
    $privacy.css('display', display);
    const $terms = $('#consent-terms-and-conditions')
    const tdisplay = isInternetBankingOpen ? 'block' : 'none'
    $terms.css('display', tdisplay);
    const $accurate = $('#consent-accurate-information')
    const adisplay = isDeclarationOfAccuracyOpen ? 'block' : 'none'
    $accurate.css('display', adisplay);
}

const toggleTerms = () =>{
    isPrivacyOpen = false
    isDeclarationOfAccuracyOpen = false
    isInternetBankingOpen = !isInternetBankingOpen
    isElectronicCommOpen = false
    const $electronic = $('#consent-electronic')
    const edisplay = isElectronicCommOpen ? 'block' : 'none'
    $electronic.css('display', edisplay);
    const $privacy = $('#consent-privacy')
    const display = isPrivacyOpen ? 'block' : 'none'
    $privacy.css('display', display);
    const $terms = $('#consent-terms-and-conditions')
    const tdisplay = isInternetBankingOpen ? 'block' : 'none'
    $terms.css('display', tdisplay);
    const $accurate = $('#consent-accurate-information')
    const adisplay = isDeclarationOfAccuracyOpen ? 'block' : 'none'
    $accurate.css('display', adisplay);
}