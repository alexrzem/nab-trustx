/**
 * 
 * TrustX Common Methods
 * 
 */


// Global variables
let usedDocumentList = new Array()
let disableType3Selection = false
// TODO: At some point, refactor PD and JS to avoid using sessionData altogether and only rely on one single idv
let constants = null
let sessionData = null
let idv = null

// consent
let consents = []

// Condition checks
const isAssisted = (assisted) => { return assisted == '1' } // should return true for string and int 1
const isBanker = (role) => { return role === 'banker' }



/**
 * Set up message listener and invoke READY event to TrustX
 */
const subscribeToTrustX = () => {

  console.log('subscribeToTrustX: START')

  // Message listener from TrustX - set TrustX Session var into global variable sessionData
  window.addEventListener('message', subscribe, false);

  // Notify TrustX that Custom UI is ready
  window.parent.postMessage({ event: 'READY' }, '*');
}

// A callback so that other pages can retrieve variables from the PROCESS event without needing to add more logic to trustx.js
let processCallback = undefined;

// Returns consent data
let fetchConsentData = undefined;

// Sticky name flag
let consistentDocumentActive = false;
let consistentDocumentFields = undefined;

// Stores section name for analytics purposes
let analyticsSectionName = undefined;
let analyticsEventType = undefined;

const customisedBrands = [
  'default',
  'wlkogan'
];

/**
 * Message listener from TrustX with label "PROCESS"
 * @param {*} event 
 */
