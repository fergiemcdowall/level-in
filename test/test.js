const test = require('tape')
const spawn = require('child_process').spawn
const sandbox = 'test/sandbox'

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
    '    -d, --data [value]   specify data',
    '\n',
    '    -k, --key [value]    specify a key',
    '\n',
    '    -m, --mode [value]   specify a mode, can be either \'put\' or \'del\'',
    '\n',
    '    -v, --value [value]  specify a value',
    '\n',
    '',
    '\n',
    ''
  ]
  t.plan(50)
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
  const testDBName = sandbox + '/testDB'
  const cmd = spawn('bin/level-in', [testDBName])
  t.plan(1)
  cmd.stderr.on('data', (data) => {
    t.equal(data.toString(), '[Error: you need to specify a mode (put or del)]\n')
  })
})

test('database test', function (t) {
  const testDBName = sandbox + '/testDB'
  const testKey = 'foo'
  const cmd = spawn('bin/level-in', [testDBName, '-k', testKey])
  t.plan(1)
  cmd.stdout.on('data', (data) => {
    t.equal(data.toString(), '[Error: you need to specify a mode (put or del)]\n')
  })
})

test('database test', function (t) {
  const testDBName = sandbox + '/testDB'
  const testKey = 'foo'
  const cmd = spawn('bin/level-in', [testDBName, '-k', testKey, '-m', 'put'])
  t.plan(1)
  cmd.stderr.on('data', (data) => {
    t.equal(data.toString(), '[Error: you need to specify a value]\n')
  })
})

test('database test', function (t) {
  const testDBName = sandbox + '/testDB'
  const testKey = 'foo'
  const testValue = 'bar'
  const cmd = spawn('bin/level-in', [testDBName, '-k', testKey, '-m', 'put', '-v', testValue])
  t.plan(1)
  cmd.stdout.on('data', (data) => {
    t.equal(data.toString(), '{"key":"foo","value":"bar"} inserted into database ' + testDBName + '\n')
    const levelup = require('levelup')
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

// test('pipe test', function (t) {
//   const testDBName = sandbox + '/pipeTestDB'
//   const cmd = spawn('cat', 'test/data.stream', 'bin/level-in', [testDBName])
//   t.plan(9)
//   cmd.stderr.on('data', (data) => {
//     t.equal(1, 1)
//   })
// })
