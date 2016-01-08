const test = require('tape')
const spawn = require('child_process').spawn
const levelup = require('levelup')

test('Help text test', function (t) {
  const helpCmd = spawn('bin/level-in', ['-h'])
  const noParamCmd = spawn('bin/level-in')
  const helpLines =
  ['',
    '\n',
    '  Usage: level-in [options]',
    '\n',
    '',
    '\n',
    '  Options:',
    '\n',
    '',
    '\n',
    '    -h, --help              output usage information',
    '\n',
    '    -V, --version           output the version number',
    '\n',
    '    -d, --database [value]  the name of the leveldb',
    '\n',
    '    -k, --key [value]       specify a key',
    '\n',
    '    -m, --mode [value]      specify a mode, can be either "put" or "del"',
    '\n',
    '    -v, --value [value]     specify a value',
    '\n',
    '',
    '\n',
    ''
  ]
  t.plan(50)
  noParamCmd.stdout.on('data', (data) => {
    data.toString().split(/(\r?\n)/g).forEach(function (line, i) {
      t.equal(helpLines[i], line)
    })
  })
  helpCmd.stdout.on('data', (data) => {
    data.toString().split(/(\r?\n)/g).forEach(function (line, i) {
      t.equal(helpLines[i], line)
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
  const cmd1 = spawn('bin/level-in', ['-d'])
  const cmd2 = spawn('bin/level-in', ['-d', testDBName])
  const cmd3 = spawn('bin/level-in', ['-d', testDBName, '-k', testKey])
  const cmd4 = spawn('bin/level-in', ['-d', testDBName, '-k', testKey, '-m', 'put'])
  const cmd5 = spawn('bin/level-in', ['-d', testDBName, '-k', testKey, '-m', 'put', '-v', testValue])
  t.plan(6)
  cmd1.stdout.on('data', (data) => {
    t.equal(data.toString(), '[Error: you need to specify a database]\n')
  })
  cmd2.stdout.on('data', (data) => {
    t.equal(data.toString(), '[Error: you need to specify a key]\n')
  })
  cmd3.stdout.on('data', (data) => {
    t.equal(data.toString(), '[Error: you need to specify a mode (put or del)]\n')
  })
  cmd4.stdout.on('data', (data) => {
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
            t.equal(testValue, val)
          }
        })
      }
    })
  })
})
