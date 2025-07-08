
const plantuml = require('node-plantuml-latest')
const fs = require('fs')

const gen = plantuml.generate(`${__dirname}/../main.pu`, { format: 'svg', jarPath: `${__dirname}/plantuml-mit-1.2025.4.jar` })

gen.out.pipe(fs.createWriteStream(`${__dirname}/../imaged/main.svg`))