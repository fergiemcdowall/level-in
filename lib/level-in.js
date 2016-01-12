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
  .option('-d, --data [value]', 'specify data')
  .option('-k, --key [value]',
    'specify a key')
  .option('-m, --mode [value]',
    'specify a mode, can be either \'put\' or \'del\'',
    /^(put|del)$/i, 'put')
  .option('-v, --value [value]',
    'specify a value')
  .parse(args)

if (!process.stdin.isTTY) {
  levelup(cmdr.args[0], {}, function (err, db) {
    if (err) {
      console.error(err)
    } else {
      require('readline').createInterface({
        input: process.stdin
      }).on('line', (line) => {
        var obj = JSON.parse(line.toString())
        db.batch([obj], function (err) {
          if (err) {
            console.error(err)
          } else {
            console.log('inserted ' + JSON.stringify(obj))
          }
        })
      })
    }
  })
} else if (cmdr.mode === 'put') {
  if (!cmdr.key || (typeof (cmdr.key) === 'boolean')) {
    console.error(new Error('you need to specify a key'))
  } else if (!cmdr.value || (typeof (cmdr.value) === 'boolean')) {
    console.error(new Error('you need to specify a value'))
  } else {
    var db = levelup(cmdr.args[0], {})
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
} else if (cmdr.mode === 'del') {
  if (!cmdr.key || (typeof (cmdr.key) === 'boolean')) {
    console.error(new Error('you need to specify a key'))
  } else {
    levelup(cmdr.args[0], {}, function (err, db) {
      if (err) {
        throw new Error('Ooooh Noooo!')
      } else {
        db.del(cmdr.key, function (err) {
          if (err) {
            throw err
          } else {
            return console.log(
              JSON.stringify(cmdr.key + ' deleted from ' + cmdr.args[0])
            )
          }
        })
      }
    })
  }
} else {
  console.error(new Error('you need to specify a mode (put or del)'))
}
