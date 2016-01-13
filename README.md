A simple utility for writing to a leveldb via [levelup](https://github.com/Level/levelup)

[![NPM version][npm-version-image]][npm-url] [![MIT License][license-image]][license-url] [![Build Status][travis-image]][travis-url]

## Usage

Install globally with `npm install -g level-in` and then use like so:


```

  Usage: level-in <databaseName> [options]

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -k, --key [value]    specify a key
    -m, --mode [value]   specify a mode, can be either "put" or "del"
    -v, --value [value]  specify a value

```

`level-in` is pipeable so you can stream data into it like so:

```bash
echo '{"key":"1",value:"one"}' | level-in myDB
```

...meaning you could dump the contents of a text file into a levelDB like so:

```bash
cat data.stream | level-in myDB
```

...or even replicate from another DB using [level-out](https://www.npmjs.com/package/level-out)

```bash
level-out oldDB | level-in newDB
```



[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[npm-url]: https://npmjs.org/package/level-in
[npm-version-image]: http://img.shields.io/npm/v/level-in.svg?style=flat
[npm-downloads-image]: http://img.shields.io/npm/dm/level-in.svg?style=flat

[travis-url]: http://travis-ci.org/fergiemcdowall/level-in
[travis-image]: http://img.shields.io/travis/fergiemcdowall/level-in.svg?style=flat