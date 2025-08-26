/**
 * 
 * TrustX Common Methods
 * 
 */

// TODO: clean up

// Session variables from TrustX
let trustXSessionVars = null
let usedDocumentList = new Array()
let disableType3Selection = false

/**
 * Set up message listener and invoke READY event to TrustX
 */
const subscribeToTrustX = () => {

  console.log('subscribeToTrustX: START')

  // Message listener from TrustX - set TrustX Session var into global variable trustXSessionVars
  window.addEventListener('message', subscribe, false);

  // Notify TrustX that Custom UI is ready
  window.parent.postMessage({ event: 'READY' }, '*');
}

/**
 * Message listener from TrustX with label "PROCESS"
 * @param {*} event 
 */
const subscribe = async (event) => {
  console.log('subscribe: START')
  console.debug('subscribe - event: ', event.data.command)

  if (event.data.command === 'PROCESS') {
    trustXSessionVars = event.data;

    const sessionData = trustXSessionVars.variables.sessionData
    
    // handle usedDocumentList
    if (sessionData.hasOwnProperty('usedDocumentList')) {
      handleUsedDocumentList(sessionData.usedDocumentList)
    }

    if (sessionData.hasOwnProperty('dvsAttempt')) {
      handleDvsAttempt(sessionData.dvsAttempt)
    }

    if (isCurrentPageAConfirmDetails()) {
      if (sessionData.hasOwnProperty('idv') && sessionData.hasOwnProperty('confirmDetailsCounter')) {
        resetInputs();
        console.log('prepopulating data - confirmDetailsCounter: ', sessionData.confirmDetailsCounter)
        prepopulateConfirmDetailsField(sessionData.idv, sessionData.confirmDetailsCounter)
      }
    }


    // render special elements
    renderOverrides(sessionData)
  }
}


/**
 * Package input data from the current custom page and proceed to the next activity
 */
const dispatchData = (additionalParams) => {
  console.log('dispatchData: START')

  const date = Date.now();

  // Collect inputs in the page
  let inputs = collectInputs()

  // Append inputs with additional paramters
  if (additionalParams != null) {
    inputs = {...inputs, ...additionalParams}
  }

  // If there's selectedDocumentType or selectedAdditionalDocumentType in the input, we ship it into usedDocumentList
  if (inputs.hasOwnProperty('selectedDocumentType') || inputs.hasOwnProperty('selectedAdditionalDocumentType')) {
    let usedDocument = inputs.selectedDocumentType || inputs.selectedAdditionalDocumentType
    usedDocumentList.push(usedDocument)
    inputs = {...inputs, usedDocumentList}

    console.log("usedDocumentList: ", usedDocumentList)
  }

  // In the manual input flow, we need to inject document type, or else DVS will not run
  try {
    if (currentPage) {
      let documentType = ''
  
      switch(currentPage) {
        case 'PageMedicare':
          documentType = DOCTYPE_MEDICARE;
          break;
        case 'PageBirthCertificate':
          documentType = DOCTYPE_BIRTH_CERTIFICATE;
          break;
        case 'PageCitizenshipCertificate':
          documentType = DOCTYPE_CITIZENSHIP_CERTIFICATE;
          break;
        case 'PageCentrelink':
          documentType = DOCTYPE_CENTRELINK;
          break;
        default:
          documentType = '';
      }
  
      if (documentType !== "") {
        // Only inject documentType if it's not an empty string
        inputs = {...inputs, documentType: documentType}
      }
  
    }
  } catch (error) {
    console.error('currentPage does not exist, skipping')
  }

  

  // If selectedAdditionalDocumentType is present, send additional doc json for the Select Additional Document activity to use
  // if (inputs.hasOwnProperty('selectedAdditionalDocumentType')) {
  //   let additionalDocJson = null

  //   switch (inputs.selectedAdditionalDocumentType) {
  //     case 'medicare':
  //       additionalDocJson = additionalDocMedicare;
  //       break;
  //     case 'birthCertificate':
  //       additionalDocJson = additionalDocBirthCert;
  //       break;
  //     default:
  //       additionalDocJson = additionalDocumentJson;
  //   }

  //   inputs = {
  //     ...inputs, 
  //     additionalDocuments: JSON.stringify(additionalDocJson)
  //   }
  // }


  console.debug('dispatchData - inputs: ', inputs)

  const customPageVars = {
    ...inputs,
    timestamp: date,
    message: 'Success'
  }

  // Invoke SEND event
  invokeSendEvent(customPageVars);

  // Reset view
  try {
    const page = currentPage
    if (page === 'PageAdditionalDocument') {
      console.log('currentPage: ', page)
      resetAdditionalDocumentView();
    }

    if (page === 'PageOtp') {
      console.log('currentPage: ', page)
      resetOtpFields();
    }


  } catch (error) {
    console.error('currentPage is undefined, skipping')
  }

}

/**
 * Invoke postMessage SEND event to TrustX to push data and continue to the next activity
 * @param {*} variables 
 */
