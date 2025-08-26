/**
 * @typedef NabAddress
 * @type {object}
 * @property {string|undefined} unitType Contains the unit type of the address.
 * @property {string|undefined} unitNumber Unit number of the property.
 * @property {string|undefined} floorLevel Descriptors used to identifier the floor or level of a multi-storey building or complex
 * @property {string|undefined} buildingPropertyName The full named used to identify the physical building or property.
 * @property {string|undefined} streetName The full street name used to identify the street location of the property together with the thoroughfare type.
 * @property {string|undefined} streetType Thoroughfare type.
 * @property {string|undefined} streetTypeSuffix Street type suffix.
 * @property {string} suburbPlaceLocality The full name of the placename or Post Office of delivery containing the specific address.
 * @property {string} stateTerritory The defined State of Territory in Australia (in abbreviated format) that the specific placename/address is located.
 * @property {string} postCode A four digital numeric descriptor for a postal delivery area, aligned with placename, suburb or locality and in some circumstances a unique Postal Delivery Type.
 * @property {string|undefined} postalDeliveryType Identification of a specific postal address and the service number.
 * @property {string|undefined} postalDeliveryNumber Identification of a specific postal address number.
 * @property {string} country Country 2 char code (ISO 3166-1 alpha 2).
 * @property {string|undefined} streetNumber This is a record off the numeric or numeric/alpha reference for a house or property.
 * @property {string|undefined} lotSectionNumber The lot/section reference allocated to a property, recorded by the appropriate Government Department, during the sub-division of a particular parcel off land.
 * @property {string|undefined} dpId Delivery point barcode.
 * @property {string|undefined} fullAddress Single line, full address.
 */

/**
 * @callback AddressErrorCallback
 * @param {number} statusCode The status code returned by the HTTP request
 * @param {string} errorId Human readable, unique name of the error.
 * @param {string} message Message describing the error.
 */

/**
 * @typedef AddressValidationResponse
 * @type {object}
 * @property {'Verified Match'|'Interaction required'|'Multiple matches'|'Partial match'|'No match'} confidence The level of confidence returned for the address validated.
 * @property {NabAddress} address Populated with a formatted address when a single address can be matched with.
 */


/**
 * @callback ValidateSuccessCallback
 * @param {AddressValidationResponse} response The response from the API containing the formatted address.
 */

/**
 * Validates an address captured from document OCR.
 * @param {object} sessionData Session data provided from TrustX.
 * @param {string} address The address to search.
 * @param {ValidateSuccessCallback} successCallback The callback executed upon a successful validation request.
 * @param {AddressErrorCallback} errorCallback The callback executed should the validation request API return a failure.
 */
function validateAddress(sessionData, address, successCallback, errorCallback) {

    let token = sessionData?.idv['addressToken'] ?? sessionData?.idv?.config['openAPIToken']

    const xhr = new XMLHttpRequest();
    xhr.open('POST', sessionData?.idv?.config['nabAddressServiceBaseUrl'] + sessionData?.idv?.config['nabAddressValidateUrl'], true);
    // xhr.setRequestHeader('x-nab-accesstoken', token ?? ""); // NB-760
    xhr.setRequestHeader('Authorization', 'Bearer ' + token ?? "");
    xhr.setRequestHeader('x-correlationid', uuidV4()); // NB-759
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
        if (xhr.status === 200) {
            successCallback(JSON.parse(xhr.responseText));
        } else {
            const res = JSON.parse(xhr.responseText)
            errorCallback(xhr.status, res['errorId'], res['statusText']);
        }
    }
    xhr.send(JSON.stringify({'addressString': address}));
}

/**
 * @callback FormattedAddressCallback
 * @param {NabAddress} response The response from the API containing the formatted address.
 */

/**
 * Get a formatted address for a given address ID.
 * @param {object} sessionData Session data provided from TrustX.
 * @param {string} addressId The ID of the address to get a formatted address for.
 * @param {FormattedAddressCallback} successCallback The callback executed upon a successful validation request.
 * @param {AddressErrorCallback} errorCallback The callback executed should the validation request API return a failure.
 */
function getAddress(sessionData, addressId, successCallback, errorCallback) {
    let token = sessionData?.idv['addressToken'] ?? sessionData?.idv?.config['openAPIToken']
    const xhr = new XMLHttpRequest();
    xhr.open('GET', sessionData?.idv?.config['nabAddressServiceBaseUrl'] + sessionData?.idv?.config['nabAddressGetUrl'] + "/" + addressId, true);
    // xhr.setRequestHeader('x-nab-accesstoken', token ?? ""); // NB-760
    xhr.setRequestHeader('Authorization', 'Bearer ' + token ?? "");
    xhr.setRequestHeader('x-correlationid', uuidV4()); // NB-759
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onload = () => {
        if (xhr.status === 200) {
            successCallback(JSON.parse(xhr.responseText));
        } else {
            const res = JSON.parse(xhr.responseText)
            errorCallback(xhr.status, res['errorId'], res['statusText']);
        }
    }
    xhr.send();
}

/**
 * @typedef SearchResultAddress
 * @type {object}
 * @property {string} addressId
 * @property {string} fullAddress
 */

/**
 * @typedef SearchResult
 * @type {object}
 * @property {SearchResultAddress[]} addresses The addresses which match this query.
 */

/**
 * @callback SearchAddressCallback
 * @param {SearchResult} response The response from the API containing the formatted address.
 */

/**
 * Get a formatted address for a given address ID.
 * @param {object} sessionData Session data provided from TrustX.
 * @param {string} addressString The search string to query for.
 * @param {string} countryCode The country code of the country to search, e.g. AU
 * @param {SearchAddressCallback} successCallback The callback executed upon a successful validation request.
 * @param {AddressErrorCallback} errorCallback The callback executed should the validation request API return a failure.
 */
