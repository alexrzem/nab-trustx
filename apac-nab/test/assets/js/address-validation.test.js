
const validation = require('../../../src/assets/js/address-validation.js')


const negativePostalCodes_StateMismatch = [
    ['ACT','2599'],
    ['ACT','2619'],
    ['ACT','2899'],
    ['ACT','2921'],
    ['NSW','0999'],
    ['NSW','2600'],
    ['NSW','2618'],
    ['NSW','2900'],
    ['NSW','2920'],
    ['NSW','3000'],
    ['VIC','2999'],
    ['VIC','9000'],
    ['VIC','7999'],
    ['VIC','9001'],
    ['QLD','3999'],
    ['QLD','5000'],
    ['QLD','8999'],
    ['WA','5999'],
    ['WA','6798'],
    ['WA','6799'],
    ['WA','7000'],
    ['SA','4999'],
    ['SA','6000'],
    ['TAS','6999'],
    ['TAS','8000'],
    ['NT','0799'],
    ['NT','1000']
]

const negativePostalCode_InvalidFormat = [
   ['ACT', '#123'],
   ['ACT', '12345'],
   ['QLD', '10000'],
   ['NSW', 'ABCD'],
]

const negativePostalCode_NoState_PostalCodeInvalidFormat = [
    ['', '#123'],
    ['', 'ABCD'],
 ]

const positivePostalCode_NoState_PostalCodeValidFormat = [
    ['', '1234'],
    ['', '9999'],
    ['', '2100']
]

const positivePostalCodes = [
    ['ACT','2600'],
    ['ACT','2618'],
    ['ACT','2900'],
    ['ACT','2919'],
    ['NSW','1000'],
    ['NSW','1999'],
    ['NSW','2000'],
    ['NSW','2599'],
    ['NSW','2619'],
    ['NSW','2899'],
    ['NSW','2921'],
    ['NSW','2999'],
    ['NSW','2611'],
    ['NSW','2540'],
    ['NSW','2620'],
    ['NSW','3500'],
    ['NSW','3585'],
    ['NSW','3644'],
    ['NSW','3707'],
    ['NSW','4380'],
    ['NSW','4377'],
    ['NSW','3691'],
    ['VIC','3000'],
    ['VIC','3999'],
    ['VIC','8000'],
    ['VIC','8999'],
    ['QLD','4000'],
    ['QLD','4999'],
    ['QLD','9000'],
    ['QLD','9999'],
    ['WA','6000'],
    ['WA','6797'],
    ['WA','6800'],
    ['WA','6999'],
    ['WA','0872'],
    ['SA','5000'],
    ['SA','5799'],
    ['SA','5800'],
    ['SA','5999'],
    ['SA','0872'],
    ['TAS','7000'],
    ['TAS','7799'],
    ['TAS','7800'],
    ['TAS','7999'],
    ['NT','0800'],
    ['NT','0899'],
    ['NT','0900'],
    ['NT','0999']
] 

