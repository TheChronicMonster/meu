const MeUToken = artifacts.require("MeUToken");
const MeUPlatform = artifacts.require("MeUPlatform");

module.exports = async function(deployer) {
  await deployer.deploy(MeUToken, "1000000000000000000000000"); // 1 million tokens
  const tokenInstance = await MeUToken.deployed();
  await deployer.deploy(MeUPlatform, tokenInstance.address, "1000000000000000000"); // 1 token registration fee
};
