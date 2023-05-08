const { ethers } = require("hardhat")
const { assert, expect } = require("chai")

describe("SimpleStorage", function () {
    let simpleStorageFactory
    let simpleStorage

    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })

    it("Should start with a fav number of 0", async function () {
        const currentValue = await simpleStorage.retrieveNumber()
        assert.equal(currentValue.toString(), "0")
    })
    it("Should update when we call store", async function () {
        const storeResponse = await simpleStorage.storeNumber("729")
        await storeResponse.wait(1)
        const txValue = await simpleStorage.retrieveNumber()

        assert.equal(txValue.toString(), "729")
    })

    it("Should add 1 person after calling addPerson", async function () {
        const addResponse = await simpleStorage.addPerson("Pako", 77)
        await addResponse.wait(1)
        const person = await simpleStorage.people(0)
        assert.equal(person.name, "Pako")
    })
})