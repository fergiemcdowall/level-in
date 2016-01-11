const test = require('tape')
const spawn = require('child_process').spawn
const levelup = require('levelup')

test('Help text test', function (t) {
  const helpCmd = spawn('bin/level-in', ['-h'])
  const noParamCmd = spawn('bin/level-in')
  const helpLines =
  ['',
    '\n',
    '  Usage: level-in <databaseName> [options]',
    '\n',
    '',
    '\n',
    '  Options:',
    '\n',
    '',
    '\n',
    '    -h, --help           output usage information',
    '\n',
    '    -V, --version        output the version number',
    '\n',
    '    -k, --key [value]    specify a key',
    '\n',
    '    -m, --mode [value]   specify a mode, can be either "put" or "del"',
    '\n',
    '    -v, --value [value]  specify a value',
    '\n',
    '',
    '\n',
    ''
  ]
  t.plan(46)
  noParamCmd.stdout.on('data', (data) => {
    data.toString().split(/(\r?\n)/g).forEach(function (line, i) {
      t.equal(line, helpLines[i])
    })
  })
  helpCmd.stdout.on('data', (data) => {
    data.toString().split(/(\r?\n)/g).forEach(function (line, i) {
      t.equal(line, helpLines[i])
    })
  })
})

test('version test', function (t) {
  const version = require('../package.json').version
  const cmd = spawn('bin/level-in', ['-V'])
  t.plan(1)
  cmd.stdout.on('data', (data) => {
    t.equal(data.toString(), version + '\n')
  })
})

test('database test', function (t) {
  const testDBName = 'testDB'
  const testKey = 'foo'
  const testValue = 'bar'
  const cmd2 = spawn('bin/level-in', [testDBName])
  const cmd3 = spawn('bin/level-in', [testDBName, '-k', testKey])
  const cmd4 = spawn('bin/level-in', [testDBName, '-k', testKey, '-m', 'put'])
  const cmd5 = spawn('bin/level-in', [testDBName, '-k', testKey, '-m', 'put', '-v', testValue])
  t.plan(5)
  cmd2.stderr.on('data', (data) => {
    t.equal(data.toString(), '[Error: you need to specify a key]\n')
  })
  cmd3.stderr.on('data', (data) => {
    t.equal(data.toString(), '[Error: you need to specify a mode (put or del)]\n')
  })
  cmd4.stderr.on('data', (data) => {
    t.equal(data.toString(), '[Error: you need to specify a value]\n')
  })
  cmd5.stdout.on('data', (data) => {
    t.equal(data.toString(), '{"key":"foo","value":"bar"} inserted into database testDB\n')
    levelup(testDBName, {}, function (err, db) {
      if (err) {
        throw err
      } else {
        db.get(testKey, function (err, val) {
          if (err) {
            throw err
          } else {
            t.equal(val, testValue)
          }
        })
      }
    })
  })
})