function searchAddress(sessionData, addressString, countryCode, successCallback, errorCallback) {
    let token = sessionData?.idv['addressToken'] ?? sessionData?.idv?.config['openAPIToken']
    const xhr = new XMLHttpRequest();
    xhr.open('POST', sessionData?.idv?.config['nabAddressServiceBaseUrl'] + sessionData?.idv?.config['nabAddressSearchUrl'], true);
    // xhr.setRequestHeader('x-nab-accesstoken', token ?? ""); // NB-760
    xhr.setRequestHeader('Authorization', 'Bearer ' + token ?? "");
    xhr.setRequestHeader('x-correlationid', uuidV4()); // NB-759
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = () => {
        if (xhr.status === 200) {
            successCallback(JSON.parse(xhr.responseText));
        } else {
            const res = JSON.parse(xhr.responseText)
            errorCallback(xhr.status, res['errorId'], res['statusText']);
        }
    }
    xhr.send(JSON.stringify({'addressString': addressString, 'countryCode': countryCode}));
}


function uuidV4() {
    const uuid = new Array(36);
    for (let i = 0; i < 36; i++) {
        uuid[i] = Math.floor(Math.random() * 16);
    }
    uuid[14] = 4; // set bits 12-15 of time-high-and-version to 0100
    uuid[19] = uuid[19] &= ~(1 << 2); // set bit 6 of clock-seq-and-reserved to zero
    uuid[19] = uuid[19] |= (1 << 3); // set bit 7 of clock-seq-and-reserved to one
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    return uuid.map((x) => x.toString(16)).join('');
}


