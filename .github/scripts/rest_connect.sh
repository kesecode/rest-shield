#!/bin/sh

COVERAGE=`jq -r '.total.lines.pct' coverage-summary.json`
COVERAGE=$(echo ${COVERAGE%.*})

echo $POST_URL
echo $AUTH_URL

TOKEN=$(curl --location --request POST $AUTH_URL --header 'Authorization: '$USER' '$PASSWORD'' | jq -r '.token')

curl --location --request POST $POST_URL --header 'Authorization: Bearer '$TOKEN'' --header 'JSON: {"value": '$COVERAGE'}'
