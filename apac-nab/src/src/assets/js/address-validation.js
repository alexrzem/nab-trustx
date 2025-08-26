const statewisePostalData = [
    {
        "stateCode": "NSW",
        "allowedPostalCodes": [
            "1000-1999", "2000-2599", "2619-2899", "2921-2999"
        ],
        "exemptedPostCodes": ["2611", "2540", "2620", "3500", "3585", "3644", "3707", "4380", "4377", "3691"]
    },
    {
        "stateCode": "ACT",
        "allowedPostalCodes": [
            "0200-0299", "2600-2618", "2900-2920"
        ]
    },
    {
        "stateCode": "VIC",
        "allowedPostalCodes": [
            "3000-3999", "8000-8999"
        ]
    },
    {
        "stateCode": "QLD",
        "allowedPostalCodes": [
            "4000-4999", "9000-9999"
        ]
    },
    {
        "stateCode": "SA",
        "allowedPostalCodes": [
            "5000-5799", "5800-5999"
        ],
        "exemptedPostCodes": ["0872"]
    },
    {
        "stateCode": "WA",
        "allowedPostalCodes": [
            "6000-6797", "6800-6999"
        ],
        "exemptedPostCodes": ["0872"]
    },
    {
        "stateCode": "TAS",
        "allowedPostalCodes": [
            "7000-7799", "7800-7999"
        ]
    },
    {
        "stateCode": "NT",
        "allowedPostalCodes": [
            "0800-0899", "0900-0999"
        ]
    },
];

const STREET_SUFFIXES = [
    "ACCESS","ACCS",
    "ALLEY","ALLY",
    "ALLEYWAY","ALWY",
    "AMBLE","AMBL",
    "ANCHORAGE","ANCG",
    "APPROACH","APP",
    "ARCADE","ARC",
    "ARTERY","ART",
    "AVENUE","AVE",
    "BASIN","BASN",
    "BEACH","BCH",
    "BRIDGE","BDGE",
    "BROADWAY","BDWY",
    "BEND","BEND",
    "BLOCK","BLK",
    "BRAE","BRAE",
    "BRACE","BRCE",
    "BREAK","BRK",
    "BROW","BROW",
    "BOULEVARD","BVD",
    "BYPASS","BYPA",
    "BYWAY","BYWY",
    "CAUSEWAY","CAUS",
    "CIRCUIT","CCT",
    "CUL-DE-SAC","CDS",
    "CHASE","CH",
    "CIRCLE","CIR",
    "CLOSE","CL",
    "COLONNADE","CLDE",
    "CIRCLET","CLT",
    "COMMON","CMMN",
    "CENTRAL","CN",
    "CORNER","CNR",
    "CENTREWAY","CNWY",
    "CONCOURSE","CON",
    "COVE","COVE",
    "CROSSWAY","COWY",
    "COPSE","CPS",
    "CIRCUS","CRCS",
    "CROSSROAD","CRD",
    "CRESCENT","CRES",
    "CROSSING","CRSG",
    "CROSS","CRSS",
    "CREST","CRST",
    "CORSO","CSO",
    "COURT","CT",
    "CENTRE","CTR",
    "CUTTING","CTTG",
    "COURTYARD","CTYD",
    "CRUISEWAY","CUWY",
    "DALE","DALE",
    "DELL","DELL",
    "DEVIATION","DEVN",
    "DIP","DIP",
    "DRIVE","DR",
    "DRIVEWAY","DRWY",
    "DISTRIBUTOR","DSTR",
    "EAST","E",
    "EDGE","EDGE",
    "ELBOW","ELB",
    "END","END",
    "ENTRANCE","ENT",
    "ESPLANADE","ESP",
    "ESTATE","EST",
    "EXPRESSWAY","EXP",
    "EXTENSION","EXTN",
    "FAIRWAY","FAWY",
    "FIRETRAIL","FITR",
    "FLAT","FLAT",
    "FOLLOW","FOLW",
    "FORMATION","FORM",
    "FRONT","FRNT",
    "FRONTAGE","FRTG",
    "FORESHORE","FSHR",
    "FIRE TRACK","FTRK",
    "FOOTWAY","FTWY",
    "FREEWAY","FWY",
    "GAP","GAP",
    "GARDEN","GDN",
    "GARDENS","GDNS",
    "GLADE","GLD",
    "GLEN","GLEN",
    "GULLY","GLY",
    "GROVE","GR",
    "GRANGE","GRA",
    "GREEN","GRN",
    "GROUND","GRND",
    "GATE","GTE",
    "GATES","GTES",
    "HILL","HILL",
    "HIGHROAD","HRD",
    "HEIGHTS","HTS",
    "HIGHWAY","HWY",
    "INTERCHANGE","INTG",
    "INTERSECTION","INTN",
    "JUNCTION","JNC",
    "KEY","KEY",
    "LANE","LANE",
    "LANDING","LDG",
    "LEES","LEES",
    "LINE","LINE",
    "LINK","LINK",
    "LOOKOUT","LKT",
    "LANEWAY","LNWY",
    "LOOP","LOOP",
    "LOWER","LR",
    "LITTLE","LT",
    "MALL","MALL",
    "MEW","MEW",
    "MEWS","MEWS",
    "MEANDER","MNDR",
    "MOUNT","MT",
    "MOTORWAY","MWY",
    "NORTH","N",
    "NORTH EAST","NE",
    "NOOK","NOOK",
    "NORTH WEST","NW",
    "OUTLOOK","OTLK",
    "PARK","PARK",
    "PART","PART",
    "PASS","PASS",
    "PATH","PATH",
    "PARADE","PDE",
    "PATHWAY","PHWY",
    "PIAZZA","PIAZ",
    "PARKLANDS","PKLD",
    "POCKET","PKT",
    "PARKWAY","PKWY",
    "PLACE","PL",
    "PLATEAU","PLAT",
    "PLAZA","PLZA",
    "POINT","PNT",
    "PORT","PORT",
    "PROMENADE","PROM",
    "QUADRANGLE","QDGL",
    "QUADRANT","QDRT",
    "QUAD","QUAD",
    "QUAY","QY",
    "QUAYS","QYS",
    "RAMP","RAMP",
    "REACH","RCH",
    "ROAD","RD",
    "RIDGE","RDGE",
    "ROADS","RDS",
    "ROADSIDE","RDSD",
    "ROADWAY","RDWY",
    "RESERVE","RES",
    "REST","REST",
    "RIDGEWAY","RGWY",
    "RIDE","RIDE",
    "RING","RING",
    "RISE","RISE",
    "RAMBLE","RMBL",
    "ROUND","RND",
    "RONDE","RNDE",
    "RANGE","RNGE",
    "RIGHT OF WAY","ROFW",
    "ROW","ROW",
    "ROSEBOWL","RSBL",
    "ROUTE","RTE",
    "RETREAT","RTT",
    "ROTARY","RTY",
    "RUE","RUE",
    "RUN","RUN",
    "RIVER","RVR",
    "RIVIERA","RVRA",
    "RIVERWAY","RVWY",
    "SOUTH","S",
    "SUBWAY","SBWY",
    "SIDING","SDNG",
    "SOUTH EAST","SE",
    "STATE HIGHWAY","SHWY",
    "SLOPE","SLPE",
    "SOUND","SND",
    "SPUR","SPUR",
    "SQUARE","SQ",
    "STREET","ST",
    "STEPS","STPS",
    "STRAND","STRA",
    "STRIP","STRP",
    "STAIRS","STRS",
    "SOUTH WEST","SW",
    "SERVICE WAY","SWY",
    "TARN","TARN",
    "TERRACE","TCE",
    "THOROUGHFARE","THOR",
    "TRUNKWAY","TKWY",
    "TOLLWAY","TLWY",
    "TOP","TOP",
    "TOR","TOR",
    "TRIANGLE","TRI",
    "TRACK","TRK",
    "TRAIL","TRL",
    "TRAILER","TRLR",
    "TURN","TURN",
    "TOWERS","TWRS",
    "UPPER","UP",
    "UNDERPASS","UPAS",
    "VALE","VALE",
    "VIADUCT","VDCT",
    "VIEW","VIEW",
    "VILLAS","VLLS",
    "VISTA","VSTA",
    "WEST","W",
    "WADE","WADE",
    "WALK","WALK",
    "WAY","WAY",
    "WHARF","WHRF",
    "WALKWAY","WKWY",
    "WYND","WYND",
    "YARD","YARD"
  ]

