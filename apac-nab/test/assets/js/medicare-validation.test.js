

const positiveCases = [
    '2494420039',
    '4335523479',
    '3487208759',
    '3395653579',
    '6192566239',
    '5245614835',
    '2083935267',
    '2415453061',
    '4003045804',
    '2373765704',
    '6069132761',
    '2017226486',
    '2049141652',
    '6734902160'
    ]

const negativeCases = [
    '1234567890',
    '0987654321',
    '1212121212'
    ]

//TODO Currently validation.js is not unit testable and many lines are not wrapped in a method,
//Hence medicareCheckSum method cant be imorted and tested here, so for timebeing the implmentation is copied over for test purposes
// Another option would be to move medicare related validations in a js file of its own and improt them in PageMedicare.
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

describe.each(positiveCases) ('\nWith Medicare Number as %d', (medicareNumber) => {
    test('Checking Positive Case ', ()=> {
        let resp = medicareCheckSum(medicareNumber)
        expect(resp).toBeTruthy()
    });
});

describe.each(negativeCases) ('\nWith Medicare Number as %d', (medicareNumber) => {
    test('Checking Negative Case ', ()=> {
        let resp = medicareCheckSum(medicareNumber)
        expect(resp).toBeFalsy()
    });
});