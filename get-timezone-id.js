#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const file = fs.readFileSync(path.join(__dirname, 'timezones.json'), 'utf8')
const json = JSON.parse(file)

let output = [];

for (const key in json) {
  if (Object.hasOwnProperty.call(json, key)) {

    const element = json[key];

    if (!output.includes(element)) {
      output.push(element)
    }
  }
}

fs.writeFileSync("timezoneId.json" , JSON.stringify(output))
