import { Token } from "../Main"
import { useEthers, useTokenBalance } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import { BalanceMsg } from "../../components/BalanceMsg"

export interface WalletBalanceProps {
    token: Token,
    account: string
}

export const WalletBalance = ({ token, account }: WalletBalanceProps) => {
    const { image, address, name } = token
    const tokenBalance = useTokenBalance(address, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    return (<BalanceMsg
        label={`Current ${name} wallet balance : `}
        tokenImgSrc={image}
        amount={formattedTokenBalance} />)
}