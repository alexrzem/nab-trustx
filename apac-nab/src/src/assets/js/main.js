// Common JS

// Progress side dashboard
const nav = document.getElementById('nav');
const anchor = document.getElementById('progress-expand-anchor');
const overlay = document.getElementById('overlay');

anchor?.addEventListener('click', () => {
  anchor?.classList.toggle('active');
  nav?.classList.toggle('active');
  overlay?.classList.toggle('active');
});

const closeBtn = document.getElementById('expanded-progress-close-btn');
closeBtn?.addEventListener('click', () => {
  anchor?.classList.toggle('active');
  nav?.classList.toggle('active');
  overlay?.classList.toggle('active');
});

// FPJS Init Agent
const fpjsInit = (sessionData) => {
  const idv = sessionData?.idv
  const fpjsPubKey = idv?.config?.fpjsPubKey ?? "unknown"

  const fpPromise = import(`https://fpjscdn.net/v3/${fpjsPubKey}`)
    .then(FingerprintJS => FingerprintJS.load({
      region: "eu"
    }))

  fpPromise
    .then(fp => fp.get({
      extendedResult: idv?.config?.fpJsExtendedResult ?? true,
      linkedId: sessionData?.processInstanceId,
      tag: {
        "processInstanceId": sessionData?.processInstanceId,
        "processDefinitionName": sessionData?.processDefinitionName,
        "processDefinitionVersion": sessionData?.processDefinitionVersion,
        "ce_entity_id": idv?.config?.ce_entity_id ?? "unknown",
        "channel": idv?.config?.channel ?? "web",
        "brand": idv?.config?.brand ?? "NAB",
        "productFamily": idv?.config?.productFamily ?? "unknown",
        "assisted": idv?.config?.assisted ?? false
      }
    }))
    .then(result => {
      console.log(`visitorId: ${result.visitorId} | requestId: ${result.requestId}`)

      const $fpEl = $('#fpjsId')
      if ($fpEl.length > 0) {
        $fpEl.val(result.requestId)
      } else {
        // Create fpjs element
        const fpJsEl = document.createElement('md-outlined-text-field')
        fpJsEl.id = 'fpjsId'
        fpJsEl.className = 'input-text'
        fpJsEl.value = result.requestId
        fpJsEl.style.display = 'none'
        document.getElementsByTagName('body')[0].appendChild(fpJsEl)
      }
    })
    .catch(e => {
      console.error('fp error: ', e)
    })
}


// Back navigation
const dispatchBack = ()=> {
  const date = Date.now()

  const variables = {
      message: 'Success',
      timestamp: date,
      navigateBack: true
  }

  window.parent.postMessage({event: 'SEND', variables: variables}, '*');
}

// Enable next button after a successful UI validation
const enableNextButtons = () => {
  let nextButtonElements = null
  try {
    nextButtonElements = document.getElementsByClassName('next-button');
    for (const element of nextButtonElements) {
      element.disabled = false
    }
  } catch (error) {
    console.error('nextButtonElements not found - skipping')
  }
}

// Disable next button
const disableNextButton = () => {
  // Class name of exception items
  // Items marked with this class name will never get disabled
  const alwaysEnabledClassName = 'alwaysEnabled';
  let nextButtonElements = null
  try {
    nextButtonElements = document.getElementsByClassName('next-button');
    for (const element of nextButtonElements) {
      if (!element.classList.contains(alwaysEnabledClassName)) {
        element.disabled = true
      }
    }
  } catch (error) {
    console.error('nextButtonElements not found - skipping')
  }
}

//When invoked on a page load script, will add listeners to keep elements in view
//Virtual Keyboard will not block the view of the element in focus
const onFocusKeepElementsInView = () => {
  $('input[type="text"], md-outlined-text-field').on('focus', function() {
    setTimeout(() => {
      this.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 250);
  }); 
}

// Check validation set equality
const isEqualSet = (xs, ys) =>
  xs.size === ys.size && [...xs].every((x) => ys.has(x));


// Check whether nested object exists
// eg. hasProperty(sessionData, 'idv', 'role') returns true in the following object
// sessionData = {
//   idv: {
//     role: 'banker'
//   }
// }
//
const hasProperty = (obj, level,  ...rest) => {
  if (obj === undefined) return false
  if (rest.length == 0 && obj.hasOwnProperty(level)) return true
  return hasProperty(obj[level], ...rest)
}


// ####### CONSTANTS

// Inject document type in manual input scenario
// https://github.com/daon-private/apac-nab/tree/nab-dev-lambda/src/main/resources/DatazooConverterConfig/DVS
const DOCTYPE_AU_PASSPORT = "Australia Passport";
const DOCTYPE_FOREIGN_PASSPORT = "Foreign Passport";
const DOCTYPE_DRIVERS_LICENSE = "Australia Driving License";
const DOCTYPE_MEDICARE = "medicare";
const DOCTYPE_BIRTH_CERTIFICATE = "birthCertificate";
const DOCTYPE_CITIZENSHIP_CERTIFICATE = "citizenship";
const DOCTYPE_CENTRELINK = "centrelink";

// Inject document classification for manual input and Type 2
const DOCCLASS_AU_PASSPORT = "Australian Passport";
const DOCCLASS_FOREIGN_PASSPORT = "Foreign Passport";
const DOCCLASS_DRIVERS_LICENSE = "Australia Driving License";
const DOCCLASS_MEDICARE = "Medicare"
const DOCCLASS_BIRTH_CERTIFICATE = "Australian Birth Certificate"
const DOCCLASS_CITIZENSHIP_CERTIFICATE = "Australian Citizenship Certificate"
const DOCCLASS_CENTRELINK = "Australian Centrelink"

// Document Types
const DOC_TYPE_1_PAGES = ['PagePassport', 'PagePassportQas', 'PagePassportForeign', 'PagePassportForeignQas', 'PageDriversLicence', 'PageDriversLicenceQas']
const DOC_TYPE_2_PAGES = ['PageMedicare', 'PageMedicareQas', 'PageBirthCertificate', 'PageBirthCertificateQas']

const DOC_TYPE_1_LIST = ['passport', 'foreignPassport', 'dl']
const DOC_TYPE_2_LIST = [
  'medicare', 'birthCertificate', 'centrelinkConcessionCard',
  'centrelinkConcessionCard', 'citizenshipCertificate', 'immiCard',
  'changeOfNameCertificate', 'marriageCertificate' // only for change of name re-verification flow
]
const DOC_TYPE_3_LIST = [
  'proofOfAge', 'foreignLicense', 'foreignWrittenReference', 'foreignTravelDocument',
  'concessionCard', 'foreignIdCard', 'indigenousId', 'utilityBill',
  'atoNotice', 'indigenousLetter', 'financialBenefitStatement'
]

// Processing delay
const PROCESSING_DELAY = 5 // ms
