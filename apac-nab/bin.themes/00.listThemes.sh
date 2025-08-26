#!/bin/bash

. ../settings.sh

API_TOKEN=`cat id/apiToken`

curl -sSk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -X GET \
  "${BASE_URL}/api/theme-server/themes" \
| python3 -m json.tool | tee $0.json