const invokeSendEvent = (variables) => {
  console.log('invokeSendEvent: START')
  console.log('invokeSendEvent - variables: ', variables)
  window.parent.postMessage({ event: 'SEND', variables: variables }, '*');
}




// ##### Utility methods

const prepopulateConfirmDetailsField = (idv, confirmDetailsCounter) => {

  if (idv.hasOwnProperty('doc2') || idv.hasOwnProperty('doc')) { // only prepopulate if doc or doc2 exists
    
    // 1. In the beginning use data from doc
    let formSource = idv.hasOwnProperty('doc') ? idv.doc : null

    if (confirmDetailsCounter > 1) {
      // 2. if we arrive at a confirm details the second time onwards, use idv.doc2
      formSource = idv.hasOwnProperty('doc2') ? idv.doc2 : idv.doc
    }
    
    if (formSource === null) {
      console.error('prepopulateConfirmDetailsField - no data in formSource')
      return
    }

    for (key in formSource) {
      // 3. Prepopulate fields with a previously stored data
      if (document.getElementById(key)) {
        document.getElementById(key).value = formSource[key];
      }
    }
  }

}


/**
 * Handle usedDocumentList to control what document type options are available for selection
 * @param {*} sessionData 
 */
const handleUsedDocumentList = (sessionDataUsedDocList) => {
  // for some reason, empty usedDocumentList comes from TrustX as "" need to convert this into an empty array
  if (sessionDataUsedDocList == "") { // not exact ===
    usedDocumentList = new Array()
  } else {
    usedDocumentList = sessionDataUsedDocList
  }

  // For document selection pages only
  disablePreviouslySelectedDocType(usedDocumentList)
}

/**
 * Check if a page is confirm details page
 * @param {*} page 
 * @returns true if current page is one of confirm details pages
 */
const isCurrentPageAConfirmDetails = () => {
  try {
    if (!currentPage) {
      return
    }
    return currentPage === 'PagePassport' || currentPage === 'PageDriversLicence' || currentPage === 'PageMedicare' || currentPage === 'PageBirthCertificate' ||
            currentPage === 'PageGenericForm';

  } catch (error) {
    console.error('currentPage is undefined, skipping')
  }
}


/**
 * Reset view after dispatching data
 */
const resetAdditionalDocumentView = () => {
  // Reset tooltip
  const tooltipEl = document.getElementById('tooltip')
  tooltipEl.style.display = 'none'

  // Reset doctype 3 list
  const $type3DocList = $('#type-3-doc-list')
  $type3DocList.css('display', 'none')

  // Uncheck radio
  const radioElements = document.getElementsByClassName('input-radio');
  for (const element of radioElements) {
    if (element.checked) {
      element.checked = false
    }
  }

  // Disable next buttons
  const nextButtonElements = document.getElementsByClassName('next-button');
  for (const element of nextButtonElements) {
    element.disabled = true
  }
}

/**
 * Reset OTP fields
 * @returns 
 */
const resetInputs = () => {

  const textInputElements = document.getElementsByClassName('input-text');
  const selectInputElements = document.getElementsByClassName('input-select');
  const radioInputElements = document.getElementsByClassName('input-radio');

  const inputElements = textInputElements
                          .push(...selectInputElements)
                          .push(...radioInputElements)


  for (const inputEl of inputElements) {
    let key = inputEl.id;
    let value = null;
    
    switch(inputType.toLowerCase()) {
      case 'switch':
        inputEl.selected = false;
        break;
      case 'radio':
        inputEl.checked = false;
        break;
      default:
        inputEl.value = "";
    }
  }
}

/**
 * Reset OTP fields
 * @returns 
 */
const resetOtpFields = () => {
  const inputElements = document.getElementsByClassName('input-otp');
  for (const inputEl of inputElements) {
    inputEl.value = ''
  }
}

/**
 * Collect all inputs from a custom UI
 * @returns 
 */

const collectInputs = () => {
  console.log('collectInputs: START');

  let dictionary = {}
  dictionary = collectInputsByClass('input-text', 'text', dictionary);
  dictionary = collectInputsByClass('input-checkbox', 'checkbox', dictionary);
  dictionary = collectInputsByClass('input-switch', 'switch', dictionary);
  dictionary = collectInputsByClass('input-select', 'select', dictionary);
  dictionary = collectInputsByClass('input-radio', 'radio', dictionary);

  const otp = collectOtpInputs();
  if (otp !== '') {
    dictionary = {...dictionary, otp: otp}
  }

  return dictionary
}

/**
 * Collect inputs by class
 * @param {*} className 
 * @param {*} inputType 
 * @param {*} inputDictionary 
 * @returns 
 */
const collectInputsByClass = (className, inputType, inputDictionary) => {
  const inputElements = document.getElementsByClassName(className);

  for (const inputEl of inputElements) {
    let key = inputEl.id;
    let value = null;
    
    switch(inputType.toLowerCase()) {
      case 'checkbox':
        value = inputEl.checked;
        break;
      case 'switch':
        value = inputEl.selected;
        break;
      case 'radio':
        if (inputEl.checked) {
          key = inputEl.name;
          value = inputEl.value;
        }
        break;
      default:
        value = inputEl.value;
    }

    if (value !== null) {
      inputDictionary = {
        ...inputDictionary,
        [key]: value
      }
    }
  }
  return inputDictionary
}

