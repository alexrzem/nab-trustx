#!/bin/bash

# function definition
update1() {
  local FILE_NAME=$1
  local CP_NAME=$2
  local DESCRIPTION="$3"
  ../bin.cp/10.cp.prepare-zip3.sh ${FILE_NAME} ${CP_NAME}
  ../bin.cp/20.cp.read-latest-md5.sh ${CP_NAME}
  ../bin.cp/30.cp.update-trustx2.sh ${CP_NAME} "${DESCRIPTION}"
}

# change dir
CURRENT_DIR=`pwd`
cd `dirname $0`


echo "== Custom Pages =="

update1 PageCompleteRegistration.html PageCompleteRegistration "PageCompleteRegistration"
# Registration
update1 PagePreferredName.html PagePreferredName "Capture preferred name screen"
update1 PageFullLegalName.html PageFullLegalName "Capture full legal name screen"
update1 PageMiddleName.html PageMiddleName "Capture full legal middle name screen"
update1 PageMobile.html PageMobile "Capture mobile screen"
update1 PageOtp.html PageOtp "Capture otp screen"
update1 PageEmail.html PageEmail "Capture email screen"
update1 PageConsents.html PageConsents "Consolidated consent screen"
update1 PagePasswordStub.html PagePasswordStub "Stub password screen"
update1 PageBirthday.html PageBirthday "Birthday form"

# Document 
update1 PageDocumentSelection.html PageDocumentSelection "Select document screen"
update1 PagePassport.html PagePassport "Confirm details passport screen"
update1 PagePassportQas.html PagePassportQas "Confirm details passport screen (QAS)"
update1 PagePassportForeign.html PagePassportForeign "Confirm details foreign passport screen"
update1 PagePassportForeignQas.html PagePassportForeignQas "Confirm details foreign passport screen (QAS)"
update1 PageDriversLicence.html PageDriversLicence "Confirm details DL screen"
update1 PageDriversLicenceQas.html PageDriversLicenceQas "Confirm details DL screen (QAS)"
update1 PageBirthCertificate.html PageBirthCertificate "Birth cert form"
update1 PageBirthCertificateQas.html PageBirthCertificateQas "Birth cert form (QAS)"
update1 PageMedicare.html PageMedicare "Medicare form"
update1 PageMedicareQas.html PageMedicareQas "Medicare form (QAS)"
update1 PageChangeOfNameCertificate.html PageChangeOfNameCertificate "Change of name form"
update1 PageMarriageCertificate.html PageMarriageCertificate "Marriage cert form"
update1 PageGenericForm.html PageGenericForm "Generic form"
update1 PageAdditionalDocument.html PageAdditionalDocument "Additional doc page"
update1 PageUnableToIdentifyDocument.html PageUnableToIdentifyDocument "Unable to detect doc page"


# Others
update1 PageNewCustomer.html PageNewCustomer "New customer onboarding"
update1 PageSelfieInstruction.html PageSelfieInstruction "Selfie instruction"
update1 PageVerifyInPerson.html PageVerifyInPerson "Verify in person"
update1 PageProcessingPreparing.html PageProcessingPreparing "Processing - preparing"
update1 PageProcessingCheckingData.html PageProcessingCheckingData "Processing - checking data"
update1 PageProcessingTakingLonger.html PageProcessingTakingLonger "Processing - taking longer"
update1 PageProcessingTakingLonger.html PageProcessingTakingLonger2 "Processing - taking longer"
update1 PageProcessingDeterminingIdv.html PageProcessingDeterminingIdv "Processing - determining IDV result"
update1 PageProcessingDeterminingIdv.html PageProcessingDeterminingIdv2 "Processing - determining IDV result"
update1 PageProcessingOtpProcessing.html PageProcessingOtpProcessing "Processing - OTP Processing"
update1 PageProcessingOtpSending.html PageProcessingOtpSending "Processing - OTP Sending"
# update1 PageProcessing.html PageProcessing "Processing page"
update1 PageDocFrontInstruction.html PageDocFrontInstruction "Doc Front Instruction"
update1 PageDocBackInstruction.html PageDocBackInstruction "Doc Back Instruction"
update1 PagePOC.html PagePOC "POC page for adobe analytics and fpjs"
update1 PageResumeSplash.html PageResumeSplash "Splash screen to determine platform from user agent"
update1 PageVerifyIdentitySteps.html PageVerifyIdentitySteps "Verify your identity steps"
update1 CompleteRedirect.html CompleteRedirect "Processing Complete - redirecting"


# return to the initial directory
cd ${CURRENT_DIR}
