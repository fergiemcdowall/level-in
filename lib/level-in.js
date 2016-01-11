var cmdr = require('commander')
var version = require('../package.json').version
var levelup = require('levelup')
var args = process.argv
if (args.length <= 2) {
  args.push('-h')
}

cmdr
  .version(version)
  .usage('<databaseName> [options]')
  .option('-k, --key [value]',
    'specify a key')
  .option('-m, --mode [value]',
    'specify a mode, can be either "put" or "del"',
    /^(put|del)$/i)
  .option('-v, --value [value]',
    'specify a value')
  .parse(args)

if (!cmdr.key || (typeof (cmdr.key) === 'boolean')) {
  console.error(new Error('you need to specify a key'))
} else if (!cmdr.mode || (typeof (cmdr.mode) === 'boolean')) {
  console.error(new Error('you need to specify a mode (put or del)'))
} else if (!cmdr.value || (typeof (cmdr.value) === 'boolean')) {
  console.error(new Error('you need to specify a value'))
} else {
  levelup(cmdr.args[0], {}, function (err, db) {
    if (err) {
      throw new Error('Ooooh Noooo!')
    } else if (cmdr.mode === 'put') {
      db.put(cmdr.key, cmdr.value, function (err) {
        if (err) {
          throw err
        } else {
          return console.log(
            JSON.stringify({key: cmdr.key, value: cmdr.value}) +
              ' inserted into database ' + cmdr.args[0])
        }
      })
    }
  })
}
