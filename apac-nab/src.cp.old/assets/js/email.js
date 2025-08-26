var dispatchData = ()=> {
    var variables = {
        message: 'Success',
        bypass: false
    }
    try {
        if (document.getElementById('email').value != undefined) {
            variables.email = document.getElementById('email').value;
        }
    } catch (err) {
        console.log("assign email " + err);
    }
    try {
        if(document.getElementById('checkbox-mobile').value != undefined){
            variables.bypass = document.getElementById('checkbox-mobile').checked;
        }
    }catch (err) {
        console.log("assign bypass " + err);
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
}


window.onload = subscribeTrustX;
