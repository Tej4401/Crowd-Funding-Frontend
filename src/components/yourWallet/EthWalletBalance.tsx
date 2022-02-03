import { useEthers, useEtherBalance } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import { BalanceMsg } from "../BalanceMsg"
import eth from "../../eth.png";

export interface Props {
    account: string
}

export const EthWalletBalance = ({ account }: Props ) => {
    const etherBalance = useEtherBalance(account);
    const formattedetherBalance: number = etherBalance ? parseFloat(formatUnits(etherBalance, 18)) : 0
    return (<BalanceMsg
        label={`Current ETH wallet balance : `}
        tokenImgSrc={eth}
        amount={formattedetherBalance} />)
}