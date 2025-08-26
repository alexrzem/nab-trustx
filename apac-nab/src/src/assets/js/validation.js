/**
* -------------------------
* Notes on Input Validation
* -------------------------
* We enable checks on fields included in the needToValidateMatrix.
*
* We check format/value validation inside the fields on input or on change depending on the field type.
*
* Every time we make a change in any of the fields, we always compare the currentlyValidatedMatrix
* which contains fields that are already validated against needToValidateMatrix.
* We assert that currentlyValidatedMatrix at least contains all the required values in needToValidateMatrix
* i.e. needToValidateMatrix needs to be a subset of currentlyValidatedMatrix
*
* */

///////////////// Fields that need to be validated
const VALIDATION_ITEMS_COMMON = new Set([
  "documentFirstName",
  // "documentMiddleName",
  "documentLastName",
  //"documentDateOfBirth"
])

const VALIDATION_ITEMS_PASSPORT = new Set([
  "documentMiddleName",

  "documentNumber",

  "documentDateOfBirth",
  "documentDateOfExpiry",

  "documentAddressStreetAddress",
  "documentAddressState",
  "documentAddressSuburb",
  "documentAddressPostalCode"
])

const VALIDATION_ITEMS_PASSPORT_QAS = new Set([
  "documentMiddleName",

  "documentNumber",

  "documentDateOfBirth",
  "documentDateOfExpiry"
])

const VALIDATION_ITEMS_DL = new Set([
  "documentMiddleName",

  "documentNumber",
  "documentCardNumber",
  "documentIssuingState",

  "documentDateOfBirth",
  "documentDateOfExpiry",

  "documentAddressStreetAddress",
  "documentAddressSuburb",
  "documentAddressState",
  "documentAddressPostalCode"
])

const VALIDATION_ITEMS_QAS_DL = new Set([
  "documentMiddleName",

  "documentNumber",
  "documentCardNumber",
  "documentIssuingState",

  "documentDateOfBirth",
  "documentDateOfExpiry",

  // "documentAddressStreetAddress",
  // "documentAddressSuburb",
  // "documentAddressState",
  // "documentAddressPostalCode"
])

const VALIDATION_QAS_ITEMS_ADDRESS = new Set([
  "documentAddressBuildingPropertyName",
  "documentAddressLevelNumber",
  "documentAddressUnitNumber",
  "documentAddressStreetNumber",
  "documentAddressStreetName",
  "documentAddressStreetType",
  "documentAddressSuburb",
  "documentAddressState",
  "documentAddressPostalCode",
  "addressSearchInput"
])

const VALIDATION_ITEMS_MEDICARE = new Set([
  "documentMiddleName", // NB-670
  "documentMedicareMiddleName",
  "documentNumber",
  "documentMedicareReferenceNo",
  "documentMedicareType",
  // "documentMedicareValidToNotGreen",
  "documentMedicareValidTo", // NB-650 fix medicare expiry validation

  "documentAddressStreetAddress",
  "documentAddressSuburb",
  "documentAddressState",
  "documentAddressPostalCode"
])

const VALIDATION_ITEMS_MEDICARE_QAS = new Set([
  "documentMiddleName", // NB-670
  "documentMedicareMiddleName",
  "documentNumber",
  "documentMedicareReferenceNo",
  "documentMedicareType",
  // "documentMedicareValidToNotGreen",
  "documentMedicareValidTo", // NB-650 fix medicare expiry validation
])

const VALIDATION_ITEMS_BIRTH_CERT = new Set([
  "documentMiddleName",
  "documentIssuingState",
  "documentRegistrationDate",
  "documentBirthRegistrationNo",
  "documentBirthCertificateNo",

  "documentAddressStreetAddress",
  "documentAddressSuburb",
  "documentAddressState",
  "documentAddressPostalCode",

  "documentDateOfBirth"
])

const VALIDATION_ITEMS_BIRTH_CERT_QAS = new Set([
  "documentMiddleName",
  "documentIssuingState",
  "documentRegistrationDate",
  "documentBirthRegistrationNo",
  "documentBirthCertificateNo",

  "documentDateOfBirth"
])

/**
 * Track currently validated fields
 */
let currentlyValidatedMatrix = new Set()

/**
 * Fields required to be validated
 */
let needToValidateMatrix = new Set()


