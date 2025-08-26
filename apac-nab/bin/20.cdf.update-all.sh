#!/bin/bash

# function definition
update1() {
  local FILE_NAME=$1
  local CDF_NAME=$2
  local DESCRIPTION="$3"
  ../bin.cdf/10.cdf.prepare2.sh ${FILE_NAME} ${CDF_NAME}
  ../bin.cdf/20.cdf.read-latest-md52.sh ${CDF_NAME}
  ../bin.cdf/30.cdf.update-trustx.sh  ${CDF_NAME} "${DESCRIPTION}"
}

# change dir
CURRENT_DIR=`pwd`
cd `dirname $0`

# actual scripting
echo "== Custom Forms =="
#update1 SergeiProgress.json  SergeiProgress "Sergei Progress CDF"

update1 DLDataConfirmationForm.json DLDataConfirmationForm "DL Confirmation Form"
update1 DummyConsentPicture.json DummyConsentPicture "NAB Dummy Privacy Notice and Consent"
update1 DummyEmailOnly.json DummyEmailOnly "NAB Dummy Email Form"
update1 DummyExistingCustomer.json DummyExistingCustomer ""
update1 DummyOTP.json DummyOTP "Dummy OTP for NAB"
update1 DummyPassword.json DummyPassword ""
update1 DummyPin.json DummyPin "NAB Dummy PIN"
update1 GenericReviewForm.json GenericReviewForm ""
update1 InvalidDocumentForm.json InvalidDocumentForm "Dummy Invalid Document Type"
update1 NABPreferredName.json NABPreferredName ""
update1 PassportDataConfirmationForm.json PassportDataConfirmationForm "Passport Confirmation Form"
update1 PhoneNumberForm.json PhoneNumberForm ""
update1 ProcessingForm.json ProcessingForm ""
update1 ProcessingForm1.json ProcessingForm1 "Form indicating that data processing is taking place"
update1 ProcessingForm2.json ProcessingForm2 "Form indicating that data processing is taking place"
update1 ProcessingForm3.json ProcessingForm3 ""



# TODO - add more CDF here

# return to the initial directory
cd ${CURRENT_DIR}
