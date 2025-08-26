#!/bin/bash

SECRET_FILE=../../_secret.sandbox.gum.txt

if [ -f ${SECRET_FILE} ] ; then
  export SECRET0=`cat ${SECRET_FILE}`
fi

export BASE_URL0=https://nabsandbox.gum.trustx.com


export SECRET=${TRUSTX_SECRET:-${SECRET0}}
export BASE_URL=${TRUSTX_BASE_URL:-${BASE_URL0}}