const isBlankFn = (data) => {
    data = data.trim()
    return !(data.length > 0)
}

const validateStreetAddress = (element) => {
    const targetId = element.prop('id')
    const targetValue = element.val()

    if (!needToValidateMatrix.has(targetId)) {
      return
    }

    const errorsObj = {
        ERROR_INVALID_STREET_ADDRESS: ERROR_INVALID_STREET_ADDRESS,
        ERROR_INVALID_STREET_ADDRESS_PO_BOX: ERROR_INVALID_STREET_ADDRESS_PO_BOX,
        ERROR_INVALID_STREET_ADDRESS_START: ERROR_INVALID_STREET_ADDRESS_START,
        ERROR_INVALID_STREET_ADDRESS_END: ERROR_INVALID_STREET_ADDRESS_END,
    }

    const resp = isValidStreetAddress(targetValue, isBlankFn, errorsObj)
    if(resp.valid) {
        removeError(element)
        currentlyValidatedMatrix.add(targetId)
    } else {
        setError(element, resp.errMsg)
        removeIdFromValidatedMatrix(targetId)
    }
}

const hasMinThreeWords = (data) => {
    let words = data.trim().split(" ")
    if(words.length > 2){
      return true;
    }else {
      return false;
    }
  }

const doesContainPOBoxText = (data) => {
    const identifiers = ["PO Box", "P.O. Box", "PO. Box", "PO BOX", "P.O BOX"]
    for (const identifier of identifiers) {
      if (data.includes(identifier)) {
        return true
      }
    }
    return false
}

