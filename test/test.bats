#!/usr/bin/env bats

SANDBOX=test/sandbox

@test "level-in client is available?" {
  run ./bin/level-in
  [ $status = 0 ]
}

@test "Show help?" {
  run ./bin/level-in
  [ "${lines[0]}" = "  Usage: level-in <databaseName> [options]" ]
  [ "${lines[1]}" = "  Options:" ]
  [ "${lines[2]}" = "    -h, --help           output usage information" ]
  [ "${lines[3]}" = "    -V, --version        output the version number" ]
  [ "${lines[4]}" = "    -d, --data [value]   specify data" ]
  [ "${lines[5]}" = "    -k, --key [value]    specify a key" ]
  [ "${lines[6]}" = "    -m, --mode [value]   specify a mode, can be either 'put' or 'del'" ]
  [ "${lines[7]}" = "    -v, --value [value]  specify a value" ]
  [ $status = 0 ]
}

@test "Show version?" {
  run ./bin/level-in -V
  [ "${lines[0]}" = "0.0.9" ]
  [ $status = 0 ]
}

@test "No params specified?" {
  run ./bin/level-in
  [ "${lines[0]}" = "  Usage: level-in <databaseName> [options]" ]
  [ "${lines[1]}" = "  Options:" ]
  [ "${lines[2]}" = "    -h, --help           output usage information" ]
  [ "${lines[3]}" = "    -V, --version        output the version number" ]
  [ "${lines[4]}" = "    -d, --data [value]   specify data" ]
  [ "${lines[5]}" = "    -k, --key [value]    specify a key" ]
  [ "${lines[6]}" = "    -m, --mode [value]   specify a mode, can be either 'put' or 'del'" ]
  [ "${lines[7]}" = "    -v, --value [value]  specify a value" ]
  [ $status = 0 ]
}

@test "Only DB name specified?" {
  run ./bin/level-in $SANDBOX/testDB
  [ "${lines[0]}" = "[Error: you need to specify a key]" ]
  [ $status = 0 ]
}

@test "Only DB name and key name specified?" {
  run ./bin/level-in {$SANDBOX}/testDB -k foo
  [ "${lines[0]}" = "[Error: you need to specify a value]" ]
  [ $status = 0 ]
}

@test "Can successfully insert a key-value pair?" {
  run ./bin/level-in $SANDBOX/testDB -k foo -v bar
  [ "${lines[0]}" = '{"key":"foo","value":"bar"} inserted into database test/sandbox/testDB' ]
  [ $status = 0 ]
}

@test "Can successfully pipe in a file?" {
  run bash -c "cat ./test/data.stream | ./bin/level-in $SANDBOX/testDB"
  [ "${lines[0]}" = 'inserted {"key":"1","value":"one"}' ]
  [ "${lines[1]}" = 'inserted {"key":"2","value":"two"}' ]
  [ "${lines[2]}" = 'inserted {"key":"3","value":"three"}' ]
  [ "${lines[3]}" = 'inserted {"key":"4","value":"four"}' ]
  [ "${lines[4]}" = 'inserted {"key":"5","value":"five"}' ]
  [ "${lines[5]}" = 'inserted {"key":"6","value":"six"}' ]
  [ "${lines[6]}" = 'inserted {"key":"7","value":"seven"}' ]
  [ "${lines[7]}" = 'inserted {"key":"8","value":"eight"}' ]
  [ "${lines[8]}" = 'inserted {"key":"9","value":"nine"}' ]
  [ $status = 0 ]
}

@test "Can delete?" {
  run ./bin/level-in $SANDBOX/testDB -m del -k 7
  [ "${lines[0]}" = '7 deleted from test/sandbox/testDB' ]
  [ $status = 0 ]
}

@test "Can verify delete?" {
  run level-out $SANDBOX/testDB
  [ "${lines[0]}" = "{ key: '1', value: 'one' }" ]
  [ "${lines[1]}" = "{ key: '2', value: 'two' }" ]
  [ "${lines[2]}" = "{ key: '3', value: 'three' }" ]
  [ "${lines[3]}" = "{ key: '4', value: 'four' }" ]
  [ "${lines[4]}" = "{ key: '5', value: 'five' }" ]
  [ "${lines[5]}" = "{ key: '6', value: 'six' }" ]
  [ "${lines[6]}" = "{ key: '8', value: 'eight' }" ]
  [ "${lines[7]}" = "{ key: '9', value: 'nine' }" ]
  [ "${lines[8]}" = "{ key: 'foo', value: 'bar' }" ]
  [ $status = 0 ]
}

#test for delete