const streetTypes = [
    {key: "Access", value: "ACCS"},
    {key: "Alley", value: "ALLY"},
    {key: "Alleyway", value: "ALWY"},
    {key: "Amble", value: "AMBL"},
    {key: "Anchorage", value: "ANCG"},
    {key: "Annex", value: "ANX"},
    {key: "Approach", value: "APP"},
    {key: "Arcade", value: "ARC"},
    {key: "Artery", value: "ART"},
    {key: "Arterial", value: "ARTL"},
    {key: "Avenue", value: "AVE"},
    {key: "Banan", value: "BA"},
    {key: "Bank", value: "BNK"},
    {key: "Basin", value: "BASN"},
    {key: "Bay", value: ""},
    {key: "Beach", value: "BCH"},
    {key: "Bridge", value: "BDGE"},
    {key: "Broadway", value: "BDWY"},
    {key: "Bend", value: "BEND"},
    {key: "Bidi", value: "BIDI"},
    {key: "Block", value: "BLK"},
    {key: "Bowl", value: "BWL"},
    {key: "Brae", value: "BRAE"},
    {key: "Brace", value: "BRCE"},
    {key: "Broardwalk", value: "BWLK"},
    {key: "Break", value: "BRK"},
    {key: "Brow", value: "BROW"},
    {key: "Busway", value: "BUSWY"},
    {key: "Boulevard", value: "BVD"},
    {key: "Boulevarde", value: ""},
    {key: "Boardwalk", value: ""},
    {key: "Bypass", value: "BYPA"},
    {key: "Byway", value: "BYWY"},
    {key: "Causeway", value: "CAUS"},
    {key: "Circuit", value: "CCT"},
    {key: "Cul-de-sac", value: "CDS"},
    {key: "Chase", value: "CH"},
    {key: "Circle", value: "CIR"},
    {key: "Close", value: "CL"},
    {key: "Colonnade", value: "CLDE"},
    {key: "Cluster", value: ""},
    {key: "Circlet", value: "CLT"},
    {key: "Common", value: "CMMN"},
    {key: "Commons", value: ""},
    {key: "Central", value: "CN"},
    {key: "Concord", value: "CON"},
    {key: "Corner", value: "CNR"},
    {key: "Connection", value: ""},
    {key: "Centreway", value: "CNWY"},
    {key: "Concourse", value: "CON"},
    {key: "Cove", value: "COVE"},
    {key: "Crossway", value: "COWY"},
    {key: "Copse", value: "CPS"},
    {key: "Circus", value: "CRCS"},
    {key: "Crossroad", value: "CRD"},
    {key: "Crescent", value: "CRES"},
    {key: "Crief", value: ""},
    {key: "Course", value: ""},
    {key: "Crossing", value: "CRSG"},
    {key: "Cross", value: "CRSS"},
    {key: "Crest", value: "CRST"},
    {key: "Corso", value: "CSO"},
    {key: "Court", value: "CT"},
    {key: "Centre", value: "CTR"},
    {key: "Cutting", value: "CTTG"},
    {key: "Courtyard", value: "CTYD"},
    {key: "Cut", value: "CT"},
    {key: "Cruiseway", value: ""},
    {key: "Dale", value: "DALE"},
    {key: "Dash", value: "DASH"},
    {key: "Dell", value: "DELL"},
    {key: "Dene", value: "DENE"},
    {key: "Deviation", value: "DEVN"},
    {key: "Dip", value: "DIP"},
    {key: "Divide", value: ""},
    {key: "Dock", value: ""},
    {key: "Domain", value: ""},
    {key: "Down", value: ""},
    {key: "Drive", value: "DR"},
    {key: "Driveway", value: "DRWY"},
    {key: "Distributor", value: "DSTR"},
    {key: "Downs", value: ""},
    {key: "East", value: "E"},
    {key: "Edge", value: "EDGE"},
    {key: "Elbow", value: "ELB"},
    {key: "End", value: "END"},
    {key: "Entrance", value: "ENT"},
    {key: "Easement", value: "EASMT"},
    {key: "Esplanade", value: "ESP"},
    {key: "Estate", value: "EST"},
    {key: "Expressway", value: "EXP"},
    {key: "Extension", value: "EXTN"},
    {key: "Fairway", value: "FAWY"},
    {key: "Firetrail", value: "FITR"},
    {key: "Flat", value: "FLAT"},
    {key: "Fireline", value: "FTRK"},
    {key: "Ford", value: "FRD"},
    {key: "Fork", value: "FRK"},
    {key: "Formation", value: "FORM"},
    {key: "Front", value: "FRNT"},
    {key: "Frontage", value: "FRTG"},
    {key: "Foreshore", value: "FSHR"},
    {key: "Footway", value: "FTWY"},
    {key: "Freeway", value: "FWY"},
    {key: "Gap", value: "GAP"},
    {key: "Garden", value: "GDN"},
    {key: "Gardens", value: "GDNS"},
    {key: "Glade", value: "GLD"},
    {key: "Glen", value: "GLEN"},
    {key: "Gully", value: "GLY"},
    {key: "Grove", value: "GR"},
    {key: "Ground", value: "GRND"},
    {key: "Gate", value: "GTE"},
    {key: "Gates", value: "GTES"},
    {key: "Gateway", value: "GTW"},
    {key: "Hill", value: "HILL"},
    {key: "Hollow", value: ""},
    {key: "Harbour", value: ""},
    {key: "Highroad", value: "HRD"},
    {key: "Heath", value: ""},
    {key: "Heights", value: "HTS"},
    {key: "Hub", value: ""},
    {key: "Haven", value: ""},
    {key: "Highway", value: "HWY"},
    {key: "Island", value: ""},
    {key: "Interchange", value: "INTG"},
    {key: "Intersection", value: "INTN"},
    {key: "Junction", value: "JNC"},
    {key: "Key", value: "KEY"},
    {key: "Keys", value: "KYS"},
    {key: "Lane", value: "LANE"},
    {key: "Landing", value: "LDG"},
    {key: "Lees", value: "LEES"},
    {key: "Line", value: "LINE"},
    {key: "Link", value: "LINK"},
    {key: "Lookout", value: "LKT"},
    {key: "Linkway", value: "LKW"},
    {key: "Laneway", value: "LNWY"},
    {key: "Loop", value: "LOOP"},
    {key: "Lower", value: "LR"},
    {key: "Little", value: "LT"},
    {key: "Lynne", value: ""},
    {key: "Mall", value: "MALL"},
    {key: "Manor", value: ""},
    {key: "Mart", value: ""},
    {key: "Mead", value: ""},
    {key: "Mew", value: "MEW"},
    {key: "Mews", value: "MEWS"},
    {key: "Meander", value: "MNDR"},
    {key: "Mount", value: "MT"},
    {key: "Motorway", value: "MWY"},
    {key: "North", value: "N"},
    {key: "North East", value: "NE"},
    {key: "North West", value: "NW"},
    {key: "Outlook", value: "OTLK"},
    {key: "Outlet", value: ""},
    {key: "Park", value: "PARK"},
    {key: "Part", value: "PART"},
    {key: "Pass", value: "PASS"},
    {key: "Path", value: "PATH"},
    {key: "Parade", value: "PDE"},
    {key: "Pathway", value: "PHWY"},
    {key: "Piazza", value: "PIAZ"},
    {key: "Parklands", value: "PKLD"},
    {key: "Pocket", value: "PKT"},
    {key: "Parkway", value: "PKWY"},
    {key: "Place", value: "PL"},
    {key: "Plateau", value: "PLAT"},
    {key: "Plaza", value: "PLZA"},
    {key: "Point", value: "PNT"},
    {key: "Port", value: "PORT"},
    {key: "Precinct", value: ""},
    {key: "Promenade", value: "PROM"},
    {key: "Pursuit", value: "PRST"},
    {key: "Passage", value: "PSGE"},
    {key: "Quadrangle", value: "QDGL"},
    {key: "Quadrant", value: "QDRT"},
    {key: "Quad", value: "QUAD"},
    {key: "Quay", value: "QY"},
    {key: "Quays", value: "QYS"},
    {key: "Ramp", value: "RAMP"},
    {key: "Reach", value: "RCH"},
    {key: "Road", value: "RD"},
    {key: "Ridge", value: "RDGE"},
    {key: "Roads", value: "RDS"},
    {key: "Roadside", value: "RDSD"},
    {key: "Roadway", value: "RDWY"},
    {key: "Reef", value: ""},
    {key: "Reserve", value: "RES"},
    {key: "Rest", value: "REST"},
    {key: "Ridgeway", value: "RGWY"},
    {key: "Ride", value: "RIDE"},
    {key: "Ring", value: "RING"},
    {key: "Rise", value: "RISE"},
    {key: "Ramble", value: "RMBL"},
    {key: "Round", value: "RND"},
    {key: "Ronde", value: "RNDE"},
    {key: "Range", value: "RNGE"},
    {key: "Right Of Way", value: "ROFW"},
    {key: "Row", value: "ROW"},
    {key: "Rosebowl", value: "RSBL"},
    {key: "Rising", value: ""},
    {key: "Route", value: "RTE"},
    {key: "Return", value: ""},
    {key: "Retreat", value: "RTT"},
    {key: "Rotary", value: "RTY"},
    {key: "Rue", value: "RUE"},
    {key: "Run", value: "RUN"},
    {key: "River", value: "RVR"},
    {key: "Riviera", value: "RVRA"},
    {key: "Riverway", value: "RVWY"},
    {key: "South", value: "S"},
    {key: "Subway", value: "SBWY"},
    {key: "Siding", value: "SDNG"},
    {key: "South East", value: "SE"},
    {key: "State Highway", value: "SHWY"},
    {key: "Slope", value: "SLPE"},
    {key: "Sound", value: "SND"},
    {key: "Spur", value: "SPUR"},
    {key: "Square", value: "SQ"},
    {key: "Street", value: "ST"},
    {key: "Strait", value: ""},
    {key: "Steps", value: "STPS"},
    {key: "Strand", value: "STRA"},
    {key: "Strip", value: "STRP"},
    {key: "Stairs", value: "STRS"},
    {key: "Straight", value: "STR"},
    {key: "Serviceway", value: "SWY"},
    {key: "South West", value: "SW"},
    {key: "Service Way", value: "SWY"},
    {key: "Tarn", value: "TARN"},
    {key: "Terrace", value: "TCE"},
    {key: "Thoroughfare", value: "THOR"},
    {key: "Throughway", value: "TKWY"},
    {key: "Trunkway", value: "TKWY"},
    {key: "Tollway", value: "TLWY"},
    {key: "Tramway", value: ""},
    {key: "Top", value: "TOP"},
    {key: "Tor", value: "TOR"},
    {key: "Triangle", value: "TRI"},
    {key: "Track", value: "TRK"},
    {key: "Trail", value: "TRL"},
    {key: "Trailer", value: "TRLR"},
    {key: "Turn", value: "TURN"},
    {key: "Twist", value: ""},
    {key: "Towers", value: "TWRS"},
    {key: "Vale", value: "VALE"},
    {key: "Viaduct", value: "VDCT"},
    {key: "Verge", value: ""},
    {key: "View", value: "VIEW"},
    {key: "Village", value: ""},
    {key: "Villa", value: ""},
    {key: "Villas", value: "VLLS"},
    {key: "Valley", value: ""},
    {key: "Vista", value: "VSTA"},
    {key: "Views", value: ""},
    {key: "West", value: "W"},
    {key: "Wade", value: "WADE"},
    {key: "Walk", value: "WALK"},
    {key: "Way", value: "WAY"},
    {key: "Woods", value: "WDS"},
    {key: "Wharf", value: "WHRF"},
    {key: "Walkway", value: "WKWY"},
    {key: "Waters", value: ""},
    {key: "Waterway", value: ""},
    {key: "Wynd", value: "WYND"},
    {key: "Yard", value: "YARD"}
]