try {
  if (currentPage) {
    switch (currentPage) {
      case 'PagePassport':
      case 'PagePassportForeign':
        needToValidateMatrix = new Set([...VALIDATION_ITEMS_COMMON, ...VALIDATION_ITEMS_PASSPORT])
        break;
      case 'PagePassportQas':
      case 'PagePassportForeignQas':
        needToValidateMatrix = new Set([...VALIDATION_ITEMS_COMMON, ...VALIDATION_ITEMS_PASSPORT_QAS, ...VALIDATION_QAS_ITEMS_ADDRESS])
        break;
      case 'PageDriversLicence':
        needToValidateMatrix = new Set([...VALIDATION_ITEMS_COMMON, ...VALIDATION_ITEMS_DL])
        break;
      case 'PageDriversLicenceQas':
        needToValidateMatrix = new Set([...VALIDATION_ITEMS_COMMON, ...VALIDATION_ITEMS_QAS_DL, ...VALIDATION_QAS_ITEMS_ADDRESS])
        break;
      case 'PageMedicare':
        needToValidateMatrix = new Set([...VALIDATION_ITEMS_COMMON, ...VALIDATION_ITEMS_MEDICARE])
        break;
      case 'PageMedicareQas':
        needToValidateMatrix = new Set([...VALIDATION_ITEMS_COMMON, ...VALIDATION_ITEMS_MEDICARE_QAS, ...VALIDATION_QAS_ITEMS_ADDRESS])
        break;
      case 'PageBirthCertificate':
        needToValidateMatrix = new Set([...VALIDATION_ITEMS_COMMON, ...VALIDATION_ITEMS_BIRTH_CERT])
        break;
      case 'PageBirthCertificateQas':
        needToValidateMatrix = new Set([...VALIDATION_ITEMS_COMMON, ...VALIDATION_ITEMS_BIRTH_CERT_QAS, ...VALIDATION_QAS_ITEMS_ADDRESS])
        break;
      default:
        needToValidateMatrix = new Set([...VALIDATION_ITEMS_COMMON])
        break;
    }
  }
} catch (error) {
  console.log('needToValidateMatrix - error: ', error)

  needToValidateMatrix = new Set([...VALIDATION_ITEMS_COMMON])
}



///////////////// Validation rules

// Validation rules - text

const isAlphaNumericOnly = (data) => {
  const regex = /^[a-z0-9]+$/i
  return regex.test(data)
};

const isNumericOnly = (data) => {
  const regex = /^[0-9]+$/i
  return regex.test(data)
};