const subscribe = async (event) => {
  console.log('subscribe: START')
  console.debug('subscribe - event: ', event.data.command)

  if (event.data.command === 'PROCESS') {

    // Custom page constants
    constants = event.data.variables.constants
    // Assign session data property with sessionData from TrustX
    sessionData = event.data.variables.sessionData
    // Assign idv with TrustX idv object
    idv = sessionData?.idv
    // Sticky name variable - if true, document data is persisted at the time of loading this CP
    consistentDocumentActive = idv?.consistentDocumentActive

    // Load extra CSS in for specific brand overrides
    // brand information will come from sessionData.idv.config.brand
    if (idv.config?.brand === "wlkogan" && !Array.from(document.getElementsByTagName("link")).some(m => m.href.endsWith('kogan.css'))) {
      const extraCss = document.createElement('link');
      extraCss.href = './assets/css/kogan.css';
      extraCss.type = 'text/css';
      extraCss.rel = 'stylesheet';

      document.getElementsByTagName('head')[0].appendChild(extraCss);
    }

    let brand = idv.config?.brand ?? 'default';

    if (!customisedBrands.includes(brand))
      brand = 'default'

    const allBrandedElements = Array.from(document.getElementsByClassName('branded'));
    const selectedBrandElements = Array.from(document.getElementsByClassName(`brand-${brand}`));

    const elementsToHide = allBrandedElements.filter(m => !selectedBrandElements.includes(m));

    elementsToHide.forEach(m => m.style.display = 'none');
    selectedBrandElements.forEach(m => m.style.display = '');

    if (processCallback && typeof processCallback === 'function') {
      processCallback(sessionData, constants)
    }

    if (fetchConsentData && typeof fetchConsentData === 'function') {
      consents = fetchConsentData()
    }

    if (analyticsSectionName) {
      sendPageOpenAnalyticsEvent(analyticsSectionName, analyticsEventType)
    }


    try {
      if (currentPage === 'PageAdditionalDocument' || currentPage === 'PageDocumentSelection') {
        // Pre-select isOverEighteen based on previously selected value - only for totalAttempt ≥ 1
        if (sessionData.hasOwnProperty('isOverEighteen') && idv.totalAttempt > 0) {
          handleIsOverEighteenRadio(sessionData.isOverEighteen)
        }
      }

      if (currentPage === 'PageAdditionalDocument') {
        // handle supported additional (type 2 and 3) document type
        if (idv.config.hasOwnProperty('supportedAdditionalDocumentTypes')) {
          handleSupportedAdditionalDocumentTypes(idv.config.supportedAdditionalDocumentTypes)
        }
      }
    } catch (error) {
      console.error('subscribe - doc selection handlers exception: ', error)
    }

    // handle OTP attempt
    // if (sessionData.hasOwnProperty('otpCounter')) {
    //   handleOtpCounter(sessionData.otpCounter)
    // }

    // handle usedDocumentList
    if (sessionData.hasOwnProperty('usedDocumentList')) {
      handleUsedDocumentList(sessionData.usedDocumentList)
    }


    // handle dvs attempt
    // if (idv.hasOwnProperty('documentAttempt')) {
    //   handleDocumentAttempt(idv.documentAttempt)
    // }

    if (isCurrentPageAConfirmDetails()) {
      // handle documentAttemptMatrix
      // const selectedDocType = sessionData?.selectedDocType
      // if (selectedDocType) {
      //   const selectedDocTypeAttempt = sessionData?.idv?.documentAttemptMatrix[selectedDocType] ?? 0
      //   console.log(`selectedDocType: ${selectedDocType} | selectedDocTypeAttempt: ${selectedDocTypeAttempt}`)
      //   handleDocumentAttempt(selectedDocTypeAttempt)

      //   // handle data prepopulation
      //   resetInputs();

      //   console.debug('subscribe - prepopulating data from idv')
      //   prepopulateConfirmDetailsField(idv, selectedDocTypeAttempt)
      //   // validate input fields after prepopulate
      //   validateInputFields()
      // }

      const nameRegex = /(firstname|middlename|lastname)$/i
      const dobRegex = /(birth)$/i
      const addressRegex = /(address)/i
      const documentDetailsRegex = /(medicare|birthcertificate|registration|number|expiry|issuing)/i

 

      // Handle consistentDocumentActive
      consistentDocumentFields = idv?.config?.consistentDocumentFields ?? []
      if (consistentDocumentFields.length > 0) {
        for (i in consistentDocumentFields) {
          document.getElementById(consistentDocumentFields[i])?.classList.add('consistentDocumentAware')
          
          // also append consistentDocumentAware to parent's previous siblings
          // document.getElementById(consistentDocumentFields[i])?.parentElement?.previousSibling?.classList?.add('consistentDocumentAwareHide')
        }
      }

      // Sticky name
      if (consistentDocumentActive) {
        // $('.consistentDocumentAware').css('display', 'none')
        $('.consistentDocumentAware').attr('disabled', true)
        // $('.consistentDocumentAwareHide').css('display', 'none')
      }


      // 
      const docTypeBasedOnPageLoaded = pageToSelectedDocTypeMapping(currentPage)
      let selectedDocTypeAttempt = 0
      try {
        selectedDocTypeAttempt = sessionData?.idv?.documentAttemptMatrix[docTypeBasedOnPageLoaded] ?? 0
      } catch(error) {
        console.log(`exception: ${error} - selectedDocTypeAttempt is set to ${selectedDocTypeAttempt} `)
      }
      console.log(`selectedDocType: ${docTypeBasedOnPageLoaded} | selectedDocTypeAttempt: ${selectedDocTypeAttempt}`)
      handleDocumentAttempt(selectedDocTypeAttempt)

      // handle data prepopulation
      resetInputs();

      console.debug('subscribe - prepopulating data from idv')
      prepopulateConfirmDetailsField(idv, selectedDocTypeAttempt)
      // validate input fields after prepopulate
      if (!currentPage.endsWith('Qas'))
        validateInputFields()
    }


    // render special elements, e.g. switches, buttons, etc
    renderOverrides(idv)
  }
}



/**
 * Package input data from the current custom page and proceed to the next activity
 */
