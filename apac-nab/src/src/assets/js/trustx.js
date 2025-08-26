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
let pageIdType = undefined;
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
      if (typeof pageIdType === 'undefined' || pageIdType === null) {
        // variable is undefined
        console.log('Invoking without page id type')
        sendPageOpenAnalyticsEvent(analyticsSectionName, analyticsEventType)
      } else if (pageIdType) {        
        console.log('page ID Type ' + pageIdType)
        sendPageOpenAnalyticsEvent(analyticsSectionName, analyticsEventType, pageIdType)
      }
      
    }


    try {
      if (currentPage === 'PageAdditionalDocument' || currentPage === 'PageDocumentSelection') {
        // Pre-select isOverEighteen based on previously selected value - only for totalAttempt ≥ 1
        if (sessionData.hasOwnProperty('isOverEighteen') && idv.totalAttempt > 0) {
          handleIsOverEighteenRadio(sessionData.isOverEighteen)
        }

        // Pre-select idVerifiedOnline based on previously selected value - only for totalAttempt ≥ 1
        if (sessionData.hasOwnProperty('idVerifiedOnline') && idv.totalAttempt > 0) {
          handleIdVerifiedOnline(sessionData.idVerifiedOnline)
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


    if (isCurrentPageAConfirmDetails()) {
      const nameRegex = /(firstname|middlename|lastname)$/i
      const dobRegex = /(birth)$/i
      const addressRegex = /(address)/i
      const documentDetailsRegex = /(medicare|birthcertificate|registration|number|expiry|issuing)/i

 
      // Handle consistentDocumentActive
      consistentDocumentFields = idv?.config?.consistentDocumentFields ?? []
      if (consistentDocumentFields.length > 0) {
        for (i in consistentDocumentFields) {
          document.getElementById(consistentDocumentFields[i])?.classList.add('consistentDocumentAware')
          
          if (nameRegex.test(consistentDocumentFields[i])) {
            document.getElementById("documentNameHeader")?.classList.add('consistentDocumentAware')

            // NB-578
            // if (currentPage === 'PageMedicare') {
            //   document.getElementById("medicareMiddleNameRadioContainer")?.classList.add('consistentDocumentAware')
            // }
          }

          if (dobRegex.test(consistentDocumentFields[i])) {
            document.getElementById("documentDateOfBirthHeader")?.classList.add('consistentDocumentAware')
          }

          if (addressRegex.test(consistentDocumentFields[i])) {
            document.getElementById("documentAddressHeader")?.classList.add('consistentDocumentAware')
          }
          
        }
      }

      // Sticky name
      if (consistentDocumentActive) {
        const isHidden = idv?.config?.consistentDocumentHide ?? false
        if (isHidden)
          $('.consistentDocumentAware').css('display', 'none')
        else
          $('.consistentDocumentAware').attr('disabled', true)
      }

      // 
      const docTypeBasedOnPageLoaded = pageToSelectedDocTypeMapping(currentPage)
      let selectedDocTypeAttempt = 0
      try {
        selectedDocTypeAttempt = sessionData?.idv?.documentAttemptMatrix[docTypeBasedOnPageLoaded].totalAttempts ?? 0
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

function normalizeNames(data) {
  const hasRequiredKeys =
    data &&
    Object.prototype.hasOwnProperty.call(data, "documentFirstName") &&
    Object.prototype.hasOwnProperty.call(data, "documentMiddleName") &&
    Object.prototype.hasOwnProperty.call(data, "documentLastName");

  if (!hasRequiredKeys) {
    return data; // return as-is if keys are missing
  }

  // Create a shallow copy so original data is not mutated
  const updated = { ...data };

  // Rule 1
  if (
    updated.documentFirstName === "" &&
    updated.documentMiddleName === "" &&
    updated.documentLastName !== ""
  ) {
    updated.documentFirstName = "-";
    updated.documentMiddleName = "";
  }
  // Rule 2
  else if (
    updated.documentLastName === "" &&
    updated.documentMiddleName === "" &&
    updated.documentFirstName !== ""
  ) {
    updated.documentLastName = updated.documentFirstName;
    updated.documentFirstName = "-";
    updated.documentMiddleName = "";
  }

  console.log('Normalized Names ' + JSON.stringify(updated))

  return updated;
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

  try {
    inputs = normalizeNames(inputs)
  } catch(error) {
    console.log('Error when normalizing Names')
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

      // NB-616 - populate middleName with medicareMiddleName
      // NB-644 - no longer needed as documentMiddleName is now present alongside documentMedicareMiddleName when medicare used as primary doc
      // if (currentPage === 'PageMedicare') {
      //   const medicareMiddleName = inputs.documentMedicareMiddleName ?? ""
      //   inputs = { ...inputs, documentMiddleName: medicareMiddleName }
      // }

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

  if (inputs.hasOwnProperty('explicitIdvConsentCapture') && inputs.explicitIdvConsentCapture) {
    // add credit header consent
    consents['consent_ELECTRONIC_IDV'] = inputs.consentIdVerifiedOnline ? 'Yes': 'No' // only no if consent is explicity denied
    consents['consent_CREDIT_HEADER']  = inputs.consentIdVerifiedOnline ? 'Yes': 'No' // implicit in the eIDV consent

    if (inputs.consentIdVerifiedOnline)
      inputs.isCreditHeaderConsented = 'true'
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

  console.log('Custome Page Vars :  : : ' + JSON.stringify(customPageVars))
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
 * NEW Prepopulate review details page
 * @param {*} idv 
 * @param {*} documentAttempt 
 * @returns 
 */
const prepopulateConfirmDetailsField = (idv, documentAttempt) => {

  if (currentPage == null) return

  let formSource = null
  const navigatedFromDocSelection = idv?.navigatedFromDocSelection ?? false

  // 1. For type 1 document, we check navigatedFromDocSelection flag if true, we arrive from doc selection, so always use OCR
  if (DOC_TYPE_1_PAGES.includes(currentPage)) {
    if (navigatedFromDocSelection)
      formSource = idv.hasOwnProperty('doc') ? idv.doc : idv.doc2
    else
      formSource = idv.hasOwnProperty('doc2') ? idv.doc2 : idv.doc
  }

  // 2. For non-OCRable documents, use idv.doc2 in documentAttempt>0 whenever available
  // If documentAttempt == 0 (i.e. arrived at form the first time post-additional doc upload), we provide empty fields
  //    also if consistentDocumentActive then we populate the form with stashedDetails 
  // if (DOC_TYPE_2_PAGES.includes(currentPage) && (documentAttempt > 0 || consistentDocumentActive)) {
  //   formSource = idv.hasOwnProperty('doc2') ? idv.doc2 : null
  // }

  if (DOC_TYPE_2_PAGES.includes(currentPage) && idv?.hasOwnProperty('doc2')) {

    // NB-576
    if (consistentDocumentActive) {
      // Only prepopulate the items, ie. listed in consistentDocumentFields
      formSource = Object.fromEntries(
        Object.entries(idv?.doc2).filter(([key]) => consistentDocumentFields.includes(key))
      )
    }
   
    if (documentAttempt > 0) {
      formSource = idv?.doc2
    }
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
  }
}

/**
 * OLD Prepopulate review details page
 * @param {*} idv 
 * @param {*} documentAttempt 
 * @returns 
 */
const prepopulateConfirmDetailsField_ = (idv, documentAttempt) => {

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
  //    also if consistentDocumentActive then we populate the form with stashedDetails 
  // if (DOC_TYPE_2_PAGES.includes(currentPage) && (documentAttempt > 0 || consistentDocumentActive)) {
  //   formSource = idv.hasOwnProperty('doc2') ? idv.doc2 : null
  // }

  if (DOC_TYPE_2_PAGES.includes(currentPage) && idv?.hasOwnProperty('doc2')) {

    // NB-576
    if (consistentDocumentActive) {
      // Only prepopulate the items, ie. listed in consistentDocumentFields
      formSource = Object.fromEntries(
        Object.entries(idv?.doc2).filter(([key]) => consistentDocumentFields.includes(key))
      )
    }
   
    if (documentAttempt > 0) {
      formSource = idv?.doc2
    }
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
 * Handle isOverEighteen radio. Show under 18 doc type if under 18 is preselected
 * @param {*} isOverEighteen 
 */
const handleIdVerifiedOnline = (idVerifiedOnline) => {
  const $idVerifiedOnlineRadioYesEl = $('md-radio[name=idVerifiedOnline][id=onlineYes]')
  const $idVerifiedOnlineRadioNoEl = $('md-radio[name=idVerifiedOnline][id=onlineNo]')

  if (idVerifiedOnline) {
    $idVerifiedOnlineRadioYesEl.prop('checked', true)
    $idVerifiedOnlineRadioNoEl.prop('checked', false)
  } else {
    $idVerifiedOnlineRadioYesEl.prop('checked', false)
    $idVerifiedOnlineRadioNoEl.prop('checked', true)
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
          value = inputEl?.value?.trim();
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
    // NB-591/DE267784 - remote all the notification panel
    // try {
    //   if (currentPage === 'PageDocumentSelection' || currentPage === 'PageAdditionalDocument') {
    //     if (usedDocumentList.length > 0) {
    //       showUnsuccessfulIdvError()
    //     }
    //   }
    // }
    // catch (error) {
    //   console.error('renderOverrides - error: ', error)
    // }
    
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
  const navigatedFromDocSelection = idv?.navigatedFromDocSelection ?? false

  // NB-625 - sheet only appearing if document attempt has been made and we are not navigating from doc selection

  // For NB-737 
  if (documentAttempt > 0) {
    console.log('DocAtt : ' + documentAttempt)
    showChangeIdButton()
  }

  if (documentAttempt > 0 && !navigatedFromDocSelection) {

    // When we arrive at review details page the second time onwards, we 
    // render notification panel, confirm buttons
    // renderConfirmButtonsAndNotificationPanel()
    // We also hide back buttons
    //hideBackButton()

    console.log('Inside trustx.js before callling Identification failed')
     //NB-709
    try {
        console.log('Invoking Doc Capture Failed Event')
        sendPageOpenAnalyticsEvent("document-capture-failed") //NB-709                
    } catch(error) {
        console.log('Failed to send page open analytics doccapfld event:' + error)
    }

    // 2025-04-15 - Popup
    showSheet(
      'Identification Failed',
      [
          'We are unable to process your ID document. Please review your captured ID details and try again. \
          Alternatively, you may use a different ID document type.'
      ],
      { label: 'Retry', onclick: closeSheet },
      { label: 'Change ID document type', onclick: changeDocumentType },
      { name: 'error', theme: 'danger' }
    )
  }
}

function changeDocumentType() {
  sendUserInteractionAnalyticsEvent('eIDV|Change ID document type')
  closeSheet()
  dispatchBack()
}

const renderConfirmButtonsAndNotificationPanel = () => {
  try {
    const confirmRadioElements = document.getElementsByClassName('radio-confirm');
    const notificationPanelElement = document.getElementById('dvs-fail-panel');
  
    // display notification panel
    // NB-591/DE267784 - remote all the notification panel
    // notificationPanelElement.style.display = 'flex';
  
    // NB-594 and NB-587 - figma alignment, remove confirm buttons altogether
    // only render if consistentDocumentActive is false
    // if (!consistentDocumentActive) {
    //   // display confirm buttons
    //   for (const el of confirmRadioElements) {
    //     el.style.display = 'flex';
    //   }
    // }
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

const showChangeIdButton = () => {
  try {
    const backButtonElement = $('.back-button-text');
    backButtonElement.css('visibility', 'visible'); 
  } catch (error) {
    console.error('showChangeIdButton - exception: ', error)
  }
}

const handleFieldBlurAndRecordErrorForAnalytics = (analyticsSectionName) => {
  $(".input-text, .input-select, md-radio").on("blur", (event) => {
    if(event.target.error){
      if(analyticsSectionName){
        //console.log('Analytics Section Name : ' + analyticsSectionName + ', Target ID : ' + event.target.id + ', Error Text : ' + event.target.errorText)
        sendFieldErrorAnalyticsEvent(analyticsSectionName,event.target.id, event.target.errorText)
      }
    }
  })
}

const sendAnalyticsEvent = (event) => {

  const brand = sessionData.idv?.config?.brand ?? 'default';
  if(brand.trim().toLowerCase() === "nab") {
    window.top.postMessage(event, '*')

    const hasSwitchedToMobile = idv?.hasSwitchedToMobile ?? false // NB-671
  
    if (hasSwitchedToMobile && idv.config.analyticsurl != null) {
      const newIframe = document.createElement('iframe')
      newIframe.style.display = 'none';
      newIframe.className = 'analytics-iframe'
  
      newIframe.src = idv.config.analyticsurl + "?eventType=" + event.eventType
  
      if (event.data.action)
        newIframe.src += '&action=' + event.data.action
  
      if (event.data.section)
        newIframe.src += '&section=' + event.data.section
  
      // NB-682
      const analyticsApplicationIdentifier = idv?.config?.analyticsApplicationIdentifier ?? null
      if (analyticsApplicationIdentifier) {
        newIframe.src += '&application_id=' + idv?.config[analyticsApplicationIdentifier]
      } else {
        newIframe.src += '&application_id='
      }
  
      //NB-690
      if(event.data.name)
        newIframe.src += "&name=" + event.data.name
      if(event.data.formName)
        newIframe.src += "&formName=" + event.data.formName
  
      // if (event.data.application_id)
      //   newIframe.src += '&application_id=' + event.data.application_id
  
      if (event.data.idType)
        newIframe.src += '&idType=' + event.data.idType
      
      //Wrapping in a try catch, just in case it doesnt break any testing
      try {
        if(event.data.products)
          newIframe.src += "&products=" + event.data.products  
        if(event.data.componentName)
          newIframe.src += "&componentName=" + event.data.componentName  
        if(event.data['eidv-result'])
          newIframe.src += "&eidv-result=" + event.data['eidv-result']              
      } catch(error) {
        console.log('sending analytics err for products,componentName,eidv-result : ' + error)
      }  
          
      // NB-654
      if (sessionData.idv?.config?.nabMid)
        newIframe.src += '&nab_mid=' + sessionData.idv?.config?.nabMid
  
      // NB-654 - env placeholder
      const analyticsEnv = sessionData.idv?.config?.analyticsEnv ?? 'prod'
      newIframe.src += '&env=' + analyticsEnv
  
      //NB-699
      //errorType, fieldId, error
      if (event.data.errorType)
        newIframe.src += '&errorType=' + event.data.errorType
      if (event.data.fieldId)
        newIframe.src += '&fieldId=' + event.data.fieldId
      if (event.data.error)
        newIframe.src += '&error=' + event.data.error
  
      console.log('alt ev:' + newIframe.src) //NB-711 Remove
      document.body.appendChild(newIframe)
    }
  } else {
    console.log('wsae')
  }
}

const requiresAAProducts = (section, productSections) => {
  for(let i = 0; i < productSections.length; i++){
    if(productSections[i].toLowerCase() === section.toLowerCase()){
      return true;
    }
  }
  return false;
}

const sendPageOpenAnalyticsEvent = (section, action, idType, eidvResult) => {

  // NB-665
  const analyticsApplicationIdentifier = idv?.config?.analyticsApplicationIdentifier ?? null

  const event = {
    "eventType": "eidv-interacted",
    "data": {
      "componentName": "Daon eIDV App",
      "section": section,
      // "application_id": analyticsApplicationIdentifier ? idv?.config[analyticsApplicationIdentifier] : "", // NB-682
      "action": action ?? "eidv-progressed"
    }
  };

  const analyticsFormNameIdentifier = idv?.config?.analyticsFormNameIdentifier ?? null 
  if (analyticsFormNameIdentifier) {
    event.data.formName = idv.config[analyticsFormNameIdentifier]
  }   

  const analyticsProductIdentifer = idv?.config?.analyticsProductIdentifier ?? null
  if(analyticsProductIdentifer) {
    const analyticsProductsSections = idv?.config?.analyticsProductsSections ?? ''
    if(requiresAAProducts(section, analyticsProductsSections.split(','))){
      event.data.products = idv.config[analyticsProductIdentifer]
    }
  }  

  if (idType !== undefined)
    event['data']['idType'] = idType;

  if (idType !== undefined)
    event['data']['eidv-result'] = eidvResult

  console.log('##POA Ev : ' + JSON.stringify(event)) //NB-709
  sendAnalyticsEvent(event)
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

const sendFieldErrorAnalyticsEvent = (section, fieldName, error) => {
  let event = {
    "eventType": "eidv-interacted",
    "data": {
      "componentName": "Daon eIDV App",
      "section":section,
      "errorType": "field",
      "fieldId": fieldName,
      "error": error,
      "action": "error-displayed"
    }
  }
  const analyticsFormNameIdentifier = idv?.config?.analyticsFormNameIdentifier ?? null
  if (analyticsFormNameIdentifier) {
    event.data.formName = idv.config[analyticsFormNameIdentifier]
  }
  sendAnalyticsEvent(event)
}


// Subscribe to TrustX onload

window.onload = subscribeToTrustX();
