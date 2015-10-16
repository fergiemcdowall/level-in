var cmdr = require('commander');
var version = require('../package.json').version;
var levelup = require('levelup');
var leveldown = require('leveldown');
var args = process.argv;
if (args.length <= 2) {args.push('-h')}

cmdr
  .version(version)
  .option('-d, --database [value]',
          'the name of the leveldb')
  .option('-k, --key [value]',
          'specify a key')
  .option('-v, --value [value]',
          'specify a value')
  .option('-m, --mode [value]',
          'specify a mode, can be put or del',
          /^(put|del)$/i)
  .parse(args);


if (!cmdr.database || (typeof(cmdr.database) === "boolean"))
  throw new Error('you need to specify a database');
if (!cmdr.key || (typeof(cmdr.key) === "boolean"))
  throw new Error(new Error('you need to specify a key'));
if (!cmdr.mode || (typeof(cmdr.mode) === "boolean"))
  throw new Error(new Error('you need to specify a mode (put or del)'));
if (!cmdr.value || (typeof(cmdr.value) === "boolean"))
  throw new Error(new Error('you need to specify a value'));

levelup(cmdr.database, {}, function (err, db) {
  if (cmdr.mode == 'put') {
    db.put(cmdr.key, cmdr.value, function(err){
      if (err) throw err;
    });
  }
});
