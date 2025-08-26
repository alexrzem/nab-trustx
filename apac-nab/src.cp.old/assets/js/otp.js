var dispatchData = ()=> {
    var variables = {
        message: 'Success',
        goback: false
    }
    try {
        if (document.getElementById('otp1').value != undefined) {
            let otpString = document.getElementById('otp1').value +
                document.getElementById('otp2').value +
                document.getElementById('otp3').value +
            document.getElementById('otp4').value +
            document.getElementById('otp5').value +
            document.getElementById('otp6').value ;
            variables.otp = otpString;
        }
    } catch (err) {
        console.log("assign otp " + err);
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
    document.getElementById('nextButton').onclick=dispatchData;
    window.addEventListener("message", subscribe, false);
    window.parent.postMessage({event: 'READY'}, '*');
}

var subscribe = (event) => {
    // listen for a TrustX event with label "PROCESS"
    var trustXData = event.data;
}


window.onload = subscribeTrustX;
