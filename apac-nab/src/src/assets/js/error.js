/**
 * ------------------------
 * ERROR CONSTANTS
 * ------------------------
 */

// Names
const ERROR_INVALID_NAME = "Placeholder error"
const ERROR_FIRST_NAME_HYPHEN = "If you do not have a first name, add a hyphen (-) and complete the name in the last name field. Do not leave this field empty"
const ERROR_NAME_HYPEN_APOS_PERIOD_ONLY = "Please enter a valid name. Name should only contain letters, hyphens (-), apostrophe ('), and period (.)"

const ERROR_SURNAME_BLANK = "Enter your surname."
const ERROR_FIRST_NAME_LEN_SPECIAL_CHARS = "Your first name can be no longer than 100 characters, and only contain the special characters: space, hyphen (-), or apostrophe (')."
const ERROR_MID_NAME_LEN_SPECIAL_CHARS = "Your middle names can be no longer than 100 characters, and only contain the special characters: space, hyphen (-), or apostrophe (')."
const ERROR_SURNAME_LEN_SPECIAL_CHARS = "Your surname can be no longer than 100 characters, and only contain the special characters: space, hyphen (-), or apostrophe (')."

const ERROR_INVALID_PREFERRED_NAME = "Your preferred name can be no longer than 15 characters and only contain a single special character from: hyphen (-), apostrophe ('), or space."

//Address
const ERROR_ADDRESS_BUILDING_NAME = "Your building name must be no longer than 100 characters and can only contain the special characters of space, apostrophe, ampersand and forward slash."
const ERROR_ADDRESS_UNIT_NUMBER  = "Your flat/unit number must be no longer than 7 characters and can only contain the special characters of space, hyphen and forward slash.";
const ERROR_ADDRESS_STREET_NUMBER  = "Your building/street number must be no longer than 10 characters and can only contain the special characters of space, hyphen and forward slash.";
const ERROR_ADDRESS_STREET_NAME = "Your building name must be no longer than 30 characters and can only contain the special characters of space, apostrophe, ampersand and forward slash.";


// QAS address validation
const ERROR_QAS_BUILDING_NAME = "Please enter a valid building name";
const ERROR_QAS_FLAT_UNIT_NUMBER = "Please enter a valid flat/unit number";

const ERROR_QAS_STREET_NUMBER_LENGTH = "Your street number must be no longer than 10 characters";
const ERROR_QAS_STREET_NUMBER_INVALID_CHARACTERS = "Can only contain special characters of \"space\", \"-\" and \"/\"";
const ERROR_QAS_STREET_NUMBER_ALPHABETIC = "Please enter a valid street number";

const ERROR_QAS_STREET_NAME_LENGTH = "Your street name must be no longer than 40 characters";
const ERROR_QAS_STREET_NAME_INVALID_CHARACTERS = "Can only contain special characters of \"space\", \"-\", \"/\", \"'\" and \"&\"";
const ERROR_QAS_STREET_NAME_INVALID = "Please enter a valid street name";

const ERROR_QAS_POSTCODE_INVALID = "Your postcode number must be 4 digits";

const ERROR_QAS_PO_BOX = "Enter a valid address, we can't accept a P.O. box";

const ERROR_QAS_CITY = "Please enter a valid suburb";

// Email
const ERROR_INVALID_EMAIL = "Enter a valid email address in the correct format e.g. name@example.com"

// Dates
const ERROR_INVALID_DATE_FORMAT = "Please enter date in DD/MM/YYYY format"
const ERROR_OVER_14 = "You must meet the minimum age eligibility for online verification."
const ERROR_DATE_MUST_BE_PAST = "Your date of birth must be in the past"
const ERROR_EXPIRY_NOT_IN_THE_FUTURE= "Please ensure the selected ID is not expired"
const ERROR_EXPIRY_MORE_THAN_100_YEARS = "Expiry date must not be longer than 100 years"

// Address
const ERROR_INVALID_STREET_ADDRESS = "Please enter a valid street address"
const ERROR_INVALID_SUBURB_ADDRESS = "Please enter a valid suburb"

const ERROR_INVALID_POSTCODE = "Your postcode must be 4 characters and can only contain numbers."
const ERROR_INVALID_POSTCODE_STATE = "Your postcode and state do not match."

const ERROR_ADDRESS_STATE_NOT_SELECTED= "Please select a state"

const ERROR_INVALID_STREET_ADDRESS_PO_BOX = "Enter a valid address. We can't accept a PO Box."
const ERROR_INVALID_STREET_ADDRESS_START = "Enter your street number."
const ERROR_INVALID_STREET_ADDRESS_END = "Enter a valid street type."


// Drivers License
const ERROR_DL_INVALID_LICENCE_NUMBER = "Please enter a valid licence number"
const ERROR_DL_INVALID_CARD_NUMBER = "Please enter a valid card number"
const ERROR_DL_STATE_OF_ISSUE_NOT_SELECTED = "Please select the state of issue"

// Passport
const ERROR_PASSPORT_BLANK = "Enter your document number."
const ERROR_PASSPORT_INVALID_NUMBER = "Your document number must be 1 or 2 alpha character(s) followed by 7 digits."
const ERROR_FOREIGN_PASSPORT_INVALID_NUMBER = "Invalid document number. Must be between 5 and 14 alphanumeric characters."

// Medicare
const ERROR_MEDICARE_TYPE_NOT_SELECTED = "Please select Medicare type"
const ERROR_MEDICARE_INVALID_NUMBER = "Please enter a valid Medicare number"
const ERROR_MEDICARE_INVALID_REFERENCE_NUMBER = "Please enter a valid Medicare individual reference number"
const ERROR_MEDICARE_CHECK_SUM_ERROR = "Invalid Medicare card number. Must be 10 digits."

const ERROR_MEDICARE_PAST_DATE = "Incorrect valid to date. Must be a future date."

const ERROR_MEDICARE_GREEN_INVALID_DATE_FMT = "Incorrect valid to date. Input format should be MM/YYYY"
const ERROR_MEDICARE_NOT_GREEN_INVALID_DATE_FMT = "Incorrect valid to date. Input format should be DD/MM/YYYY"

const ERROR_MEDICARE_GREEN_INVALID_DATE_RANGE = "Incorrect valid to date. Can't be later than 5 years from the current date."
const ERROR_MEDICARE_BLUE_INVALID_DATE_RANGE = "Incorrect valid to date. Can't be later than 1 year from the current date."
const ERROR_MEDICARE_YELLOW_INVALID_DATE_RANGE = "Incorrect valid to date. Can't be later than 2 years from the current date."

// Birth Certificate
const ERROR_BIRTHCERT_INVALID_BIRTH_REGISTRATION_NUMBER = "Please enter a valid birth registration number"
const ERROR_BIRTHCERT_INVALID_BIRTH_CERTIFICATE_NUMBER = "Please enter a valid birth certificate number"
const ERROR_BIRTHCERT_INVALID_BIRTH_REGISTRATION_DATE = "Please enter a valid birth registration date"


// Mobile number
const ERROR_MOBILE_BLANK = "Enter your mobile number"
const ERROR_MOBILE_INVALID = "Enter a valid phone number"

//DOB
const ERROR_OVER_MAX_AGE = "Your date of birth must be 110 years or younger to use this ID document type."
