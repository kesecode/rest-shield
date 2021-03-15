#!/bin/sh

COVERAGE=`jq -r '.total.lines.pct' coverage-summary.json`
COVERAGE=$(echo ${COVERAGE%.*})

TOKEN=$(curl --location --request POST 'rest.kesecode.io/api/auth' --header 'Authorization: '$USER' '$PASSWORD'' | jq -r '.token')

curl --location --request POST 'rest.kesecode.io/post/kesecode/rest-shield/coverage' --header 'Authorization: Bearer '$TOKEN'' --header 'JSON: {"coverage": '$COVERAGE'}'