// Contains a list of properties with their selector, error messages, validation rules or custom validation overrides.
const addressFormConfig = {
    addressBuildingName: {
        selector: $('#documentAddressBuildingPropertyName'),
        validator: validateBuildingName
    },
    addressFlatUnitNumber: {
        selector: $('#documentAddressUnitNumber'),
        validator: validateFlat

    },
    addressStreetNumber: {
        selector: $('#documentAddressStreetNumber'),
        validator: validateStreetNumber

    },
    addressStreetName: {
        selector: $('#documentAddressStreetName'),
        validator: validateStreetName


    },
    addressStreetType: {
        selector: $('#documentAddressStreetType'),
        emptyText: 'Please select your street type'
    },
    addressPostcodeZip: {
        selector: $('#documentAddressPostalCode'),
        validator: validatePostcode

    },
    addressCityTown: {
        selector: $('#documentAddressSuburb'),
        validator: validateCity
    }
    ,
    addressState: {
        selector: $('#documentAddressState'),
        emptyText: 'Please select your state',
    },
    addressFloorNumber: {
        selector: $('#documentAddressLevelNumber')
    }
};

const poBoxTypes = [
    "PO BOX",
    "P.O. BOX",
    "PO. BOX",
    "P.O BOX",
    "POST OFFICE BOX"
]

