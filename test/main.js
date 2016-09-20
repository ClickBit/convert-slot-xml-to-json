requirejs(["../build/index.js"], function(historyUtils) {
  console.log(historyUtils)
  // historyUtils.parseXml(xmlSchema, (rawSchema) => {
  //   historyUtils.parseXml(xmlHistory, (rawHistory) => {
  //     const schema = historyUtils.parseSchema(rawSchema)
  //     const history = historyUtils.parseHistory(rawHistory)
  //     console.dir(historyUtils.makeHistory(schema, history))
  //   })
  // })
});