const isAlphaSpaceHyphenAposOnly = (data) => {
  const regex = /^[a-z '-]+$/i
  return regex.test(data)
};

const isAlphaSpaceHyphenAposPeriodOnly = (data) => {
  const regex = /^[a-z .'-]+$/i
  return regex.test(data)
};

const isAlphaSpaceHyphenAposPeriodCommaOnly = (data) => {
  const regex = /^[a-z ,.'-]+$/i
  return regex.test(data)
};

const isAlphaNumericSpaceHyphenAposPeriodCommaForwardslashAmpersandOnly = (data) => {
  const regex = /^[a-z ,.*'\s&\/-]+$/i
  return regex.test(data)
}

const isAlphaAndOnlyOneSpaceHyphenApos = (data) => {
  const regex = /^[a-zA-Z]+[' -]{0,1}[a-zA-Z]*$/i
  return regex.test(data)
}

const isBlank = (data) => {
  data = data.trim()
  return !(data.length > 0)
}

const isMoreThanOneChar = (data) => {
  // length must be more than 1 character
  data = data.trim()
  return data.length > 1
}

const isMoreThanOneCharIfNotBlank = (data) => {
  // length can be blank, if not then must be more than 1 character
  data = data.trim()
  // return data.length > 1 || data.length === 0 // or data.length !== 1
  return data.length !== 1
}

//TODO: Validate this if is correct
const hasRepeatingAlphaNumericValues = (data) => {
  letterRegex = /([a-z])\1/i
  numberRegex = /([0-9])\1/i
  return letterRegex.test(data) || numberRegex.test(data)
}


// Validation rules - dates
const checkValidDateFormat = (date) => {
  const regex = /([1-2][0-9]|[0][1-9]|[3][0-1])\/([0][1-9]|[1][0-2])\/[1-9][0-9][0-9]{2}/gm
  return regex.test(date)
};

// Validation rules - states and territory
const checkValidStateTerritory = (data) => {
  const state = data.trim().toUpperCase()
  const statesAndTerritories = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"]
  return statesAndTerritories.includes(state)
}

// Validation rules - age
const calculateAge = (dateOfBirth) => {
  const today = new Date()
  const diffInMilliSeconds = today.getTime() - dateOfBirth.getTime()
  // 1 year = 365.25 days for leap years
  const diffInYears = diffInMilliSeconds / 1000 / 60 / 60 / 24 / 365.25
  return Math.abs(diffInYears)
}

// Validation rules - Medicare Types
const checkValidMedicareType = (data) => {
  const type = data.trim().toUpperCase()
  const availableTypes = ["G", "B", "Y"]
  return availableTypes.includes(type)
}

const checkValidMedicareNumber = (data) => {
  data = data.trim()
  return isNumericOnly(data) && data.length === 10
}

const checkValidMedicareReferenceNumber = (data) => {
  data = data.trim()
  return isNumericOnly(data) && data.length === 1
}

///////////////// Field-level validations

// License Rules
// State   Format          Length
// ACT     Numeric         1 to 10
// NT      Numeric         1 to 10
// QLD     Numeric         8 to 9
// NSW     Alphanumeric    6 to 8
// SA      Alphanumeric    6
// TAS     Alphanumeric    6 to 8
// VIC     Numeric         1 to 10
// WA      Numeric         7
// Repetitive/Sequential numbers are not allowed.
// Alphanumeric characters (upper and lowercase), in any order to the maximum length of the field, no spaces.
const checkValidLicenseNumber = (data, state) => {
  data = data.trim()
  switch (state) {
    case 'ACT':
    case 'NT':
    case 'VIC':
      return (isNumericOnly(data) && (data.length >= 1 && data.length <= 10))
    case 'QLD':
      return (isNumericOnly(data) && (data.length >= 8 && data.length <= 9))
    case 'NSW':
    case 'TAS':
      return (isAlphaNumericOnly(data) && (data.length >= 6 && data.length <= 8))
    case 'SA':
      return (isAlphaNumericOnly(data) && data.length === 6)
    case 'WA':
      return (isNumericOnly(data) && data.length === 7)
    default:
      return false
  }

  // Disable repeating value restriction for the time being
  // if (hasRepeatingAlphaNumericValues(data)) {
  //   return false;
  // } else {
  //   switch (state) {
  //     case 'ACT':
  //     case 'NT':
  //     case 'VIC':
  //       return (isNumericOnly(data) && (data.length >= 1 && data.length <= 10))
  //     case 'QLD':
  //       return (isNumericOnly(data) && (data.length >= 8 && data.length <= 9))
  //     case 'NSW':
  //     case 'TAS':
  //       return (isAlphaNumericOnly(data) && (data.length >= 6 && data.length <= 8))
  //     case 'SA':
  //       return (isAlphaNumericOnly(data) && data.length === 6)
  //     case 'WA':
  //       return (isNumericOnly(data) && data.length === 7)
  //     default:
  //       return false
  //   }
  // }
}

// Card Number Rules
// Mandatory for ACT, SA, NT, WA, TAS, NSW
// Optional for VIC and QLD
// ACT 	Alphanumeric 	10
// NT 	Numeric 		6 to 8
// QLD 	Alphanumeric 	10 		Not available for all
// NSW 	Numeric 		10
// SA 	Alphanumeric	9
// Tas	Alphanumeric	9
// Vic	Alphanumeric	8		Not available for all
// WA		Alphanumeric	8 to 10
// TODO : Repetitive and sequential characters/digits must be checked on the card number
const checkValidCardNumber = (data, state) => {
  data = data.trim()
  switch (state) {
    case 'NT':
    case 'ACT':
    case 'NSW':
    case 'TAS':
    case 'SA':
    case 'WA':
      if (isBlank(data)) {
        return false;
      }
      break
    default:
      break
  }
  switch (state) {
    case 'NT':
      return (isNumericOnly(data) && (data.length >= 6 && data.length <= 8))
    case 'ACT':
    case 'QLD':
      return (isAlphaNumericOnly(data) && data.length === 10)
    case 'NSW':
      return (isNumericOnly(data) && data.length === 10)
    case 'TAS':
    case 'SA':
      return (isAlphaNumericOnly(data) && data.length === 9)
    case 'VIC':
      return (isAlphaNumericOnly(data) && data.length === 8)
    case 'WA':
      return (isAlphaNumericOnly(data) && (data.length >= 8 && data.length <= 10))
    default:
      return false
  }
}


// Birth Registration Number Rules
// State   Format          Length
// ACT     Numeric         1 to 10
// NT      Numeric         1 to 10
// QLD     Numeric         1 to 10
// VIC     Numeric         1 to 10
// TAS     Numeric         1 to 10
// NSW     Numeric         1 to 7
// WA      Numeric         7
// SA      Alphanumeric    1 to 10
const checkValidBirthRegistrationNumber = (data, state) => {
  data = data.trim()
  switch (state) {
    case 'ACT':
    case 'NT':
    case 'QLD':
    case 'VIC':
    case 'TAS':
      return (isNumericOnly(data) && (data.length >= 1 && data.length <= 10))
    case 'NSW':
      // return (isNumericOnly(data) && (data.length >= 1 && data.length <= 7))
    case 'WA':
      return (isNumericOnly(data) && data.length === 7)
    case 'SA':
      return (isAlphaNumericOnly(data) && (data.length >= 1 && data.length <= 10))
    default:
      return false
  }
}


const checkValidBirthCertificateNumber = (data, state) => {
  data = data.trim()
  switch (state) {
    case 'ACT':
    case 'NT':
    case 'SA':
      return (isNumericOnly(data) && (data.length >= 1 && data.length <= 9))
    case 'TAS':
    case 'WA':
      if (isBlank(data)) return true
      return (isNumericOnly(data) && data.length === 11)
    case 'VIC':
    case 'NSW':
      return true
    case 'QLD':
      if (isBlank(data)) return true
      return (isNumericOnly(data) && data.length === 10)
    default:
      return false
  }
}



const validateGivenName_OCR = (data) => {
  return isAlphaSpaceHyphenAposOnly(data)
}

const validateSurname_OCR = (data) => {
  if (!isAlphaSpaceHyphenAposPeriodOnly(data) || isBlank(data)) {
    return false
  }
  return true
}

const validateDOB_OCR = (data) => {
  if (checkValidDateFormat(data)) {
    const selectedDate = new Date(data)
    const today = new Date()
    if (selectedDate < today) {
      return true
    }
    return false
  }
  return false
}

const validateDOE_OCR = (data) => {
  if (checkValidDateFormat(data)) {
    const selectedDate = new Date(data)
    const today = new Date()
    if (selectedDate >= today) {
      return true
    }
    return false
  }
  return false
}

//#Deprecated Not Used anywhere //TODO Check with Alex
// const validateStreetAddress_OCR = (data) => {
//   if (isBlank(data) || doesContainPOBoxText(data)) {
//     return false
//   }
//   return true
// }

const validateSuburb_OCR = (data) => {
  return !isBlank(data)
}

//Deprecated, not seemed to be in use
const validatePostalCode_OCR = (data) => {
  if (isBlank(data) || !checkValidPostalCode(data)) {
    return false
  }
  return true
}

/**
 * Remove target id from validated matrix
 * @param {*} targetId
 */
const removeIdFromValidatedMatrix = (targetId) =>  {
  if (currentlyValidatedMatrix.has(targetId)) {
    currentlyValidatedMatrix.delete(targetId)
  }
}

/**
 * Set error and error-text attributes in the element
 * @param {*} element
 * @param {*} message
 */
const setError = (element, message) => {
  element.prop('error', true)
  element.attr('error-text', message)
}

/**
 * Remove error attribute from element
 * @param {*} element
 */
const removeError = (element) => {
  element.prop('error', false)
}


///////////////// Actual field level checks

const validateFirstName = (element, middleNameEl, lastNameEl) => {
  const targetId = element.prop('id')
  const targetValue = element.val()

  // If not in the needToValidateMatrix, ignore
  if (!needToValidateMatrix.has(targetId)) {
    return
  }

  if (!isBlank(targetValue)) {
    const validName = targetValue.length <= 100 && isAlphaSpaceHyphenAposOnly(targetValue)
    if (!validName) {
      setError(element, ERROR_FIRST_NAME_LEN_SPECIAL_CHARS)
      removeIdFromValidatedMatrix(targetId)
    } else {
      removeError(element)
      currentlyValidatedMatrix.add(targetId)
    }
  } else {

    if (!isBlank(lastNameEl.val()) && isBlank(middleNameEl.val())) {
      //Not a validation error
      removeError(element)
      currentlyValidatedMatrix.add(targetId)
      console.log('Possible Single Name ::: ' + ' First Name')
    } else {
      setError(element, ERROR_FIRST_NAME_HYPHEN)
      removeIdFromValidatedMatrix(targetId)  
    }
  }
}

const validateMiddleName = (element) => {
  const targetId = element.prop('id')
  const targetValue = element.val()

  if (!needToValidateMatrix.has(targetId)) {
    return
  }

  if(isBlank(targetValue)){
    removeError(element)
    currentlyValidatedMatrix.add(targetId)
  } else if (!isAlphaSpaceHyphenAposOnly(targetValue) || targetValue.length > 100) {
    setError(element, ERROR_MID_NAME_LEN_SPECIAL_CHARS)
    removeIdFromValidatedMatrix(targetId)
  } else {
    removeError(element)
    currentlyValidatedMatrix.add(targetId)
  }
}

const validateLastName = (element, middleNameEl, firstNameEl) => {
  const targetId = element.prop('id')
  const targetValue = element.val()

  // If not in the needToValidateMatrix, ignore
  if (!needToValidateMatrix.has(targetId)) {
    return
  }

  if(isBlank(targetValue)){
    if (!isBlank(firstNameEl.val()) && isBlank(middleNameEl.val())) {
      //Not a validation error
      removeError(element)
      currentlyValidatedMatrix.add(targetId)
      console.log('Possible Single Name ::: ' + ' Last Name')
    } else {    
      setError(element, ERROR_SURNAME_BLANK)
      removeIdFromValidatedMatrix(targetId)
    }
  } else if (!isAlphaSpaceHyphenAposOnly(targetValue) || targetValue.length > 100) {
    setError(element, ERROR_SURNAME_LEN_SPECIAL_CHARS)
    removeIdFromValidatedMatrix(targetId)
  } else {
    removeError(element)
    currentlyValidatedMatrix.add(targetId)
  }
}

function isAge110Above(dobDateStr) {
  // Input format: DD/MM/YYYY
  const birthDate = moment(dobDateStr, 'DD/MM/YYYY');
  if (!birthDate.isValid()) return false;
  const today = moment();
  const ageInYears = today.diff(birthDate, 'years');

  // Check if birthday has passed this year
  const hasHadBirthdayThisYear = today.isSameOrAfter(birthDate.clone().add(ageInYears, 'years'));

  return ageInYears > 110 || (ageInYears === 110 && !hasHadBirthdayThisYear);
}

const validateDOB = (element) => {
  const targetId = element.prop('id')
  const targetValue = element.val()

  if (!needToValidateMatrix.has(targetId)) {
    return
  }

  // Check date format validity
  if (!checkValidDateFormat(targetValue)) {
    // If format not valid, remove from validated matrix
    setError(element, ERROR_INVALID_DATE_FORMAT)
    removeIdFromValidatedMatrix(targetId)
  } else {
    // If format valid, check if selected/typed date is before today's date
    const selectedDate = moment(targetValue, 'DD/MM/YYYY').toDate()
    const today = new Date()
    // if (selectedDate < today && calculateAge(selectedDate) >= 14) { // selected day has to be before today
    if (selectedDate < today) { // 2025-03-21 under 14 is now handled in the PD
      if (isAge110Above(selectedDate)) {
        setError(element, ERROR_OVER_MAX_AGE)
        removeIdFromValidatedMatrix(targetId)
      } else {
        removeError(element)
        currentlyValidatedMatrix.add(targetId)
      }
    } else {
      setError(element, ERROR_DATE_MUST_BE_PAST)
      removeIdFromValidatedMatrix(targetId)
    }
  }
}

function isWithinTwoYears(dateToCheck) {
  const momentDate = moment(dateToCheck, 'DD/MM/YYYY').startOf('day');
  const twoYearsAgo = moment().subtract(2, 'years').startOf('day');
  const today = moment().startOf('day');
  return momentDate.isBetween(twoYearsAgo, today, 'day', '[]');
}

const validateDOE_AU_Passport = (element) => {
  const targetId = element.prop('id')
  const targetValue = element.val()

  if (!needToValidateMatrix.has(targetId)) {
    return
  }

  // Check date format validity
  if (!checkValidDateFormat(targetValue)) {
    // If format not valid, remove from validated matrix
    setError(element, ERROR_INVALID_DATE_FORMAT)
    removeIdFromValidatedMatrix(targetId)
  } else {
    // If format valid, check if selected/typed date is after today's date
    const selectedDate = moment(targetValue, 'DD/MM/YYYY').toDate()
    const today = new Date()
    if (selectedDate >= today) { // selected day has to be after today
      const delta = selectedDate.getFullYear() - today.getFullYear()
      if (delta > 100) { // must not be longer than 100 years in future
        setError(element, ERROR_EXPIRY_MORE_THAN_100_YEARS)
        removeIdFromValidatedMatrix(targetId)
      } else {
        removeError(element)
        currentlyValidatedMatrix.add(targetId)
      }
    } else if (selectedDate < today && !isWithinTwoYears(selectedDate)) {
      // If selected/typed date is not after today's date, remove from validated matrix
      setError(element, ERROR_EXPIRY_NOT_IN_THE_FUTURE)
      removeIdFromValidatedMatrix(targetId)
    } else {
      removeError(element)
      currentlyValidatedMatrix.add(targetId)
    }
  }
}

const validateDOE = (element) => {
  const targetId = element.prop('id')
  const targetValue = element.val()

  if (!needToValidateMatrix.has(targetId)) {
    return
  }

  // Check date format validity
  if (!checkValidDateFormat(targetValue)) {
    // If format not valid, remove from validated matrix
    setError(element, ERROR_INVALID_DATE_FORMAT)
    removeIdFromValidatedMatrix(targetId)
  } else {
    // If format valid, check if selected/typed date is after today's date
    const selectedDate = moment(targetValue, 'DD/MM/YYYY').toDate()
    const today = new Date()
    if (selectedDate >= today) { // selected day has to be after today
      const delta = selectedDate.getFullYear() - today.getFullYear()
      if (delta > 100) { // must not be longer than 100 years in future
        setError(element, ERROR_EXPIRY_MORE_THAN_100_YEARS)
        removeIdFromValidatedMatrix(targetId)
      } else {
        removeError(element)
        currentlyValidatedMatrix.add(targetId)
      }
    } else {
      // If selected/typed date is not after today's date, remove from validated matrix
      setError(element, ERROR_EXPIRY_NOT_IN_THE_FUTURE)
      removeIdFromValidatedMatrix(targetId)
    }
  }
}

const validateBirthRegistrationDate = (element) => {
  const targetId = element.prop('id')
  const targetValue = element.val()

  if (!needToValidateMatrix.has(targetId)) {
    return
  }

  // only validate if state of issue also provided
  if (currentlyValidatedMatrix.has("documentIssuingState")) {
    const issState = document.getElementById("documentIssuingState").value.trim().toUpperCase()

    // No need to validate the following state
    if (["VIC", "NSW", "SA", "ACT", "WA", "NT"].includes(issState)) {
      removeError(element)
      currentlyValidatedMatrix.add(targetId)
      return
    }

    // Check date format validity
    if (!checkValidDateFormat(targetValue)) {
      // If format not valid, remove from validated matrix
      setError(element, ERROR_INVALID_DATE_FORMAT)
      removeIdFromValidatedMatrix(targetId)
    } else {
      // If format valid, check if selected/typed date is before today's date
      const selectedDate = moment(targetValue, 'DD/MM/YYYY').toDate()
      const today = new Date()
      if (selectedDate < today) { // selected day has to be before today
        removeError(element)
        currentlyValidatedMatrix.add(targetId)
      } else {
        setError(element, ERROR_BIRTHCERT_INVALID_BIRTH_REGISTRATION_DATE)
        removeIdFromValidatedMatrix(targetId)
      }
    }
  }


}

const validateSuburb = (element) => {
  const targetId = element.prop('id')
  const targetValue = element.val()

  if (!needToValidateMatrix.has(targetId)) {
    return
  }

  if (isBlank(targetValue)) {
    setError(element, ERROR_INVALID_SUBURB_ADDRESS)
    removeIdFromValidatedMatrix(targetId)
  } else {
    removeError(element)
    currentlyValidatedMatrix.add(targetId)
  }
}

/* Special state validation */
const validateAddressState = (element) => {
  const targetId = element.prop('id')
  const targetValue = element.val()

  if (!needToValidateMatrix.has(targetId)) {
    return
  }

  if (isBlank(targetValue) || !checkValidStateTerritory(targetValue)) {
    setError(element, ERROR_ADDRESS_STATE_NOT_SELECTED)
    removeIdFromValidatedMatrix(targetId)
  } else {
    removeError(element)
    currentlyValidatedMatrix.add(targetId)
  }
}

const validateDocumentIssuingState = (element) => {
  const targetId = element.prop('id')
  const targetValue = element.val()

  if (!needToValidateMatrix.has(targetId)) {
    return
  }

  if (isBlank(targetValue) || !checkValidStateTerritory(targetValue)) {
    setError(element, ERROR_DL_STATE_OF_ISSUE_NOT_SELECTED)
    removeIdFromValidatedMatrix(targetId)
  } else {
    removeError(element)
    currentlyValidatedMatrix.add(targetId)
  }
}

const isAustralianPassportNumber = (data) => {
  const passportRegex = /^[a-z]{1,2}\d{7}$/i;
  return passportRegex.test(data)
}

const isICAOPassportNumber = (data) => {
  const regex = /^[A-Z0-9]{5,14}$/i;
  return regex.test(data)
}

const validatePassportNumber = (element, passportType) => {
  const targetId = element.prop('id')
  const targetValue = element.val()

  if (!needToValidateMatrix.has(targetId)) {
    return
  }

  var isPassportNoFmtValid = false
  var errMsg = ''
  if (isBlank(targetValue)) {
    errMsg = ERROR_PASSPORT_BLANK
  } else {
    if (((currentPage==="PagePassport" || currentPage === "PagePassportQas") && isAustralianPassportNumber(targetValue)) || ((currentPage==="PagePassportForeign" || currentPage === "PagePassportForeignQas") && isICAOPassportNumber(targetValue))) {
      isPassportNoFmtValid = true
    } else {
      errMsg = (currentPage==="PagePassport" || currentPage === 'PagePassportQas') ? ERROR_PASSPORT_INVALID_NUMBER : ERROR_FOREIGN_PASSPORT_INVALID_NUMBER
    }
  }

  if (isPassportNoFmtValid) {
    removeError(element)
    currentlyValidatedMatrix.add(targetId)
  } else {
    removeIdFromValidatedMatrix(targetId)
    setError(element, errMsg)
  }
}

const validateLicenceNumber = (element) => {
  const targetId = element.prop('id')
  const targetValue = element.val()

  if (!needToValidateMatrix.has(targetId)) {
    return
  }

  // only validate if state of issue also provided
  if (currentlyValidatedMatrix.has("documentIssuingState")) {
    const issState = document.getElementById("documentIssuingState").value.trim().toUpperCase()

    if (isBlank(targetValue) || !checkValidLicenseNumber(targetValue, issState)) {
      setError(element, ERROR_DL_INVALID_LICENCE_NUMBER)
      removeIdFromValidatedMatrix(targetId)
    } else {
      removeError(element)
      currentlyValidatedMatrix.add(targetId)
    }
  } else {
    // TODO: Do we clear value so that have to enter after state or show a warning as need to update after choosing date
  }
}

// TODO Update for VIC Additional instruction: If you've been issued with an address label, use the new card number provided.
const validateCardNumber = (element) => {
  const targetId = element.prop('id')
  const targetValue = element.val()

  if (!needToValidateMatrix.has(targetId)) {
    return
  }

  // only validate if state of issue also provided
  if (currentlyValidatedMatrix.has("documentIssuingState")) {
    const issState = document.getElementById("documentIssuingState").value.trim().toUpperCase()
    if (isBlank(targetValue) || !checkValidCardNumber(targetValue, issState)) {
      setError(element, ERROR_DL_INVALID_CARD_NUMBER)
      removeIdFromValidatedMatrix(targetId)
    } else {
      removeError(element)
      currentlyValidatedMatrix.add(targetId)
    }
  } else {
    // TODO: Do we clear value so that have to enter after state or show a warning as need to update after choosing date
  }
}


const validateMedicareType = (element) => {
  const targetId = element.prop('id')
  const targetValue = element.val()

  if (!needToValidateMatrix.has(targetId)) {
    return
  }

  if (isBlank(targetValue) || !checkValidMedicareType(targetValue)) {
    setError(element, ERROR_MEDICARE_TYPE_NOT_SELECTED)
    removeIdFromValidatedMatrix(targetId)
  } else {
    removeError(element)
    currentlyValidatedMatrix.add(targetId)
  }
}

const medicareCheckSum = (medicareNumber) => {
  // digit of 2-6 check
  if (medicareNumber[0] >=2 && medicareNumber[0] <=6) {
    // calculate product for checksum
    let product =
        Number(medicareNumber[0]) + Number((medicareNumber[1] * 3)) +
        Number(medicareNumber[2] * 7) + Number(medicareNumber[3] * 9) +
        (Number(medicareNumber[4])) + Number(medicareNumber[5] * 3) + Number(medicareNumber[6] * 7) +
        Number(medicareNumber[7] * 9);
    // determine remainder
    let modRes = product % 10;
    // validate with check digit
    return Number(modRes) == Number(medicareNumber[8]);
  }else {
    return false;
  }
}

const validateMedicareNumber = (element) => {
  const targetId = element.prop('id')
  const targetValue = element.val()

  if (!needToValidateMatrix.has(targetId)) {
    return
  }

  if (isBlank(targetValue) || !checkValidMedicareNumber(targetValue)) {
    setError(element, ERROR_MEDICARE_INVALID_NUMBER)
    removeIdFromValidatedMatrix(targetId)
  } else {
    if (medicareCheckSum(targetValue)) {
      removeError(element)
      currentlyValidatedMatrix.add(targetId)
    } else {
      setError(element, ERROR_MEDICARE_CHECK_SUM_ERROR)
      removeIdFromValidatedMatrix(targetId)
    }
  }
}

const validateMedicareReferenceNumber = (element) => {
  const targetId = element.prop('id')
  const targetValue = element.val()

  if (!needToValidateMatrix.has(targetId)) {
    return
  }

  if (isBlank(targetValue) || !checkValidMedicareReferenceNumber(targetValue)) {
    setError(element, ERROR_MEDICARE_INVALID_REFERENCE_NUMBER)
    removeIdFromValidatedMatrix(targetId)
  } else {
    removeError(element)
    currentlyValidatedMatrix.add(targetId)
  }
}


const validateBirthRegistrationNumber = (element) => {
  const targetId = element.prop('id')
  const targetValue = element.val()

  if (!needToValidateMatrix.has(targetId)) {
    return
  }

  // only validate if state of issue also provided
  if (currentlyValidatedMatrix.has("documentIssuingState")) {
    const issState = document.getElementById("documentIssuingState").value.trim().toUpperCase()

    if (isBlank(targetValue) || !checkValidBirthRegistrationNumber(targetValue, issState)) {
      setError(element, ERROR_BIRTHCERT_INVALID_BIRTH_REGISTRATION_NUMBER)
      removeIdFromValidatedMatrix(targetId)
    } else {
      removeError(element)
      currentlyValidatedMatrix.add(targetId)
    }
  } else {
    // TODO: Do we clear value so that have to enter after state or show a warning as need to update after choosing date
  }
}


const validateBirthCertificateNumber = (element) => {
  const targetId = element.prop('id')
  const targetValue = element.val()

  if (!needToValidateMatrix.has(targetId)) {
    return
  }

  // only validate if state of issue also provided
  if (currentlyValidatedMatrix.has("documentIssuingState")) {
    const issState = document.getElementById("documentIssuingState").value.trim().toUpperCase()

    if (!checkValidBirthCertificateNumber(targetValue, issState)) {
      setError(element, ERROR_BIRTHCERT_INVALID_BIRTH_CERTIFICATE_NUMBER)
      removeIdFromValidatedMatrix(targetId)
    } else {
      removeError(element)
      currentlyValidatedMatrix.add(targetId)
    }
  } else {
    // TODO: Do we clear value so that have to enter after state or show a warning as need to update after choosing date
  }
}






// Confirm buttons validation depends on the state of the CSS display property value
// i.e. we are only valdiating confirm buttons if and only if display !== none
const getConfirmRadioStatus = () => {
  let radioButtonsStatus = {}

  const $confirmRadioEls = $('.radio-confirm');
  $confirmRadioEls.each((id, object) => {
    // Check if radio button is being displayed
    const isRadioDisplayed = $(object).css('display') !== 'none'
    // Check if radio button is checked
    const isRadioChecked = $(object).children('md-radio').prop('checked')
    // Add radio status into radioButtonsStatus object
    const radioBtnId = $(object).children('md-radio').attr('id')
    radioButtonsStatus[radioBtnId] = isRadioDisplayed === isRadioChecked
  })

  return radioButtonsStatus
}

const allConfirmRadioButtonsValidated = () => {
  const radioStatus = getConfirmRadioStatus();

  // Create array of all radio status from the above object, e.g. [true, true, true, true]
  const allStatusArray = Object.values(radioStatus);

  // Check if every radio in the array of status is true
  const allStatusTrue = (statusArray) => statusArray.every(status => status === true)
  console.log('allStatusTrue(allStatusArray): ', allStatusTrue(allStatusArray))

  return allStatusTrue(allStatusArray)
}


const validateInputs = () => {
  console.log('validateInputs - needToValidateMatrix: ', needToValidateMatrix)
  console.log('validateInputs - currentlyValidatedMatrix: ', currentlyValidatedMatrix)

  // Assert that currentlyValidatedMatrix at least contains all the required values in needToValidateMatrix
  // i.e. needToValidateMatrix needs to be a subset of currentlyValidatedMatrix
  console.log(needToValidateMatrix.isSubsetOf(currentlyValidatedMatrix), needToValidateMatrix, currentlyValidatedMatrix)
  if (needToValidateMatrix.isSubsetOf(currentlyValidatedMatrix) && allConfirmRadioButtonsValidated()) {
    // enableNextButtons()
    return true
  } else {
    // disableNextButton()
    return false
  }
}