function validateBuildingName(element) {
    const targetId = element[0].id;
    const rawValue = element[0].value ?? '';
    const targetValue = typeof rawValue === 'string' ? rawValue.trim() : rawValue;

    if (targetValue.length > 50) {
        setError(element, ERROR_QAS_BUILDING_NAME);
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    if (targetValue !== '' && !targetValue.match(/^[a-z0-9 \/-]+$/i)) {
        setError(element, ERROR_QAS_BUILDING_NAME);
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    if (poBoxTypes.some(m => targetValue.toUpperCase().includes(m))) {
        setError(element, ERROR_QAS_PO_BOX);
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    removeError(element);
    currentlyValidatedMatrix.add(targetId);
}

function validateFlat(element) {
    const targetId = element[0].id;
    const rawValue = element[0].value ?? '';
    const targetValue = typeof rawValue === 'string' ? rawValue.trim() : rawValue;

    if (targetValue.length > 7) {
        setError(element, ERROR_QAS_FLAT_UNIT_NUMBER);
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    if (targetValue !== '' && !targetValue.match(/^[a-z0-9 \/-]+$/i)) {
        setError(element, ERROR_QAS_FLAT_UNIT_NUMBER);
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    if (poBoxTypes.some(m => targetValue.toUpperCase().includes(m))) {
        setError(element, ERROR_QAS_PO_BOX);
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    removeError(element);
    currentlyValidatedMatrix.add(targetId);
}

function validateCity(element) {
    const targetId = element[0].id;
    const rawValue = element[0].value ?? '';
    const targetValue = typeof rawValue === 'string' ? rawValue.trim() : rawValue;

    if (targetValue === undefined || targetValue === '') {
        setError(element, 'Please enter your city/town');
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    if (targetValue.length > 50 || !targetValue.match(/^[a-z0-9'& \/-]+$/i)) {
        setError(element, ERROR_QAS_CITY)
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    if (poBoxTypes.some(m => targetValue.toUpperCase().includes(m))) {
        setError(element, ERROR_QAS_PO_BOX);
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    removeError(element);
    currentlyValidatedMatrix.add(targetId);
}

function validateStreetNumber(element) {
    const targetId = element[0].id;
    const rawValue = element[0].value ?? '';
    const targetValue = typeof rawValue === 'string' ? rawValue.trim() : rawValue;

    if (targetValue === undefined || targetValue === '') {
        setError(element, ERROR_QAS_STREET_NUMBER_ALPHABETIC);
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    if (poBoxTypes.some(m => targetValue.toUpperCase().includes(m))) {
        setError(element, ERROR_QAS_PO_BOX);
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    if (targetValue.length > 10) {
        setError(element, ERROR_QAS_STREET_NUMBER_LENGTH)
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    if (!targetValue.match(/^[a-z0-9 \/-]+$/i)) {
        setError(element, ERROR_QAS_STREET_NUMBER_INVALID_CHARACTERS)
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    if (!targetValue.match(/[0-9]/)) {
        setError(element, ERROR_QAS_STREET_NUMBER_ALPHABETIC)
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    removeError(element);
    currentlyValidatedMatrix.add(targetId);
}

function validateStreetName(element) {
    const targetId = element[0].id;
    const rawValue = element[0].value ?? '';
    const targetValue = typeof rawValue === 'string' ? rawValue.trim() : rawValue;

    if (targetValue === undefined || targetValue === '') {
        setError(element, ERROR_QAS_STREET_NAME_INVALID);
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    if (poBoxTypes.some(m => targetValue.toUpperCase().includes(m))) {
        setError(element, ERROR_QAS_PO_BOX);
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    if (targetValue.length > 40) {
        setError(element, ERROR_QAS_STREET_NAME_LENGTH)
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    if (!targetValue.match(/^[a-z0-9'& \/-]+$/i)) {
        setError(element, ERROR_QAS_STREET_NAME_INVALID_CHARACTERS)
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    if (!targetValue.match(/[a-z]/i)) {
        setError(element, ERROR_QAS_STREET_NAME_INVALID)
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    removeError(element);
    currentlyValidatedMatrix.add(targetId);
}

function validatePostcode(element) {
    const targetId = element[0].id;
    const rawValue = element[0].value ?? '';
    const targetValue = typeof rawValue === 'string' ? rawValue.trim() : rawValue;

    if (targetValue === undefined || targetValue === '') {
        setError(element, ERROR_QAS_POSTCODE_INVALID);
        document.getElementById('postcodeError').style.display = 'none'
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    if (targetValue.length != 4) {
        setError(element, ERROR_QAS_POSTCODE_INVALID)
        document.getElementById('postcodeError').style.display = 'none'
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    if (!targetValue.match(/^[0-9]+$/i)) {
        setError(element, ERROR_QAS_POSTCODE_INVALID)
        document.getElementById('postcodeError').style.display = 'none'
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    const state = document.getElementById("documentAddressState").value;
    const city = document.getElementById("documentAddressSuburb").value.toUpperCase();

    const numericPostcode = Number(targetValue);

    if (state == 'NSW' && (numericPostcode < 1000 || (numericPostcode > 2599 && numericPostcode < 2619) || (numericPostcode > 2899 && numericPostcode < 2921) || numericPostcode > 2999)) {
        // invalid postcode for NSW

        let invalid = true;
        //... except
        if (numericPostcode == 2611 && (city == 'BRINDABELLA' || city == 'URIARRA' || city == 'COOLEMAN' || city == 'BIMBERI'))
            invalid = false;

        if (numericPostcode == 3500 && city == 'PARINGI')
            invalid = false;

        if (numericPostcode == 3585 && city == 'MURRAY DOWNS')
            invalid = false;

        if (numericPostcode == 3586 && city == 'MALLAN')
            invalid = false;

        if (numericPostcode == 3644 && (city == 'BAROOGA' || city == 'LALALTY'))
            invalid = false;

        if (numericPostcode == 3691 && city == 'LAKE HUME VILLAGE')
            invalid = false;

        if (numericPostcode == 3707 && city == 'BRINGENBRONG')
            invalid = false;

        if (numericPostcode == 4380 && city == 'MINGOOLA')
            invalid = false;

        if (numericPostcode == 4377 && city == 'MARYLAND')
            invalid = false;

        if (numericPostcode == 4383 && city == 'JENNINGS')
            invalid = false;

        if (numericPostcode == 4385 && city == 'TEXAS')
            invalid = false;

        if (invalid) {
            document.getElementById('postcodeError').style.display = 'block'
            removeError(element);
            removeIdFromValidatedMatrix(targetId);
            return;
        }
    }

    if (state == 'ACT' && (numericPostcode < 200 || (numericPostcode > 299 && numericPostcode < 2600) || (numericPostcode > 2618 && numericPostcode < 2900) || numericPostcode > 2920)) {
        // invalid postcode for ACT

        let invalid = true;
        //... except
        if (numericPostcode == 2620 && (city == 'HUME' || city == 'KOWEN' || city == 'KOWEN FOREST' || city == 'OAKS ESTATE' || city == 'THARWA' || city == 'TOP NAAS'))
            invalid = false;

        if (invalid) {
            document.getElementById('postcodeError').style.display = 'block'
            removeError(element);
            removeIdFromValidatedMatrix(targetId);
            return;
        }
    }

    if (state == 'VIC' && (numericPostcode < 3000 || (numericPostcode > 3996 && numericPostcode < 8000) || numericPostcode > 8999)) {
        // invalid postcode for VIC
        document.getElementById('postcodeError').style.display = 'block'
        removeError(element);
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    if (state == 'QLD' && (numericPostcode < 4000 || (numericPostcode > 4999 && numericPostcode < 9000) || numericPostcode > 9999)) {
        // invalid postcode for QLD

        let invalid = true;
        //... except
        if (numericPostcode == 2406 && (city == 'MUNGINDI'))
            invalid = false;

        if (invalid) {
            document.getElementById('postcodeError').style.display = 'block'
            removeError(element);
            removeIdFromValidatedMatrix(targetId);
            return;
        }
    }

    if (state == 'SA' && (numericPostcode < 5000 || (numericPostcode > 5799 && numericPostcode < 5800) || numericPostcode > 5999)) {
        // invalid postcode for SA

        let invalid = true;
        //... except
        if (numericPostcode == 872 && (city == 'ERNABELLA' || city == 'FREGON' || city == 'INDULKANA' || city == 'MIMILI'))
            invalid = false;

        if (invalid) {
            document.getElementById('postcodeError').style.display = 'block'
            removeError(element);
            removeIdFromValidatedMatrix(targetId);
            return;
        }
    }

    if (state == 'WA' && (numericPostcode < 6000 || (numericPostcode > 6797 && numericPostcode < 6800) || numericPostcode > 6999)) {
        // invalid postcode for WA

        let invalid = true;
        //... except
        if (numericPostcode == 872 && (city == 'NGAANYATJARRA-GILES' || city == 'GIBSON DESERT NORTH' || city == 'GIBSON DESERT SOUTH'))
            invalid = false;

        if (invalid) {
            document.getElementById('postcodeError').style.display = 'block'
            removeError(element);
            removeIdFromValidatedMatrix(targetId);
            return;
        }
    }

    if (state == 'TAS' && (numericPostcode < 7000 || (numericPostcode > 7799 && numericPostcode < 7800) || numericPostcode > 7999)) {
        // invalid postcode for TAS
        document.getElementById('postcodeError').style.display = 'block'
        removeError(element);
        removeIdFromValidatedMatrix(targetId);
        return;
    }

    if (state == 'NT' && (numericPostcode < 800 || numericPostcode > 999)) {
        // invalid postcode for NT

        let invalid = true;
        //... except
        if (numericPostcode == 4825 && (city == 'ALPURRURULAM'))
            invalid = false;

        if (invalid) {
            document.getElementById('postcodeError').style.display = 'block'
            removeError(element);
            removeIdFromValidatedMatrix(targetId);
            return;
        }
    }

    removeError(element);
    document.getElementById('postcodeError').style.display = 'none'
    currentlyValidatedMatrix.add(targetId);
}

// If we are manually populating the address fields, this will be true.
let manualAddressEntry = false;

// This is the address that is returned from NAB api either from the OCR lookup or the autocomplete search.
/** @type {NabAddress} */
let nabAddress = undefined;


function validateAddressFields() {

    /* If we have a NAB sourced address we automatically validate all the address fields */
    if (nabAddress != null) {

        Object.values(addressFormConfig).forEach(propertyConfig => {
            const targetId = propertyConfig.selector[0].id;
            removeError(propertyConfig.selector);
            currentlyValidatedMatrix.add(targetId);
        });

    } else {

        Object.values(addressFormConfig).forEach(propertyConfig => {
            validateInput(propertyConfig);
        });
    }

}



const toggleAddressSearch = () => {
    const addressForm = document.querySelector('#addressForm');
    if (addressForm.style.display === 'none') {
        showManualEntryAddressForm();
    } else {
        showAutocompleteAddressForm();
    }
}

const getAddressElements = () => {
    const addressForm = document.querySelector('#addressForm');
    const addressAutocomplete = document.querySelector('#addressAutocomplete');
    const addressManualLink = document.querySelector('#addressManualLink');
    return {addressForm, addressAutocomplete, addressManualLink};
}


const showManualEntryAddressForm = () =>  {

    const { addressForm, addressAutocomplete, addressManualLink} = getAddressElements();

    addressForm.style.display = 'block';
    addressAutocomplete.style.display = 'none';
    addressManualLink.style.display = 'none';
    manualAddressEntry = true;

    try {
        //This is when need to validate matrix has to get rid
        //of 'addressSearchInput' as control flow to this block means its gonna be manual address
        const newNeedToValidateMatrix = new Set(needToValidateMatrix)
        newNeedToValidateMatrix.delete('addressSearchInput')
        needToValidateMatrix = newNeedToValidateMatrix;

    } catch (error) {
        console.log('Error during delete addressSearchInput from needtovalidatematrix' + e)
    }
}


const showAutocompleteAddressForm = () => {

    const { addressForm, addressAutocomplete, addressManualLink} = getAddressElements();

    addressForm.style.display = 'none';
    addressAutocomplete.style.display = 'block';
    addressManualLink.style.display = 'inline-flex';
    manualAddressEntry = false;

    try {
        //This is when need to validate matrix has to get rid
        //of 'addressSearchInput' as control flow to this block means its gonna be manual address
        const newNeedToValidateMatrix = new Set(needToValidateMatrix)
        newNeedToValidateMatrix.add('addressSearchInput')
        needToValidateMatrix = newNeedToValidateMatrix;

    } catch(error) {
        console.log('Error during adding addressSearchInput back to needtovalidatematrix' + e)
    }
}


/* This is a generic validation for address properties it contains
 length, regex and empty text validation.
 If the property has very custom validation rules this will be overridden. */
const validateInput = (propertyConfig) => {

    const element = propertyConfig.selector[0];

    if (!element) return;

    const targetId = element.id;
    const rawValue = element.value ?? '';
    const targetValue = typeof rawValue === 'string' ? rawValue.trim() : rawValue;

    if (!needToValidateMatrix.has(targetId)) {
        return;
    }

    // For running custom validation
    if (propertyConfig.validator) {
        return propertyConfig.validator(propertyConfig.selector);
    }

    let isValid = true;

    if (targetValue !== '') {
        if (propertyConfig.regex && typeof targetValue === 'string') {
            isValid = propertyConfig.regex.test(targetValue);
        }

        if (propertyConfig.maxLength && typeof targetValue === 'string') {
            isValid = isValid && targetValue.length <= propertyConfig.maxLength;
        }

        if (isValid) {

            removeError(propertyConfig.selector);
            currentlyValidatedMatrix.add(targetId);
        } else {
            setError(propertyConfig.selector, propertyConfig.errorText || 'Invalid input');
            removeIdFromValidatedMatrix(targetId);
        }

    } else if (propertyConfig.emptyText !== undefined && propertyConfig.emptyText !== '') {
        setError(propertyConfig.selector, propertyConfig.emptyText);
        removeIdFromValidatedMatrix(targetId);
    } else {
        removeError(propertyConfig.selector);
        currentlyValidatedMatrix.add(targetId);
    }
};

/*
Initialises the address form with the necessary event listeners and validation.
 */
function initAddressForm() {
    initStreetTypes();
    addFieldListenersToClearNabAddress()
}

function addFieldListenersToClearNabAddress() {

    Object.values(addressFormConfig).forEach(propertyConfig => {
        if (propertyConfig.selector) {
            propertyConfig.selector[0].addEventListener('change', clearNabAddress)
        }
    });
}


function clearNabAddress() {

    const addressClearButton = document.querySelector('#addressClearButton');

    if (!addressClearButton) {
        console.warn('Address clear button not found');
        return;
    }

    document.querySelector('#addressSearchInput').value = '';

    clearSuggestions();

    addressClearButton.style.display = 'none';

    nabAddress = undefined;

}

function clearSuggestions() {
    const addressSuggestions = document.querySelector('#addressSuggestions');
    if (addressSuggestions) {
        addressSuggestions.innerHTML = '';
        addressSuggestions.close();
    }
}

/**
 *
 * @param address {NabAddress}
 */
function setNabAddress(address) {
    nabAddress = address;
    populateAddressFields(nabAddress);

    removeError($('#addressSearchInput'));
    currentlyValidatedMatrix.add('addressSearchInput');
}

/**
 * Populates the address fields with the provided address object.
 * @param {NabAddress} address - The address object to populate the fields with.
 */
function populateAddressFields(address) {

    if (!address) {
        console.warn('No address provided to populate fields');
        return;
    }

    document.querySelector('#documentAddressCountry').value = address.country || 'Australia';
    document.querySelector('#documentAddressBuildingPropertyName').value = address.buildingPropertyName || '';
    document.querySelector('#documentAddressUnitNumber').value = address.unitNumber || '';
    document.querySelector('#documentAddressStreetNumber').value = address.streetNumber || '';
    document.querySelector('#documentAddressStreetName').value = address.streetName || '';

    // Might need to use the SUFFIXES array to map this correctly
    if(address.streetType) {
        document.querySelector('#documentAddressStreetType').value = address.streetType.toUpperCase();
    } else {
        document.querySelector('#documentAddressStreetType').reset(); //Doing this as Setting '' to value is not resetting the md select that doesnt have an option with default ''
    }

    document.querySelector('#documentAddressPostalCode').value = address.postCode || '';
    document.querySelector('#documentAddressLevelNumber').value = address.floorLevel || '';
    document.querySelector('#documentAddressSuburb').value = address.suburbPlaceLocality || '';

    if(address.stateTerritory) {
        document.querySelector('#documentAddressState').value = address.stateTerritory;
    } else {
        document.querySelector('#documentAddressState').reset(); //Doing this as Setting '' to value is not resetting the md select that doesnt have an option with default ''
    }

    // NB-763
    const docHeaderEl = document.querySelector('#documentAddressHeader');
    const dpIdElement = document.createElement('md-outlined-text-field');
    dpIdElement.className = 'input-text';
    dpIdElement.id = 'dpId';
    dpIdElement.style.display = 'none';
    dpIdElement.value = address.dpId;
    docHeaderEl.appendChild(dpIdElement);
}

/* Initialises the street types dropdown with the predefined list of street suffixes. These are from the existing list.
   It skips every second item as it is the abbreviation for the street type.
 */
function initStreetTypes() {
    const streetTypeSelect = document.querySelector('#documentAddressStreetType');

    if (!streetTypeSelect) {
        console.warn('Street type select element not found');
        return;
    }

    const optionsHtml = streetTypes
        .filter((_, i) => i % 2 === 0)
        .map((name, i) => {
            return `
                          <md-select-option value="${name.value || name.key}">
                            <div slot="headline">${name.key}</div>
                          </md-select-option>
                        `;
        })
        .join('');

    streetTypeSelect.innerHTML = optionsHtml;
}


let autoCompleteMenuFullyOpen = false;
let autoCompleteMenuTransitioning = false;

let debounceTimeout = undefined;

function checkClearButton(input) {
    const query = input.value.trim();

    const clearButton = document.getElementById('addressClearButton');
    if (query.length > 0) {
        clearButton.style.display = 'inline-flex';
    } else {
        clearButton.style.display = 'none';
    }
}

/* Bind the autocomplete and sets up the suggestions list. Click handlers etc. */
function bindAddressSearchInput() {
    const input = document.querySelector('#addressSearchInput');
    const suggestionMenu = document.getElementById('addressSuggestions');

    if (!input || !suggestionMenu) {
        console.warn('Autocomplete input or suggestions list not found');
        return;
    }

    input.addEventListener('input', () => {
        checkClearButton(input);
        const query = input.value.trim();

        removeError($('#addressSearchInput'));
        currentlyValidatedMatrix.add('addressSearchInput');

        if (query.length >= 4) {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                searchAddress(sessionData, query, 'AU', (addresses) => {
                    showSuggestions(addresses, query);
                }, (error) => {
                    console.error('Address search error:', error);
                    handleQasError(error);
                });
            }, 500)

        } else {
            suggestionMenu.close();
        }
    });

    suggestionMenu.addEventListener('opened', () => {
        input.focus();
        autoCompleteMenuFullyOpen = true;
        autoCompleteMenuTransitioning = false;
    });

    suggestionMenu.addEventListener('opening', () => {
        autoCompleteMenuTransitioning = true;
    })

    suggestionMenu.addEventListener('closing', () => {
        autoCompleteMenuFullyOpen = false;
        autoCompleteMenuTransitioning = true;
    })

    suggestionMenu.anchorElement = input
    suggestionMenu.noVerticalFlip = true;
    suggestionMenu.noHorizontalFlip = true;
    suggestionMenu.skipRestoreFocus = true;
    suggestionMenu.stayOpenOnFocusout = true;
    suggestionMenu.stayOpenOnOutsideClick = true;
    suggestionMenu.focusState = 'none'


    /**
     *
     * @param addresses {SearchResult}
     * @param query
     */
    function showSuggestions(addresses, query) {
        const addressSuggestions = document.getElementById('addressSuggestions');
        const input = document.getElementById('addressSearchInput');

        addressSuggestions.innerHTML = '';


        if (!addresses || addresses.addresses.length === 0) {
            const menuItem = document.createElement('md-select-option');
            menuItem.setAttribute('type', 'option');

            const headline = document.createElement('div');
            headline.setAttribute('slot', 'headline');
            headline.innerHTML = 'No addresses found.';

            menuItem.appendChild(headline);

            addressSuggestions.appendChild(menuItem);

            addressSuggestions.show();

            return;
        }

        const queryRegex = new RegExp(`(${query})`, 'ig');

        addresses.addresses.forEach((item, index) => {

            const fullAddress = item.fullAddress;
            const highlighted = fullAddress.replaceAll(queryRegex, '<strong>$1</strong>');

            const menuItem = document.createElement('md-select-option');
            menuItem.setAttribute('type', 'option');
            menuItem.setAttribute('id', `address-option-${index}`);
            menuItem.dataset.key = item.addressId;

            const headline = document.createElement('div');
            headline.setAttribute('slot', 'headline');
            headline.innerHTML = highlighted;

            menuItem.appendChild(headline);

            menuItem.addEventListener('click', selectAddress);
            menuItem.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectAddress();
                }
            });

            function selectAddress() {
                input.value = fullAddress;
                addressSuggestions.open = false;

                getAddress(sessionData, item.addressId, (response) => {
                    setNabAddress(response);
                }, (error) => {
                    console.error('Error fetching address from autocomplete:', error);
                    handleQasError(error);
                });
            }

            addressSuggestions.appendChild(menuItem);
        });

        addressSuggestions.show();
    }

    input.addEventListener('focus', showSuggestionsIfAny);

    input.addEventListener('click', showSuggestionsIfAny);

    input.addEventListener('blur', () => {
        if (autoCompleteMenuFullyOpen && !autoCompleteMenuTransitioning)
            suggestionMenu.close()
    });


    function showSuggestionsIfAny() {
        if (suggestionMenu.children.length > 0) {
            suggestionMenu.show();
        }
    }
}

function handleQasError(error) {
    tryAgainStatusCodes = [400, 429]; // Bad Request, Too Many Requests/Firewall allow manual search
    manualEntryRequiredStatusCodes = [401 , 403, 404, 500, 503, 504]; // Unauthorized, Forbidden, Not Found, Internal Server Error, Service Unavailable, Gateway Timeout

    if(tryAgainStatusCodes.includes(error)) {
        setError($('#addressSearchInput'), 'Something went wrong, please try searching for your address again.')
    }

    if(manualEntryRequiredStatusCodes.includes(error)){
        //Do we need to inform the user here that search cannot be used?
        showManualEntryAddressForm();
    }

    removeIdFromValidatedMatrix('addressSearchInput');
}

function getDataZooAddress() {
    let dataZooFormat = sessionData.idv.config.dataZooAddressFormat
    if (!dataZooFormat) {
        // NB-781
       dataZooFormat = '{documentAddressLevelNumber} {documentAddressBuildingPropertyName} {documentAddressUnitNumber} {documentAddressStreetNumber} {documentAddressStreetName} {documentAddressStreetType}'
    }

    let dataZooOutput = dataZooFormat;
    dataZooOutput = dataZooOutput.replace("{documentAddressCountry}", document.getElementById("documentAddressCountry")?.value ?? "");
    dataZooOutput = dataZooOutput.replace("{documentAddressBuildingPropertyName}", document.getElementById("documentAddressBuildingPropertyName")?.value ?? "");
    dataZooOutput = dataZooOutput.replace("{documentAddressUnitNumber}", document.getElementById("documentAddressUnitNumber")?.value ?? "");
    dataZooOutput = dataZooOutput.replace("{documentAddressStreetNumber}", document.getElementById("documentAddressStreetNumber")?.value ?? "");
    dataZooOutput = dataZooOutput.replace("{documentAddressStreetName}", document.getElementById("documentAddressStreetName")?.value ?? "");
    dataZooOutput = dataZooOutput.replace("{documentAddressStreetType}", document.getElementById("documentAddressStreetType")?.value ?? "");
    dataZooOutput = dataZooOutput.replace("{documentAddressPostalCode}", document.getElementById("documentAddressPostalCode")?.value ?? "");
    dataZooOutput = dataZooOutput.replace("{documentAddressLevelNumber}", document.getElementById("documentAddressLevelNumber")?.value ?? "");
    dataZooOutput = dataZooOutput.replace("{documentAddressSuburb}", document.getElementById("documentAddressSuburb")?.value ?? "");
    dataZooOutput = dataZooOutput.replace("{documentAddressState}", document.getElementById("documentAddressState")?.value ?? "");

    // Trim any multiple spaces
    return dataZooOutput.trim().replaceAll(/\s+/g, " ");
}

function attemptOcrAddressFind() {

    if (
        sessionData &&
        sessionData.idv &&
        sessionData.idv.doc &&
        sessionData.idv.doc.documentAddressStreetAddress
    ) {
        validateAddress(sessionData, sessionData.idv.doc.documentAddressStreetAddress, (response) => {
            if (response && response.address) {

                setNabAddress(response.address);
                const input = document.getElementById('addressSearchInput');
                input.value = response.address.fullAddress
                checkClearButton(input)

            } else {
                // no match, so require user to enter an address manually
                populateAddressFields({}) //Setting this to empty object to remove manual address details when a valid address is not found
            }
        }, (error) => {
            console.error('Error validating address:', error);
            handleQasError(error);
        });
    }
}

// On document load, validate OCRed data
window.addEventListener('load', () => {
    bindAddressSearchInput();
    initAddressForm();
})

Object.values(addressFormConfig).forEach(propertyConfig => {
    propertyConfig.selector.on('change input', () => validateInput(propertyConfig));
});
