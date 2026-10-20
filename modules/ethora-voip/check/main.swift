// Prints callKitUuid for each argument; run.sh compares with the SDK's JS.
for seed in CommandLine.arguments.dropFirst() {
  print(CallKitUuid.make(seed))
}
