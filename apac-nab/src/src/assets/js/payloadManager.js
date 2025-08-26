var payloadIndex = {};

var pagesIndex = {};


const initialise = () => {
    fetch("./assets/resource/sources.json").then((response) => response.json()).then((json) => {
            pagesIndex = json;
            console.log(pagesIndex);
            var pageSelect = document.getElementById("pageSelect");
            for(kv in pagesIndex.uis){
                //docSelect.options[docSelect.options.length] = new Option(kv.label, kv.resource);
                let opt = document.createElement("option");
                opt.text = pagesIndex.uis[kv].label;
                opt.value = pagesIndex.uis[kv].resource;
                //opt.disabled = true;
                pageSelect.add(opt, null);
            }
            //docSelect.options

    });
    fetch("./assets/resource/payloads.json").then((response) => response.json()).then((json) => {
        payloadIndex = json;
        console.log(payloadIndex);
        var docSelect = document.getElementById("docSelect");
        for(kv in payloadIndex.payloads){
            let opt = document.createElement("option");
            opt.text = payloadIndex.payloads[kv].name;
            opt.value = payloadIndex.payloads[kv].name;
            //opt.disabled = true;
            docSelect.add(opt, null);
        }
    }).catch((err)=> {
        console.log(err);
    } );
}

function loadPage(){
    var iframe = document.getElementById("iframe");
    iframe.src = document.getElementById("pageSelect").value;
}

function sendSomeData(){
    var message = emulate(document.getElementById("docSelect").value);
    console.log(JSON.stringify(message));
    logger.innerHTML = logger.innerHTML + "<li>" + JSON.stringify(message) + "</li>";
    var targetFrame = window.frames[0];
    targetFrame.postMessage(message,"*");
}

function emulate(value){
    let payload = payloadIndex.payloads;
    for(kp in payload){
        if(value === payload[kp].name){
            return payload[kp].data;
        }
    }
}

function toggleLog(){
     if(logger.style.display === "none"){
         logger.style.display = "block";
     }else{
         logger.style.display = "none";
     }
}

function waitForReady(){
    window.addEventListener("message", subscribeToReady, false);
    var logger = document.getElementById("logger");
}

function subscribeToReady(event) {

    console.log(event);
    logger.innerHTML = logger.innerHTML + "<li>" + JSON.stringify(event.data) +  "</li>";
    if(event.data.event == "READY"){
        document.getElementById("btnSendData").removeAttribute("disabled");
    }else if(event.data.event == "SEND"){
        console.log(event);
        var send = JSON.stringify(event.data);
        var variabled = event.data.variables;
        document.getElementById('sendData').innerText = send;
        document.getElementById("btnSendData").addAttribute("disabled");
    }
}


waitForReady();