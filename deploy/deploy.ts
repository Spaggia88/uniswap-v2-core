import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { getChain, isDevelopmentNetwork } from '@nomicfoundation/hardhat-viem/internal/chains'
import { Address } from 'viem'

const deployFunction: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre
  const chain = await getChain(network.provider)
  const deployer = (await getNamedAccounts())['deployer'] as Address

  if (await deployments.getOrNull('UniswapV2Factory')) {
    return
  }

  let feeToSetter: Address = '0x'
  if (chain.testnet || isDevelopmentNetwork(chain.id)) {
    feeToSetter = deployer
  } else {
    throw new Error('Unknown chain')
  }

  await hre.deployments.deploy('UniswapV2Factory', {
    from: deployer,
    args: [feeToSetter],
    log: true,
  })
}

export default deployFunction