const positiveStreetAddressEnding = [
'12 Scary ACCESS',
'512 Bary ACCS',
'16A Clary ALLEY',
'10 Glarey ALLY',
'211 Concard ALLEYWAY',
'13 Gons ALWY',
'509 Barry AMBLE',
'11 Gordon AMBL',
'505 Vinay ANCHORAGE',
'206 Lee ANCG',
'211 Onbud APPROACH',
'12 Hume APP',
'502 Scary ARCADE',
'11 Bary ARC',
'498 Clary ARTERY',
'206 Glarey ART',
'211 Gons AVENUE',
'12 Barry AVE',
'491 Lee BASIN',
'206 Steven BASN',
'10 Onbud BEACH',
'211 Hume BCH',
'12 Scary BRIDGE',
'488 Bary BDGE',
'11 Clary BROADWAY',
'484 Glarey BDWY',
'206 Concard BEND',
'211 Barry BLOCK',
'12 Gordon BLK',
'11 Lee BRAE',
'477 Steven BRACE',
'206 Onbud BRCE',
'211 Scary BREAK',
'12 Bary BRK',
'474 Clary BROW',
'470 Concard BOULEVARD',
'10 Gons BVD',
'211 Barry BYPASS',
'475 Gordon BYPA',
'8 Vinay BYWAY',
'11 Lee BYWY',
'4 Steven CAUSEWAY',
'10 Onbud CAUS',
'211 Hume CIRCUIT',
'9 Scary CCT',
'8 Bary CUL-DE-SAC',
'11 Clary CDS',
'4 Glarey CHASE',
'206 Concard CH',
'10 Gons CIRCLE',
'211 Barry CIR',
'12 Gordon CLOSE',
'1 Vinay CL',
'11 Lee COLONNADE',
'116 Steven CLDE',
'206 Onbud CIRCLET',
'10 Hume CLT',
'211 Scary COMMON',
'12 Bary CMMN',
'113 Clary CENTRAL',
'11 Glarey CN',
'206 Gons CORNER',
'10 Barry CNR',
'211 Gordon CENTREWAY',
'12 Vinay CNWY',
'106 Lee CONCOURSE',
'11 Steven CON',
'102 Onbud COVE',
'206 Hume CROSSWAY',
'3 Scary COWY',
'101 Bary COPSE',
'10 Clary CPS',
'211 Glarey CIRCUS',
'207 Concard CRCS',
'1 Gons CROSSROAD',
'11 Barry CRD',
'22 Gordon CRESCENT',
'206 Vinay CRES',
'10 Lee CROSSING',
'211 Steven CRSG',
'12 Onbud CROSS',
'22 Hume CRSS',
'11 Scary CREST',
'1 Bary CRST',
'13 Clary CORSO',
'22 Glarey CSO',
'17 Concard COURT',
'10 Gons CT',
'211 Barry CENTRE',
'14 Gordon CTR',
'22 Vinay CUTTING',
'11 Lee CTTG',
'1 Steven COURTYARD',
'15 Onbud CTYD',
'17 Scary CRUISEWAY',
'10 Bary CUWY',
'211 Clary DALE',
'22 Concard DELL',
'1 Barry DEVIATION',
'17 Gordon DEVN',
'22 Vinay DIP',
'17 Lee DRIVE',
'10 Steven DR',
'211 Onbud DRIVEWAY',
'18 Hume DRWY',
'22 Scary DISTRIBUTOR',
'11 Bary DSTR',
'1 Clary EAST',
'19 Glarey E',
'22 Concard EDGE',
'17 Gons ELBOW',
'10 Barry ELB',
'211 Gordon END',
'20 Vinay ENTRANCE',
'22 Lee ENT',
'1 Onbud ESPLANADE',
'21 Hume ESP',
'22 Scary ESTATE',
'17 Bary EST',
'10 Clary EXPRESSWAY',
'211 Glarey EXP',
'22 Concard EXTENSION',
'22 Gons EXTN',
'11 Barry FAIRWAY',
'1 Gordon FAWY',
'23 Vinay FIRETRAIL',
'22 Lee FITR',
'17 Steven FLAT',
'22 Bary FOLLOW',
'11 Clary FOLW',
'1 Glarey FORMATION',
'25 Concard FORM',
'22 Gons FRONT',
'17 Barry FRNT',
'10 Gordon FRONTAGE',
'211 Vinay FRTG',
'26 Lee FORESHORE',
'22 Steven FSHR',
'11 Onbud FIRE TRACK',
'1 Hume FTRK',
'27 Scary FOOTWAY',
'22 Bary FTWY',
'17 Clary FREEWAY',
'10 Glarey FWY',
'211 Concard GAP',
'28 Gons GARDEN',
'22 Barry GDN',
'11 Gordon GARDENS',
'22 Vinay GDNS',
'206 Lee GLADE',
'10 Steven GLD',
'211 Onbud GLEN',
'12 Hume GULLY',
'111 Glen GLY',
'22 Scary GROVE',
'5 Bary GR',
'10 Clary GRANGE',
'211 Glarey GRA',
'112 Concard GREEN',
'22 Gons GRN',
'8 Barry GROUND',
'10 Gordon GRND',
'211 Vinay GATE',
'113 Lee GTE',
'22 Steven GATES',
'3 Onbud GTES',
'211 Scary HILL',
'114 Bary HIGHROAD',
'22 Clary HRD',
'8 Glarey HEIGHTS',
'10 Concard HTS',
'211 Gons HIGHWAY',
'115 Barry HWY',
'22 Gordon INTERCHANGE',
'3 Vinay INTG',
'10 Lee INTERSECTION',
'211 Steven INTN',
'116 Onbud JUNCTION',
'22 Hume JNC',
'8 Scary KEY',
'211 Clary LANE',
'117 Glarey LANDING',
'22 Concard LDG',
'3 Gons LEES',
'10 Barry LINE',
'211 Gordon LINK',
'118 Vinay LOOKOUT',
'22 Lee LKT',
'10 Onbud LANEWAY',
'211 Hume LNWY',
'119 Glarey LOOP',
'22 Concard LOWER',
'211 Gordon LR',
'11 Vinay LITTLE',
'22 Lee LT',
'8 Steven MALL',
'10 Onbud MEW',
'211 Hume MEWS',
'12 Glarey MEANDER',
'22 Concard MNDR',
'211 Gordon MOUNT',
'11 Vinay MT',
'22 Lee MOTORWAY',
'8 Steven MWY',
'10 Onbud NORTH',
'211 Hume N',
'12 Glarey NORTH EAST',
'22 Concard NE',
'211 Gordon NOOK',
'11 Vinay NORTH WEST',
'22 Lee NW',
'8 Steven OUTLOOK',
'10 Onbud OTLK',
'211 Hume PARK',
'12 Glarey PART',
'22 Concard PASS',
'211 Gordon PATH',
'11 Vinay PARADE',
'22 Lee PDE',
'8 Steven PATHWAY',
'10 Onbud PHWY',
'211 Hume PIAZZA',
'12 Glarey PIAZ',
'22 Concard PARKLANDS',
'211 Gordon PKLD',
'11 Vinay POCKET',
'22 Lee PKT',
'8 Steven PARKWAY',
'10 Onbud PKWY',
'211 Hume PLACE',
'12 Glarey PL',
'22 Concard PLATEAU',
'211 Gordon PLAT',
'11 Vinay PLAZA',
'22 Lee PLZA',
'8 Steven POINT',
'10 Onbud PNT',
'211 Hume PORT',
'12 Glarey PROMENADE',
'22 Concard PROM',
'8 Steven QUADRANT',
'10 Onbud QDRT',
'211 Hume QUAD',
'12 Glarey QUAY',
'22 Concard QY',
'211 Gordon QUAYS',
'11 Vinay QYS',
'22 Lee RAMP',
'8 Steven REACH',
'10 Onbud RCH',
'211 Hume ROAD',
'12 Glarey RD',
'22 Concard RIDGE',
'211 Gordon RDGE',
'11 Vinay ROADS',
'22 Lee RDS',
'8 Steven ROADSIDE',
'10 Onbud RDSD',
'211 Hume ROADWAY',
'12 Glarey RDWY',
'22 Concard RESERVE',
'211 Gordon RES',
'11 Vinay REST',
'22 Lee RIDGEWAY',
'8 Steven RGWY',
'10 Onbud RIDE',
'211 Hume RING',
'12 Glarey RISE',
'22 Concard RAMBLE',
'211 Gordon RMBL',
'11 Vinay ROUND',
'22 Lee RND',
'8 Steven RONDE',
'10 Onbud RNDE',
'211 Hume RANGE',
'12 Glarey RNGE',
'22 Concard RIGHT OF WAY',
'211 Gordon ROFW',
'11 Vinay ROW',
'22 Lee ROSEBOWL',
'8 Steven RSBL',
'10 Onbud ROUTE',
'211 Hume RTE',
'22 Concard RETREAT',
'211 Gordon RTT',
'11 Vinay ROTARY',
'22 Lee RTY',
'8 Steven RUE',
'10 Onbud RUN',
'211 Hume RIVER',
'12 Glarey RVR',
'22 Concard RIVIERA',
'211 Gordon RVRA',
'11 Vinay RIVERWAY',
'22 Lee RVWY',
'8 Steven SOUTH',
'10 Onbud S',
'211 Hume SUBWAY',
'12 Glarey SBWY',
'22 Concard SIDING',
'9 Vinay SDNG',
'22 Lee SOUTH EAST',
'8 Steven SE',
'10 Onbud STATE HIGHWAY',
'211 Hume SHWY',
'10 Glarey SLOPE',
'22 Concard SLPE',
'9 Vinay SOUND',
'22 Lee SND',
'8 Steven SPUR',
'10 Onbud SQUARE',
'211 Hume SQ',
'10 Glarey STREET',
'22 Concard ST',
'9 Vinay STEPS',
'22 Lee STPS',
'8 Steven STRAND',
'10 Onbud STRA',
'211 Hume STRIP',
'10 Glarey STRP',
'22 Concard STAIRS',
'9 Vinay STRS',
'10 Onbud SOUTH WEST',
'211 Hume SW',
'10 Glarey SERVICE WAY',
'22 Concard SWY',
'9 Vinay TARN',
'22 Lee TERRACE',
'8 Steven TCE',
'10 Onbud THOROUGHFARE',
'211 Hume THOR',
'22 Concard TRUNKWAY',
'9 Vinay TKWY',
'22 Lee TOLLWAY',
'8 Steven TLWY',
'10 Onbud TOP',
'211 Hume TOR',
'10 Glarey TRIANGLE',
'22 Concard TRI',
'9 Vinay TRACK',
'22 Lee TRK',
'8 Steven TRAIL',
'10 Onbud TRL',
'211 Hume TRAILER',
'10 Glarey TRLR',
'22 Concard TURN',
'9 Vinay TOWERS',
'22 Lee TWRS',
'8 Steven UPPER',
'10 Onbud UP',
'211 Hume UNDERPASS',
'10 Glarey UPAS',
'22 Concard VALE',
'9 Vinay VIADUCT',
'22 Lee VDCT',
'8 Steven VIEW',
'10 Onbud VILLAS',
'10 Glarey VISTA',
'9 Vinay WEST',
'22 Lee W',
'8 Steven WADE',
'10 Onbud WALK',
'211 Hume WAY',
'22 Concard WHARF',
'9 Vinay WHRF',
'22 Lee WALKWAY',
'8 Steven WKWY',
'10 Onbud WYND',
'211 Hume YARD',

// New test cases NB-673
'Unit 11/12 Scary street',
'Unit 11 512 Bary Street',
'16A Clary STREET',
'Unit 11 512 Bary ACCS',
'16A Clary ALLEY',
'U22/10 Glarey ALLY',
'U11 211 Concard Alleyway',
'House 13 Gons alwy',
'509 Barry Amble',
'Apartment 2 10 Masson street',
'Apt 2 10 Masson St',
'Unit 11/12 Scary ACCESS',
'Unit 11/12 Scary STREET',
'U2 15 Apple St'
]