const dispatchData = (additionalParams) => {

  // Step 1 - Prepare data

  console.log('dispatchData: START')
  console.log('dispatchData: PREPARING DATA')

  const date = Date.now();

  // Collect inputs in the page
  let inputs = collectInputs()

  // Append inputs with additional paramters
  if (additionalParams != null) {
    inputs = { ...inputs, ...additionalParams }
  }

  // If there's selectedDocumentType or selectedAdditionalDocumentType in the input, we ship it into usedDocumentList
  // 2025-04-01 not used - to be cleaned up in the future
  // if (inputs.hasOwnProperty('selectedDocumentType') || inputs.hasOwnProperty('selectedAdditionalDocumentType')) {
  //   let usedDocument = inputs.selectedDocumentType || inputs.selectedAdditionalDocumentType
  //   usedDocumentList.push(usedDocument)
  //   inputs = { ...inputs, usedDocumentList }

  //   console.debug("usedDocumentList: ", usedDocumentList)
  // }

  if (inputs.hasOwnProperty('documentMedicareValidToNotGreen') && inputs.documentMedicareValidToNotGreen !== "") {
    // rename key
    const medicareValidTo = { documentMedicareValidTo: inputs.documentMedicareValidToNotGreen }
    inputs = { ...inputs, ...medicareValidTo }

    // delete old key
    delete inputs.documentMedicareValidToNotGreen
  }

  // 1. In the manual input flow, we need to inject document type, or else DVS will not run
  // 2. Inject document classification to reflect the actual doc type being submitted or else it just shows the previous document classification
  try {
    if (currentPage) {
      let documentType = ""
      let documentClassification = ""

      switch (currentPage) {
        case 'PageMedicare':
        case 'PageMedicareQas':
          documentType = DOCTYPE_MEDICARE;
          documentClassification = DOCCLASS_MEDICARE;
          break;
        case 'PageBirthCertificate':
        case 'PageBirthCertificateQas':
          documentType = DOCTYPE_BIRTH_CERTIFICATE;
          documentClassification = DOCCLASS_BIRTH_CERTIFICATE;
          break;
        case 'PageCitizenshipCertificate':
          documentType = DOCTYPE_CITIZENSHIP_CERTIFICATE;
          documentClassification = DOCCLASS_CITIZENSHIP_CERTIFICATE;
          break;
        case 'PageCentrelink':
          documentType = DOCTYPE_CENTRELINK;
          documentClassification = DOCCLASS_CENTRELINK;
          break;
        default:
          documentType = '';
          documentClassification = '';
      }

      if (sessionData.hasOwnProperty('isManualInput')) {
        // Drivers License manual input
        const isManualInputDriversLicense = (currentPage === 'PageDriversLicence' || currentPage === 'PageDriversLicenceQas') && sessionData.isManualInput

        if (isManualInputDriversLicense) {
          documentType = DOCTYPE_DRIVERS_LICENSE;
          documentClassification = DOCCLASS_DRIVERS_LICENSE;
        }

        // Passport manual input
        // if (sessionData.hasOwnProperty('selectedDocumentType')) {
        if (sessionData.hasOwnProperty('selectedDocType')) {
          // const isManualInputAuPassport = currentPage === 'PagePassport' && sessionData.selectedDocumentType === 'passport' && sessionData.isManualInput
          // const isManualInputForeignPassport = currentPage === 'PagePassport' && sessionData.selectedDocumentType === 'foreignPassport' && sessionData.isManualInput

          // 2025-04-01 change in the current page for foreign passport page name AND selectedDocumentType to selectedDocType
          const isManualInputAuPassport = (currentPage === 'PagePassport' || currentPage === 'PagePassportQas') && sessionData.selectedDocType === 'passport' && sessionData.isManualInput
          const isManualInputForeignPassport = (currentPage === 'PagePassportForeign' || currentPage === 'PagePassportForeignQas') && sessionData.selectedDocType === 'foreignPassport' && sessionData.isManualInput

          if (isManualInputAuPassport) {
            documentType = DOCTYPE_AU_PASSPORT;
            documentClassification = DOCCLASS_AU_PASSPORT;
          }

          if (isManualInputForeignPassport) {
            documentType = DOCTYPE_FOREIGN_PASSPORT;
            documentClassification = DOCCLASS_FOREIGN_PASSPORT;
          }
        }

      }


      // Finally, construct documentType and documentClassification if necessary
      if (documentType !== "") {
        // Only inject documentType if it's not an empty string
        inputs = { ...inputs, documentType: documentType }
      }

      if (documentClassification !== "") {
        // Only inject documentClassification if it's not an empty string
        inputs = { ...inputs, documentClassification: documentClassification }
      }

    }
  } catch (error) {
    console.error('exception: ', error)
  }

  // 
  // Consents - Handle credit header consent specifically
  if (inputs.hasOwnProperty('isCreditHeaderConsented')) {
    // add credit header consent
    consents['consent_CREDIT_HEADER'] = inputs.isCreditHeaderConsented ? 'Yes': 'No'
  }
  // Consents - Inject captured consents if any
  if (Object.keys(consents).length > 0) {
    inputs = { 
      ...inputs,
      ...consents
    }
  }


  console.debug('dispatchData - inputs: ', inputs)

  const customPageVars = {
    ...inputs,
    timestamp: date,
    message: 'Success'
  }



  // Step 2 - Invoke SEND event
  console.log('dispatchData: DISPATCHING DATA')
  invokeSendEvent(customPageVars);



  // Step 3 - POST SEND event - Reset view
  console.log('dispatchData: POST DISPATCH ACTIVITIES')
  try {
    const page = currentPage

    const DELAY = 1000 // ms

    if (page === 'PageDocumentSelection') {
      delayFunctionRun(DELAY, resetDocumentSelectionView)
    }

    if (page === 'PageAdditionalDocument') {
      delayFunctionRun(DELAY, resetAdditionalDocumentView)
    }

    if (page === 'PageOtp') {
      delayFunctionRun(DELAY, resetOtpFields)
    }

    if (isCurrentPageAConfirmDetails()) {
      delayFunctionRun(DELAY, resetConfirmDetailsView)
    }

  } catch (error) {
    console.error('exception: ', error)
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

/**
 * Prepopulate review details page
 * @param {*} idv 
 * @param {*} documentAttempt 
 * @returns 
 */
const prepopulateConfirmDetailsField = (idv, documentAttempt) => {

  if (currentPage == null) return

  let formSource = null

  // 1. In the first attempt of a OCRable document, we always use the OCRd value (idv.doc)
  if (DOC_TYPE_1_PAGES.includes(currentPage)) {
    formSource = idv.hasOwnProperty('doc') ? idv.doc : null

    // 2. When we arrive at confirm details the second time onwards, use idv.doc2 as it contains edited fields
    if (documentAttempt > 0) {
      formSource = idv.hasOwnProperty('doc2') ? idv.doc2 : idv.doc
    }
  }

  // 3. For non-OCRable documents, use idv.doc2 in documentAttempt>0 whenever available
  // If documentAttempt == 0 (i.e. arrived at form the first time post-additional doc upload), we provide empty fields
  if (DOC_TYPE_2_PAGES.includes(currentPage) && documentAttempt > 0) {
    formSource = idv.hasOwnProperty('doc2') ? idv.doc2 : null
  }

  if (formSource === null) {
    console.error('prepopulateConfirmDetailsField - no data in formSource')
    return
  }

  const dateFields = [
      "documentDateOfBirth",
      "documentRegistrationDate",
      "documentDateOfExpiry",
      "documentMedicareValidToNotGreen"
  ]

  for (key in formSource) {
    // 4. Prepopulate fields with appropriate data
    if (document.getElementById(key)) {
      document.getElementById(key).value = formSource[key];
    }

    if (dateFields.includes(key)) {
      const trustXDate = moment(formSource[key], 'YYYY-MM-DD')
      try {
        document.getElementById(key).value = trustXDate.format('DD/MM/YYYY')
      } catch(error) {
        console.error('prepopulating date exception: ', error)
      }
    }

    // Special mapping for DL documentIssuingState
    // NB-431: need to comment out and replace the id with  documentIssuingState
    // if (key === 'documentIssuingState') {
    //   // Only change documentStateOfIssue when there is an input with id documentStateOfIssue
    //   const documentStateOfIssueEl = document.getElementById('documentStateOfIssue')
    //   if (documentStateOfIssueEl) {
    //     documentStateOfIssueEl.value = formSource[key]
    //   }
    // }
  }
}


/**
 * Handle usedDocumentList to control what document type options are available for selection
 * @param {*} sessionDataUsedDocList 
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
 * Handle OTP counter
 * @param {*} otpCounter 
 */
const handleOtpCounter = (otpCounter) => {
  if (otpCounter > 0) {
    renderOtpNotificationPanel()
  }
}




/**
 * Enable document type listed in the supportedAdditionalDocumentTypes session data
 * @param {*} supportedAdditionalDocumentTypes Doc types supported, supplied in idv.config
 * @returns 
 */
const handleSupportedAdditionalDocumentTypes = (supportedAdditionalDocumentTypes) => {
  if (supportedAdditionalDocumentTypes.length === 0) {
    return
  }

  supportedAdditionalDocumentTypes
    .filter(type => type !== 'birthCertificate') // filter out birthCertificate - it will be determined by over 18 radio on the doc select page
    .forEach((docType) => {
      /**
       * <div>
       *   <div>
       *     <md-radio id='docType'>
       * 
       * We need to set the grandparent element's style display to flex
       */
      const docTypeRadioEl = document.getElementById(docType)
      docTypeRadioEl.parentElement.parentElement.style.display = 'flex'
    })
}


/**
 * Handle isOverEighteen radio. Show under 18 doc type if under 18 is preselected
 * @param {*} isOverEighteen 
 */
const handleIsOverEighteenRadio = (isOverEighteen) => {
  const $under18RadioYesEl = $('md-radio[name=isOverEighteen][id=yes]')
  const $under18RadioNoEl = $('md-radio[name=isOverEighteen][id=no]')

  const showUnder18DocType = () => {
    $under18DocContainerEls.css('display', 'flex')
  }

  if (isOverEighteen) {
    $under18RadioYesEl.prop('checked', true)
    $under18RadioNoEl.prop('checked', false)
  } else {
    $under18RadioYesEl.prop('checked', false)
    $under18RadioNoEl.prop('checked', true)
    showUnder18DocType()
  }
}


/**
 * Check if documentType is in the list of supported document type
 * @param {*} documentType 
 * @returns 
 */
const isDocumentTypeSupported = (documentType)  => {
  return idv.config?.supportedAdditionalDocumentTypes?.includes(documentType)
}


/**
 * Check if a page is confirm details page
 * @param {*} page 
 * @returns true if current page is one of confirm details pages
 */
const isCurrentPageAConfirmDetails = () => {
  try {
    if (!currentPage) {
      return false
    }
    return currentPage === 'PagePassport' || currentPage === 'PagePassportQas' || currentPage === 'PagePassportForeign' || currentPage === 'PagePassportForeignQas' || currentPage === 'PageDriversLicence' || currentPage === 'PageDriversLicenceQas' || currentPage === 'PageMedicare' || currentPage === 'PageMedicareQas' || currentPage === 'PageBirthCertificate' || currentPage === 'PageBirthCertificateQas' ||
      currentPage === 'PageGenericForm';

  } catch (error) {
    console.error('currentPage is undefined, skipping')
    return false
  }
}

/**
 * Reset Document Selection screen after dispatching data
 */
const resetDocumentSelectionView = () => {

  // Uncheck radio
  const radioElements = document.getElementsByClassName('input-radio');
  for (const element of radioElements) {
    if (element.checked) {
      element.checked = false
    }
  }

  // // Disable next buttons
  // const nextButtonElements = document.getElementsByClassName('next-button');
  // for (const element of nextButtonElements) {
  //   element.disabled = true
  // }

  // Scroll to top of page
  window.scrollTo(0,0);
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

  // // Disable next buttons
  // const nextButtonElements = document.getElementsByClassName('next-button');
  // for (const element of nextButtonElements) {
  //   element.disabled = true
  // }

  // Scroll to top of page
  window.scrollTo(0,0);
}


/**
 * Disable next button and scroll to top of page
 */
const resetConfirmDetailsView = () => {
  // // Disable next buttons
  // const nextButtonElements = document.getElementsByClassName('next-button');
  // for (const element of nextButtonElements) {
  //   element.disabled = true
  // }

  // Scroll to top of page
  window.scrollTo(0,0);
}



/**
 * Reset inputs
 * @returns 
 */
const resetInputs = () => {

  const textInputElements = document.getElementsByClassName('input-text');
  const selectInputElements = document.getElementsByClassName('input-select');
  const radioInputElements = document.getElementsByClassName('input-radio');

  const inputElements = [...textInputElements, ...selectInputElements, ...radioInputElements]


  for (const inputEl of inputElements) {
    let classList = inputEl.classList

    if ('input-switch' in classList) {
      inputEl.selected = false;
    }

    if ('input-radio' in classList) {
      inputEl.checked = false;
    }

    inputEl.value = "";
  }
}

/**
 * Reset OTP fields
 * @returns 
 */
const resetOtpFields = () => {
  const otpEl = document.getElementById('otp');
  otpEl.value = ''
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
    dictionary = { ...dictionary, otp: otp }
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

    switch (inputType.toLowerCase()) {
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
        // Handling phone number with no leading 0 - NB-333
        if (inputEl.id === 'phoneNumber') {
          let newPhoneNumber = ''
          const oldPhoneNumber = inputEl.value;
          if (oldPhoneNumber.substring(0,1) !== '0') {
            newPhoneNumber = '0' + oldPhoneNumber
          } else {
            newPhoneNumber = oldPhoneNumber
          }
          value = newPhoneNumber;
        }
        else if (inputEl.hasAttribute('data-trustx-map-date') && inputEl.getAttribute('data-trustx-map-date') === 'true') {
          if (inputEl.value) {
            const nabDate = moment(inputEl.value, 'DD/MM/YYYY')
            value = nabDate.format('YYYY-MM-DD');
          }
        }
        else {
          value = inputEl.value;
        }
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
const renderOverrides = (idv) => {

  console.log('renderOverrides: START')

  if (idv != null) {
    
    // For assisted banker only
    // if (idv.hasOwnProperty('assisted') && idv.hasOwnProperty('role')) {
    if (hasProperty(idv, 'config', 'assisted') && hasProperty(idv, 'config', 'role')) {
      if (isAssisted(idv.config.assisted) && isBanker(idv.config.role)) {
        renderAssistedBankerOverrides()
      }
    }

    // Additional Document Capture

    // For override cases (minor or customers with no photograhic id)
    if (usedDocumentList.length === 0) {
      disableType3Selection = true
    } else {
      // For 0x2 cases entering additional doc capture
      if (idv.lastService?.toLowerCase() === 'dvs' && idv.lastResult?.toLowerCase() === 'no match') {
        // if dvs is no match, check if there was a validated id previously
        disableType3Selection = idv.decider?.idValidated < 1;
      } else {
        // For 1x2 case - Need to explicity set this back to false
        disableType3Selection = false;
      }
    }

    // For additional doc capture, only shows the unsuccessful IDV warning if attemptNo > 0
    try {
      if (currentPage === 'PageDocumentSelection' || currentPage === 'PageAdditionalDocument') {
        if (usedDocumentList.length > 0) {
          showUnsuccessfulIdvError()
        }
      }
    }
    catch (error) {
      console.error('renderOverrides - error: ', error)
    }
    
  } else {
    console.error('renderOverrides - idv is null')
  }
}

/**
 * Delay invocation of a function
 * @param {*} duration The duration of the delay
 * @param {*} func Function that needs to be run on delay
 */
const delayFunctionRun = (duration, func) => {
  setTimeout(() => {
    func()
  }, duration)
}

/**
 * Helper method to map loaded page to selectedDocType
 * @param {*} pageName 
 * @returns 
 */
const pageToSelectedDocTypeMapping = (pageName) => ({
  PagePassport: 'passport',
  PagePassportQas: 'passport',
  PagePassportForeign: 'foreignPassport',
  PagePassportForeignQas: 'foreignPassport',
  PageDriversLicence: 'dl',
  PageDriversLicenceQas: 'dl',
  PageMedicare: 'medicare',
  PageMedicareQas: 'medicare',
  PageBirthCertificate: 'birthCertificate',
  PageBirthCertificateQas: 'birthCertificate'
}[pageName] || 'others');


// UI Dynamic Changes

const renderAssistedBankerOverrides = () => {
  showAssistedBankerOverrides()
  hideAssistedBankerOverrides()
  disablePasswordFields()
}


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

const handleDocumentAttempt = (documentAttempt) => {
  if (documentAttempt > 0) {

    // When we arrive at review details page the second time onwards, we 
    // render notification panel, confirm buttons
    renderConfirmButtonsAndNotificationPanel()
    // We also hide back buttons
    // hideBackButton()
  }
}

const renderConfirmButtonsAndNotificationPanel = () => {
  try {
    const confirmRadioElements = document.getElementsByClassName('radio-confirm');
    const notificationPanelElement = document.getElementById('dvs-fail-panel');
  
    // display notification panel
    notificationPanelElement.style.display = 'flex';
  
    // only render if consistentDocumentActive is false
    if (!consistentDocumentActive) {
      // display confirm buttons
      for (const el of confirmRadioElements) {
        el.style.display = 'flex';
      }
    }
  } catch (error) {
    console.error('renderConfirmButtonsAndNotificationPanel - error: ', error)
  }

}

const renderOtpNotificationPanel = () => {
  try {
    const notificationOtpUnsuccessful = document.getElementById('notification-otp-unsuccessful');
    notificationOtpUnsuccessful.style.display = 'flex'
  } catch (error) {
    console.error('renderOtpNotificationPanel - error: ', error)
  }
}

const hideBackButton = () => {
  try {
    const backButtonElement = document.getElementById('back-button');
    // Change visibility instead of display
    backButtonElement.style.visibility = 'hidden'
  } catch (error) {
    console.error('hideBackButton - exception: ', error)
  }
}

const sendAnalyticsEvent = (event) => {
  window.top.postMessage(event, '*')
}

const sendPageOpenAnalyticsEvent = (section, action, idType, eidvResult) => {
  const event = {
    "eventType": "eidv-interacted",
    "data": {
      "componentName": "Daon eIDV App",
      "section": section,
      "application_id": sessionData?.processInstanceId ?? "unknown",
      "action": action ?? "eidv-progressed"
    }
  };

  if (idType !== undefined)
    event['idType'] = idType;

  if (idType !== undefined)
    event['eidv-result'] = eidvResult

  sendAnalyticsEvent()
}

const sendUserInteractionAnalyticsEvent = (name) => {
  sendAnalyticsEvent({
    "eventType": "user-moment",
    "data": {
      "componentName": "Daon eIDV App",
      "name": name
    }
  })
}


// Subscribe to TrustX onload
window.onload = subscribeToTrustX();
