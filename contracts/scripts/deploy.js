
const hre = require("hardhat");

async function main() {
  
  const VendingMachine = await hre.ethers.getContractFactory("VendingMachine");
  const vendingmachine = await VendingMachine.deploy("0x7f0Ed920Ed6b5bd1fBFd5Ab6b46DE777997468A5");

  await vendingmachine.deployed();

  console.log(
    `vending machine deployed to ${vendingmachine.address}`
  );
  }
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