const negativeStreetAddressEnding = [
    '10 Steven ANNEX',
    '10 Concard ARTERIAL',
    '495 Gordon BANAN',
    '11 Vinay BANK',
    '10 Gons BIDI',
    '481 Vinay BOWL',
    '10 Hume BROADWALK',
    '11 Glarey BUSWAY',
    '109 Concard CONCORD',
    '22 Hume CUT',
    '16 Glarey DASH',
    '11 Gons DENE',
    '11 Steven EASEMENT',
    '10 Onbud FIRELINE',
    '211 Hume FORD',
    '24 Scary FORK',
    '10 Hume GATEWAY',
    '211 Gordon PURSUIT',
    '11 Vinay PASSAGE',
    '22 Lee QUADRANGLEQDGL',
    '12 Glarey RETURN',
    '22 Lee STRAIGHT',
    '8 Steven SERVICEWAY',
    '10 Glarey THROUGHWAY',
    '211 Hume ,VLLS',
    '22 Concard ,VSTA',
    '10 Glarey WOODS',
    '11 Vinay BANK'
]

const negativeStreetAddressStarting = [
    'Londsdale Circuit',
    'Canary Wharf',
    ' Little Whinging Street',
    //TODO Check this with Rob '1137A111 Tuggeranong Way'
]