const isValidStreetAddress = (streetAddress, isBlankFn, errorsMsgsObj) => {
    let errMsg = '';
    let isValid = false;

    if (isBlankFn(streetAddress)) {
        errMsg = errorsMsgsObj.ERROR_INVALID_STREET_ADDRESS
        isValid = false
      } else if (doesContainPOBoxText(streetAddress)) {
        errMsg = errorsMsgsObj.ERROR_INVALID_STREET_ADDRESS_PO_BOX
        isValid = false
      } 
    //   Fix for BVT / NB-673
    //   else if (!checkStreetNameStart(streetAddress)) {
    //     errMsg = errorsMsgsObj.ERROR_INVALID_STREET_ADDRESS_START
    //     isValid = false
    //   } 
      else if (!hasMinThreeWords(streetAddress)) {
        errMsg = errorsMsgsObj.ERROR_INVALID_STREET_ADDRESS
        isValid = false
      } else if (!checkStreetNameEnd(streetAddress)) {
        errMsg = errorsMsgsObj.ERROR_INVALID_STREET_ADDRESS_END
        isValid = false
      } else {
        isValid = true
      }
      const resp = {valid: isValid, errMsg : errMsg}
      return resp
}


// Check Functions 

const checkStreetNameStart = (data) => {
    let validate = ""
    if(data.trim().indexOf(" ") > 0) {
      validate = data.trim().split(" ")[0]
    } else {
      validate = data
    }
    return /^[0-9]{1,4}[a-z0-9]{0,1}/i.test(validate)
  }
  
const checkStreetNameEnd = (data) => {
    let words = data.trim().split(" ")
    let lastWordIndex = words.length -1
    let validate = words[lastWordIndex].toUpperCase()
    for(i = 0;  i < STREET_SUFFIXES.length; i++){
        if(validate.length >= STREET_SUFFIXES[i].length) {
            if (validate === STREET_SUFFIXES[i]) {
                return true
            }
        }
    }
    return false
}

const validatePostalCode = (element) => {
    const targetId = element.prop('id')
    const postalCode = element.val()
    if (!needToValidateMatrix.has(targetId)) {
      return
    }

    const addrStateCode = document.getElementById("documentAddressState").value.trim().toUpperCase()
    
    const errorsMsgsObj = {
        ERROR_INVALID_POSTCODE: ERROR_INVALID_POSTCODE,
        ERROR_INVALID_POSTCODE_STATE: ERROR_INVALID_POSTCODE_STATE,
    }

    let resp = isValidPostalCode(addrStateCode, postalCode, isBlankFn, errorsMsgsObj)
    if (resp.valid) {
        removeError(element)
        currentlyValidatedMatrix.add(targetId)
    } else {
        setError(element, resp.errMsg)
        removeIdFromValidatedMatrix(targetId)
    }
}

const isValidPostalCode = (stateCode, postalCode, isBlankFn, errorsMsgsObj) => {
    let isValid = false
    let errMsg = ''

    const postalCodeRE = /^\d{4}$/;
    const isFmtValid = postalCodeRE.test(postalCode)

    if (!isBlankFn(postalCode)) {
        if(stateCode) {
            if (isFmtValid) {
                console.log('Postal Code is ' + postalCode)
                postalCode = parseInt(postalCode)
                const stateAllowedPostalCodesObj = statewisePostalData.find((x)=> x.stateCode === stateCode);
                const allowedPostalCodes = stateAllowedPostalCodesObj.allowedPostalCodes;
                console.log(allowedPostalCodes)
        
                let matchFound = false
                console.log('Postal Code is ' + postalCode)
                for (allowedRangePair of allowedPostalCodes) {
                    const allowedRangeBounds = allowedRangePair.split('-')
                    const lbound = parseInt(allowedRangeBounds[0])
                    const ubound = parseInt(allowedRangeBounds[1])
        
                    if (postalCode >= lbound && postalCode<= ubound) {
                        //Match and Exit
                        matchFound = true
                        break
                    }            
                }
        
                if (!matchFound) {
                    // Try the exemptions
                    const exemptedPostCodesArr = stateAllowedPostalCodesObj.exemptedPostCodes;
                    if (exemptedPostCodesArr) {
                        for (exemptedPostalCode of exemptedPostCodesArr) {                    
                            if (parseInt(exemptedPostalCode) === postalCode) {
                                matchFound = true
                                break
                            }
                        }
                    }
                }
        
                isValid = matchFound ? true : false
                if (matchFound) {
                    isValid = true
                } else {
                    isValid = false
                    errMsg = errorsMsgsObj.ERROR_INVALID_POSTCODE_STATE
                }
            } else {
                isValid = false
                errMsg = errorsMsgsObj.ERROR_INVALID_POSTCODE
            }
        } else {
            if (isFmtValid) {
                isValid = true
            } else {
                isValid = false
                errMsg = errorsMsgsObj.ERROR_INVALID_POSTCODE
            }
        }

    } else {
        isValid = false
        errMsg = errorsMsgsObj.ERROR_INVALID_POSTCODE
    }

    const resp = {valid : isValid, errMsg : errMsg}
    return resp

}

//Enable the below commented lines, only when running jest
// module.exports =  {
//     isValidPostalCode,
//     isValidStreetAddress
// }
