import { useEffect, useState } from "react"
import { useEthers, useContractFunction } from "@usedapp/core"
import { constants, utils } from "ethers"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import { Contract } from "@ethersproject/contracts"
import networkMapping from "../chain-info/deployments/map.json"

export const useFundEther = () => {
    // address
    // abi
    // chainId
    const { chainId } = useEthers()
    const { abi } = TokenFarm
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

    // approve
    const { send: approveEtherSend, state: approveAndFundEtherState } =
        useContractFunction(tokenFarmContract, "fundEth", {
            transactionName: "Fund Ether",
        })
    const approveAndFund = (amount: string) => {
        return approveEtherSend({value: utils.parseEther(amount)})
    }
    // fund
    
    const [state, setState] = useState(approveAndFundEtherState)

    return { approveAndFund, approveAndFundEtherState }
}