const negativeStreetAddressWithPOBox = [
    "21 Little Wharf PO Box", 
    "11 Little Wharf PO Box 1234", 
    "10 Diagon Alley P.O. Box", 
    "12 Market Steet PO. Box 3212", 
    "1 Twenty Road PO BOX", 
    "88 Gungahlin Place P.O BOX111"
]

const negativeStreetAddressWithNoMinimum3Words = [
    "111 STREET", 
    "3 Margaret"
]

const mockStreetAddressErrorsMap = {
    ERROR_INVALID_STREET_ADDRESS: "Please enter a valid street address",
    ERROR_INVALID_STREET_ADDRESS_PO_BOX: "Enter a valid address. We can't accept a PO Box.",
    ERROR_INVALID_STREET_ADDRESS_START: "Enter your street number.",
    ERROR_INVALID_STREET_ADDRESS_END: "Enter a valid street type.",
}

const mockPostalCodeErrorsMap = {
    ERROR_INVALID_POSTCODE: "Your postcode must be 4 characters and can only contain numbers.",
    ERROR_INVALID_POSTCODE_STATE: "Your postcode and state do not match.",
}

const isBlankMockFn = (data) => {
    data = data.trim()
    return !(data.length > 0)
}


describe.each(negativePostalCode_InvalidFormat) ('With State : %s, Postal Code : %s', (stateCode, postalCode) => {
    test('Postal Code Validation : Checking Negative Case (Invalid Postal Code Format)', ()=> {
        let resp = validation.isValidPostalCode(stateCode, postalCode, isBlankMockFn, mockPostalCodeErrorsMap)
        expect(resp.valid).toBeFalsy()
        expect(resp.errMsg).toBe(mockPostalCodeErrorsMap.ERROR_INVALID_POSTCODE)
    });
});

