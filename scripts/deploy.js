const { ethers, run, network } = require("hardhat")

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
  console.log("Deplooooying...")
  const SimpleStorage = await SimpleStorageFactory.deploy()
  await SimpleStorage.deployed()
  console.log(`Deployed contract to ${SimpleStorage.address}`)
  console.log(network.config.chainId)

  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    await SimpleStorage.deployTransaction.wait(6)
    await verify(SimpleStorage.address, {})
  }

  const currentFavoriteNumber = await SimpleStorage.retrieveNumber()
  console.log(`Current Number => ${currentFavoriteNumber.toString()}`)

  const txResponse = await SimpleStorage.storeNumber("729")
  await txResponse.wait(1)

  const modifiedFavoriteNumber = await SimpleStorage.retrieveNumber()
  console.log(`Modified Number => ${modifiedFavoriteNumber.toString()}`)
}

async function verify(contractAddress, args) {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArgsParams: args
    })
  }
  catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("ALREADY VERIFIED")
    }
    else {
      console.log(error)
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })