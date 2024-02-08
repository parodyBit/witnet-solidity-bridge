const fs = require("fs")
require("dotenv").config()
const lockfile = require("proper-lockfile")
const readline = require("readline")

const traceHeader = require("./traceHeader")
const traceTx = require("./traceTx")

module.exports = {
  fromAscii,
  getRealmNetworkFromArgs,
  getRealmNetworkFromString,
  getWitnetArtifactsFromArgs,
  getWitnetRequestMethodString,
  isDryRun,
  padLeft,
  prompt,
  readAddresses,
  saveAddresses,
  traceHeader,
  traceTx,
}

function fromAscii (str) {
  const arr1 = []
  for (let n = 0, l = str.length; n < l; n++) {
    const hex = Number(str.charCodeAt(n)).toString(16)
    arr1.push(hex)
  }
  return "0x" + arr1.join("")
}

function getRealmNetworkFromArgs () {
  let networkString = process.argv.includes("test") ? "test" : "development"
  // If a `--network` argument is provided, use that instead
  const args = process.argv.join("=").split("=")
  const networkIndex = args.indexOf("--network")
  if (networkIndex >= 0) {
    networkString = args[networkIndex + 1]
  }
  return getRealmNetworkFromString(networkString)
}

function getRealmNetworkFromString (network) {
  network = network ? network.toLowerCase() : "development"
  if (network.indexOf(":") > -1) {
    return [network.split(":")[0], network]
  } else {
    return [null, network]
  }
}

function getWitnetRequestMethodString(method) {
  if (!method) {
      return "HTTP-GET"
  } else {
      const strings = {
          0: "UNKNOWN",
          1: "HTTP-GET",
          2: "RNG",
          3: "HTTP-POST",
          4: "HTTP-HEAD",
      }
      return strings[method] || method.toString()
  }
}

function getWitnetArtifactsFromArgs() {
  let selection = []
  process.argv.map((argv, index, args) => {
      if (argv === "--artifacts") {
          selection = args[index + 1].split(",")
      }
      return argv
  })
  return selection
};

function isDryRun (network) {
  return network === "test" || network.split("-")[1] === "fork" || network.split("-")[0] === "develop"
}

function padLeft (str, char, size) {
  if (str.length < size) {
    return char.repeat((size - str.length) / char.length) + str
  } else {
    return str
  }
}

async function prompt (text) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  let answer
  await new Promise((resolve) => {
    rl.question(
      text,
      function (input) {
        answer = input
        rl.close()
      })
    rl.on("close", function () {
      resolve()
    })
  })
  return answer
}

async function readAddresses (network) {
  const filename = "./migrations/witnet.addresses.json"
  lockfile.lockSync(filename)
  const addrs = JSON.parse(await fs.readFileSync(filename))
  lockfile.unlockSync(filename)
  return addrs[network] || {}
}

async function saveAddresses (network, addrs) {
  const filename = "./migrations/witnet.addresses.json"
  lockfile.lockSync(filename)
  const json = JSON.parse(fs.readFileSync(filename))
  json[network] = addrs
  fs.writeFileSync(filename, JSON.stringify(json, null, 4), { flag: "w+" })
  lockfile.unlockSync(filename)
}
