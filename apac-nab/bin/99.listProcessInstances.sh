#!/bin/bash

. ../settings.sh

API_TOKEN=`cat id/apiToken`

curl -sSk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -X GET \
  "${BASE_URL}/api/process-manager/processInstances/search?size=1000" \
| python3 -m json.tool | tee $0.json

# https://apacps.gum.trustx.com/api/process-manager/processInstances/search?
# searchString=
# &startDateTime=2023-07-25T14:00:03.742Z
# &endDateTime=2023-08-02T13:59:03.743Z
# &processDefinitionName=#
# &processDefinitionId=
# &page=0
# &processInstanceStatus=
# &sort=createdAt,desc
# &size=100
