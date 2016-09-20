const fs = require('fs')
const xml2js = require('xml2js')
const parser = new xml2js.Parser()
const lib = require('../')
const parseHistory = lib.parseHistory
const parseSchema = lib.parseSchema
const makeHistory = lib.makeHistory

const xmlSchema = fs.readFileSync('./schema.xml').toString()
const xmlHistory = fs.readFileSync('./critters.xml').toString()

const parseXml = (xml, cb) => {
  parser.parseString(xml, (err, result) => {
    if (err) {
      console.log(err)
      return
    }
    cb(result)
  })
}

parseXml(xmlSchema, (rawSchema) => {
  parseXml(xmlHistory, (rawHistory) => {
    const schema = parseSchema(rawSchema)
    const history = parseHistory(rawHistory)
    console.dir(makeHistory(schema, history))
  })
})
