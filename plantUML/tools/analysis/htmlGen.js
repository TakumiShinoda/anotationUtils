const cheerio = require('cheerio')
const fsp = require('fs').promises

const globals = require(`${__dirname}/globals.js`)

function hoge(){}

(async () => {
  let templateHtmlStr = await fsp.readFile(`${__dirname}/template.html`, 'utf-8')
  let plantUmlParsedJsonStr = await fsp.readFile(`${__dirname}/output/parsed.json`, 'utf-8')
  let mermaidStr = ''
  let templateHtml = cheerio.load(templateHtmlStr)
  let plantUmlParsedJson = JSON.parse(plantUmlParsedJsonStr)

  if(templateHtml('.mermaid').length != 1) return

  for(let pupjk of Object.keys(plantUmlParsedJson)){
    mermaidStr += `
      ${pupjk.replaceAll('-', '_')}["****<hr>id = ${pupjk}<br>detail = ${plantUmlParsedJson[pupjk].detail}"]:::defaultStyle
    `
  }

  for(let pupjk of Object.keys(plantUmlParsedJson)){
    for(let c of plantUmlParsedJson[pupjk].child){
      mermaidStr += `
        ${c.replaceAll('-', '_')} --> ${pupjk.replaceAll('-', '_')}
      `
    }
  }

  mermaidStr = `
    graph BT
      classDef defaultStyle font-size:10px,rx:8px,ry:8px
      ${mermaidStr}
  `
  console.log(mermaidStr)

  templateHtml('.mermaid').text(mermaidStr)
  fsp.writeFile(`${globals.OutputPath}/index.html`, templateHtml.html())
})()