describe.each(negativePostalCodes_StateMismatch) ('With State : %s, Postal Code : %s', (stateCode, postalCode) => {
    test('Postal Code Validation : Checking Negative Case (Postal code , state mismatch) ', ()=> {
        let resp = validation.isValidPostalCode(stateCode, postalCode, isBlankMockFn, mockPostalCodeErrorsMap)
        expect(resp.valid).toBeFalsy()
        expect(resp.errMsg).toBe(mockPostalCodeErrorsMap.ERROR_INVALID_POSTCODE_STATE)
    });
});

describe.each(negativePostalCode_NoState_PostalCodeInvalidFormat) ('With State : %s, Postal Code : %s', (stateCode, postalCode) => {
    test('Postal Code Validation : Checking Negative Case (No State, Postal Code Invalid Format) ', ()=> {
        let resp = validation.isValidPostalCode(stateCode, postalCode, isBlankMockFn, mockPostalCodeErrorsMap)
        expect(resp.valid).toBeFalsy()
        expect(resp.errMsg).toBe(mockPostalCodeErrorsMap.ERROR_INVALID_POSTCODE)
    });
});

describe.each(positivePostalCodes) ('With State : %s, Postal Code : %s', (stateCode, postalCode) => {
    test('Postal Code Validation : Checking Positive Case ', ()=> {
        expect(validation.isValidPostalCode(stateCode, postalCode, isBlankMockFn, mockPostalCodeErrorsMap)).toBeTruthy()
    });
});

describe.each(positivePostalCode_NoState_PostalCodeValidFormat) ('With State : %s, Postal Code : %s', (stateCode, postalCode) => {
    test('Postal Code Validation : Checking Positive Case (No State, Postal Code VALID Format) ', ()=> {
        let resp = validation.isValidPostalCode(stateCode, postalCode, isBlankMockFn, mockPostalCodeErrorsMap)
        expect(resp.valid).toBeTruthy()        
    });
});

describe.each(positiveStreetAddressEnding) ('\nWith Street Address %s', (streetAddr) => {
    test('Street Address Ending (Suffix) Validation :  Checking Positive Case ', ()=> {
        expect(validation.isValidStreetAddress(streetAddr, isBlankMockFn, mockStreetAddressErrorsMap).valid).toBeTruthy()
    });
});
describe.each(negativeStreetAddressEnding) ('\nWith Street Address %s', (streetAddr) => {
    test('Street Address Ending (Suffix) Validation :  Checking Negative Case ', ()=> {
        let resp = validation.isValidStreetAddress(streetAddr, isBlankMockFn, mockStreetAddressErrorsMap)
        expect(resp.valid).toBeFalsy()
        expect(resp.errMsg).toBe(mockStreetAddressErrorsMap.ERROR_INVALID_STREET_ADDRESS_END)
    });
});
// NB-673
// describe.each(negativeStreetAddressStarting) ('\nWith Street Address %s', (streetAddr) => {
//     test('Street Address Start (Prefix) Validation :  Checking Negative Case ', ()=> {
//         let resp = validation.isValidStreetAddress(streetAddr, isBlankMockFn, mockStreetAddressErrorsMap)
//         expect(resp.valid).toBeFalsy()
//         expect(resp.errMsg).toBe(mockStreetAddressErrorsMap.ERROR_INVALID_STREET_ADDRESS_START)
//     });
// });

describe.each(negativeStreetAddressWithPOBox) ('\nWith Street Address %s', (streetAddr) => {
    test('Does not contain PO Box Validation :  Checking Negative Case ', ()=> {
        let resp = validation.isValidStreetAddress(streetAddr, isBlankMockFn, mockStreetAddressErrorsMap)
        expect(resp.valid).toBeFalsy()
        expect(resp.errMsg).toBe(mockStreetAddressErrorsMap.ERROR_INVALID_STREET_ADDRESS_PO_BOX)
    });
});

describe.each(negativeStreetAddressWithNoMinimum3Words) ('\nWith Street Address %s', (streetAddr) => {
    test('Does not have minimum 3 words in Street Address :  Checking Negative Case ', ()=> {
        let resp = validation.isValidStreetAddress(streetAddr, isBlankMockFn, mockStreetAddressErrorsMap)
        expect(resp.valid).toBeFalsy()
        expect(resp.errMsg).toBe(mockStreetAddressErrorsMap.ERROR_INVALID_STREET_ADDRESS)
    });
});

test('Street Address Blank Validation :  Checking Negative Case ', ()=> {
    let resp = validation.isValidStreetAddress('    ', isBlankMockFn, mockStreetAddressErrorsMap)
    expect(resp.valid).toBeFalsy()
    expect(resp.errMsg).toBe(mockStreetAddressErrorsMap.ERROR_INVALID_STREET_ADDRESS)
});