/**
 * Used in OTP screen to consolidate otp digits
 * @returns
 */
const collectOtpInputs = () => {
  const inputElements = document.getElementsByClassName('input-otp');
  
  let otp = '';

  for (const inputEl of inputElements) {
    const value = inputEl.value
    otp += value
  }
  return otp
}

/**
 * Parse UI override parameters
 * @returns UI override dictionary
 */
const renderOverrides = (sessionData) => {

  console.log('renderOverrides: START')

  if (sessionData != null) {
    console.log('renderOverrides - sessionData ', sessionData)

    // For assisted banker only
    if (sessionData.channel?.toLowerCase() === 'assisted' && sessionData.role?.toLowerCase() === 'banker') {
      showAssistedBankerOverrides()
      hideAssistedBankerOverrides()
      disablePasswordFields()
    }

    // Additional Document Capture
    
    // For override cases (minor or customers with no photograhic id)
    if (usedDocumentList.length === 0) {
      disableType3Selection = true
    } else {
      // For 0x2 cases entering additional doc capture
      if (sessionData.idvLastService.toLowerCase() === 'dvs' && sessionData.idvLastResult.toLowerCase() === 'no match') {
        // if dvs is no match, check if there was a validated id previously
        disableType3Selection = sessionData.decider?.idValidated < 1;
      } else {
        // For 1x2 case - Need to explicity set this back to false
        disableType3Selection = false;
      }
    }

    console.log('renderOverrides - disableType3Selection ', disableType3Selection)

    // For additional doc capture, only shows the unsuccessful IDV warning if attemptNo > 0
    if (usedDocumentList.length > 0) {
      showUnsuccessfulIdvError()
    }

  } else {
    console.error('renderOverrides - sessionData is null')
  }
}


// UI Dynamic Changes

const disablePreviouslySelectedDocType = (usedDocumentList) => {
  if (usedDocumentList.length === 0) {
    return
  }

  usedDocumentList.forEach(element => {
    const disabledElement = document.getElementById(element)
    disabledElement.disabled = true

    const labelElements = document.getElementsByClassName('document-type-label')
    for (const el of labelElements) {
      if (el.htmlFor == element) {
        el.classList.add('document-type-label-disabled')
      }
    }
  });
}

const handleOtherDocTypeButton = () => {
  console.log('handleOtherDocTypeButton: START')
  console.log('disableType3Selection? ', disableType3Selection)
  if (disableType3Selection) showOtherDocumentTypeTooltip()
  else showType3DocumentList()
}

const showOtherDocumentTypeTooltip = () => {
  const tooltipEl = document.getElementById('tooltip')
  tooltipEl.style.display = 'block'
}

const showType3DocumentList = () => {
  const $type3DocList = $('#type-3-doc-list')
  $type3DocList.css('display', 'block')
}

const showAssistedBankerOverrides = () => {
  const assistedBankerElements = document.getElementsByClassName('assistedBanker');

  if (assistedBankerElements) { // check for thruthy-ness
    for (const el of assistedBankerElements) {
      el.style.display = 'flex';
    }
  }
}

const hideAssistedBankerOverrides = () => {
  const assistedBankerDisappearElements = document.getElementsByClassName('assistedBankerDisappear');

  if (assistedBankerDisappearElements) { // check for thruthy-ness
    for (const el of assistedBankerDisappearElements) {
      el.style.display = 'none';
    }
  }
}

const showUnsuccessfulIdvError = () => {
  const notificationIdvUnsuccessful = document.getElementById('notification-idv-unsuccessful');
  notificationIdvUnsuccessful.style.display = 'flex'
}

const disablePasswordFields = () => {

  if (currentPage !== 'PagePasswordStub') return

  const assistedBankerDisableElements = document.getElementsByClassName('assistedBankerDisable');
  const assistedBankerPasswordDisable = document.getElementById('assistedBankerPasswordDisable');

  // Disable inputs
  for (const el of assistedBankerDisableElements) {
    el.disabled = true;
  }

  // Grey out the container area
  assistedBankerPasswordDisable.style.background = '#ddd';
  assistedBankerPasswordDisable.style.margin = '-8px';
  assistedBankerPasswordDisable.style.padding = '8px';
}

const handleDvsAttempt = (dvsAttempt) => {
  if (dvsAttempt > 1) {
    renderConfirmButtonsAndNotificationPanel()
  }
}

const renderConfirmButtonsAndNotificationPanel = () => {
  const confirmRadioElements = document.getElementsByClassName('radio-confirm');
  const notificationPanelElement = document.getElementById('dvs-fail-panel');

  // display notification panel
  notificationPanelElement.style.display = 'flex';

  // display confirm buttons
  for (const el of confirmRadioElements) {
      el.style.display = 'flex';
  }
}


// Subscribe to TrustX onload
window.onload = subscribeToTrustX();
