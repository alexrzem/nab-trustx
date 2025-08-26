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

// Inject document type in manual input scenario
// https://github.com/daon-private/apac-nab/tree/nab-dev-lambda/src/main/resources/DatazooConverterConfig/DVS
const DOCTYPE_AU_PASSPORT = "Australia Passport";
const DOCTYPE_FOREIGN_PASSPORT = "Foreign Passport";
const DOCTYPE_DRIVERS_LICENSE = "Australia Driving License";
const DOCTYPE_MEDICARE = "medicare";
const DOCTYPE_BIRTH_CERTIFICATE = "birthCertificate";
const DOCTYPE_CITIZENSHIP_CERTIFICATE = "citizenship";
const DOCTYPE_CENTRELINK = "centrelink";



// Additional document json
const additionalDocMedicare = {
  "additionalDocuments": {
    "medicareCard": {
      "id": "medicareCard",
      "required": false,
      "title": {
        "values": {
          "en": "Medicare Card"
        }
      },
      "subtitle": {
        "values": {
          "en": "Take a photo of your Medicare card"
        }
      },
      "instructions": [
        {
          "values": {
            "en": "Place your document on the clear background providing high contrast to your document, and is well lit and without glare"
          }
        },
        {
          "values": {
            "en": "Position document inside the marked area and hold still for a few moments until the process is completed"
          }
        },
        {
          "values": {
            "en": "Verify that photo of your document is clear and readable"
          }
        }
      ],
      "pages": {
        "bounded": true,
        "minPages": 1,
        "maxPages": -1
      },
      "imageHref": "https://cdn.gum.trustx.com/additionalDocs/tenants/nabsandbox/FX2BPLN6B5G7DS7NFMGJTVE47M-0/medicareCard.jpeg"
    },
  },
  "requirements": {
    "minAdditionalDocuments": 0
  }
}

const additionalDocBirthCert = {
  "additionalDocuments": {
    "birthCertificate": {
      "id": "birthCertificate",
      "required": false,
      "title": {
        "values": {
          "en": "Birth Certficate"
        }
      },
      "subtitle": {
        "values": {
          "en": "Take a photo of your Birth Certificate"
        }
      },
      "instructions": [
        {
          "values": {
            "en": "Place your document on the clear background providing high contrast to your document, and is well lit and without glare"
          }
        },
        {
          "values": {
            "en": "Position document inside the marked area and hold still for a few moments until the process is completed"
          }
        },
        {
          "values": {
            "en": "Verify that photo of your document is clear and readable"
          }
        }
      ],
      "pages": {
        "bounded": true,
        "minPages": 1,
        "maxPages": -1
      }
    }
  },
  "requirements": {
    "minAdditionalDocuments": 0
  }
}

const additionalDocumentJson = {
  medicareCard: { ...additionalDocMedicare },
  birthCertificate: { ...additionalDocBirthCert }
}

