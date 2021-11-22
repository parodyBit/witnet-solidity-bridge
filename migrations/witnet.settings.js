const packageJson = require("../package.json")
module.exports = {
  artifacts: {
    default: {
      WitnetDecoderLib: "WitnetDecoderLib",
      WitnetParserLib: "WitnetParserLib",
      WitnetProxy: "WitnetProxy",
      WitnetRequestBoard: "WitnetRequestBoardTrustableDefault",
      WitnetRequestRandomness: "WitnetRequestRandomness",
      WitnetRNG: "WitnetRNG"
    },
  },
  constructorParams: {
    default: {
      WitnetRequestBoard: [
        /* _isUpgradable */ true,
        /* _verstionTag */ fromAscii(packageJson.version + "-trustable"),
        /* _reportResultGasLimit */ 120547,
      ],
    },
    boba: {
      WitnetRequestBoard: [
        /* _isUpgradable */ true,
        /* _versionTag */ fromAscii(packageJson.version + "-trustable-boba"),
        /* _reportResultGasLimit */ 134771,
      ],
    },
    celo: {
      WitnetRequestBoard: [
        /* _isUpgradable */ true,
        /* _verstionTag */ fromAscii(packageJson.version + "-trustable-celo"),
        /* _reportResultGasLimit */ 134371,
      ],
    },
  },
  compilers: {
    default: {
      solc: {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
        outputSelection: {
          "*": {
            "*": ["evm.bytecode"],
          },
        },
      },
    },
    conflux: {
      solc: {
        evmVersion: "petersburg",
      },
    },
  },
  networks: {
    default: {
      "ethereum.goerli": {
        network_id: 5,
        host: "localhost",
        port: 8545,
        skipDryRun: true,
      },
      "ethereum.kovan": {
        network_id: 42,
        host: "localhost",
        port: 8542,
        skipDryRun: true,
      },
      "ethereum.mainnet": {
        network_id: 1,
        host: "localhost",
        port: 9545,
      },
      "ethereum.rinkeby": {
        network_id: 4,
        host: "localhost",
        port: 8544,
        skipDryRun: true,
      },
      "ethereum.ropsten": {
        network_id: 3,
        host: "localhost",
        port: 8543,
      },
    },
    boba: {
      "boba.mainnet": {
        network_id: 288,
        host: "localhost",
        port: 9539,
        skipDryRun: true,
      },
      "boba.rinkeby": {
        network_id: 28,
        host: "localhost",
        port: 8539,
        skipDryRun: true,
      },
    },
    celo: {
      "celo.alfajores": {
        network_id: 44787,
        host: "localhost",
        port: 8538,
        skipDryRun: true,
      },
      "celo.mainnet": {
        network_id: 42220,
        host: "localhost",
        port: 9538,
        skipDryRun: true,
      },
    },
    conflux: {
      "conflux.testnet": {
        host: "localhost",
        port: 8540,
        network_id: 1,
        gasPrice: 10,
        skipDryRun: true,
      },
      "conflux.tethys": {
        host: "localhost",
        port: 9540,
        network_id: 1029,
        gasPrice: 1,
        skipDryRun: true,
      },
    },
  },
}

function fromAscii (str) {
  const arr1 = []
  for (let n = 0, l = str.length; n < l; n++) {
    const hex = Number(str.charCodeAt(n)).toString(16)
    arr1.push(hex)
  }
  return "0x" + arr1.join("")
}