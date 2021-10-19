const xml2js = require('xml2js')
const parser = new xml2js.Parser()

module.exports.parseXml = (xml, cb) => {
  parser.parseString(xml, (err, result) => {
    if (err) {
      console.log(err)
      return
    }
    cb(result)
  })
}

module.exports.parseHistory = (data) => {
  const row = data.Content.Row[0]
  const root = row.Casino[0]
  const general = row.General[0].$
  const info = row.Casino[0].$
  const hand = row.Casino[0].Hand[0].$
  const scatters = {numberOfScatters: 0, scatterWin: 0}
  if (root.Scatter) {
    scatters.numberOfScatters = Number.parseInt(root.Scatter[0].$.NumInARow, 0)
    scatters.scatterWin = (root.Scatter[0].$.Won) ? Number.parseInt(root.Scatter[0].$.Won, 0) : 0
  }
  const lines = Object.keys(root)
    .filter(x => x.indexOf('Line') > -1)
    .map((x, i) => {
      let data = root[x][0]
      let symbols = Object.keys(data)
        .filter(x => x.indexOf('Reel') > -1)
        .map((x, i) => {
          return data[x][0]
        })
      let line = {
        number: i + 1,
        amount: Number.parseFloat(data.$.Won) || 0,
        symbols: symbols
      }
      return line
    })
  return Object.assign(general, info, hand, {lines: lines}, {scatters: scatters})
}

module.exports.parseSchema = (data) => {
  const lines = data.SlotOptions.LinesConfig[0].Line
    .map(x => {
      return x.Reel.map((x, i) => {
        return {
          x: i,
          y: x.$.position
        }
      })
    })
  return lines
}

module.exports.makeHistory = (schema, history) => {
  const hasWinnings = (history.BalanceWinnings && parseFloat(history.BalanceWinnings) > 0) || false
  const lines = history.lines
    .map((x, i) => {
      return Object.assign(x, {position: schema[i]})
    })
    .filter(x => x.amount > 0)
  const grid = history.lines.reduce((memo, x) => {
    switch (x.number) {
      case 1: {
        memo[1] = x.symbols
        break
      }
      case 2: {
        memo[0] = x.symbols
        break
      }
      case 3: {
        memo[2] = x.symbols
        break
      }
    }
    return memo
  }, [[], [], []])
  const playMode = history.PlayMode || 'R'
  const riskBonus = Number.parseFloat(history.RiskBonus || 0)
  const winBonus = Number.parseFloat(history.WinBonus || 0)
  const balanceBonus = Number.parseFloat(history.BalanceBonus || 0)
  const startBonus = (balanceBonus - winBonus) + riskBonus
  const riskReal = Number.parseFloat(history.Risk || 0)
  const winReal = Number.parseFloat(history.Win || 0)
  const balanceReal = Number.parseFloat(history.Balance || 0)
  const balanceWinnings = Number.parseFloat(history.BalanceWinnings || 0)
  const startReal = !hasWinnings ? (balanceReal - winReal) + riskReal : balanceReal + riskReal
  const startWinnings = !hasWinnings ? 0: balanceWinnings - winReal

  const meta = {
    id: history.PlayID,
    name: history.Game.split(' ')[0],
    category: 'slot',
    status: history.Outcome === 'Win' ? 'W' : 'L',
    risk: riskReal,
    riskBonus: riskBonus,
    balance: balanceReal,
    bonus: balanceBonus,
    winnings: balanceWinnings, // todo
    win: winReal,
    winBonus: winBonus,
    date: history.TransactionTime,
    startBonus: startBonus,
    startWinnings: startWinnings,
    startBalance: startReal,
    playMode: playMode
  }
  return Object.assign(meta, {
    data: {
      scatters: history.scatters,
      lines: lines,
      grid: grid
    }
  })
}
