import { useEffect, useState } from "react"
import { useEthers, useContractFunction } from "@usedapp/core"
import { constants, utils } from "ethers"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import ERC20 from "../chain-info/contracts/MockERC20.json"
import { Contract } from "@ethersproject/contracts"
import networkMapping from "../chain-info/deployments/map.json"

export const useFundTokens = (tokenAddress: string) => {
    // address
    // abi
    // chainId
    const { chainId } = useEthers()
    const { abi } = TokenFarm
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

    const erc20ABI = ERC20.abi
    const erc20Interface = new utils.Interface(erc20ABI)
    const erc20Contract = new Contract(tokenAddress, erc20Interface)
    // approve
    const { send: approveErc20Send, state: approveAndFundErc20State } =
        useContractFunction(erc20Contract, "approve", {
            transactionName: "Approve ERC20 transfer",
        })
    const approveAndFund = (amount: string) => {
        setAmountToFund(amount)
        return approveErc20Send(tokenFarmAddress, amount)
    }
    // fund
    const { send: fundSend, state: fundState } =
        useContractFunction(tokenFarmContract, "fundTokens", {
            transactionName: "Fund Tokens",
        })
    const [amountToFund, setAmountToFund] = useState("0")

    //useEffect
    useEffect(() => {
        if (approveAndFundErc20State.status === "Success") {
            fundSend(amountToFund, tokenAddress)
        }
    }, [approveAndFundErc20State, amountToFund, tokenAddress])


    const [state, setState] = useState(approveAndFundErc20State)

    useEffect(() => {
        if (approveAndFundErc20State.status === "Success") {
            setState(fundState)
        } else {
            setState(approveAndFundErc20State)
        }
    }, [approveAndFundErc20State, fundState])

    return { approveAndFund, state }
}