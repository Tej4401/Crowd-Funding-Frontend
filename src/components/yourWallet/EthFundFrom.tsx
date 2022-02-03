import React, { useState, useEffect } from "react"
import { Token } from "../Main"
import { useEthers, useEtherBalance, useNotifications } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import { Button, Input, CircularProgress, Snackbar } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import { useFundEther } from "../../hooks"
import { utils } from "ethers"

export const EthFundForm = () => {
    const { account } = useEthers()
    const tokenBalance = useEtherBalance(account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    const { notifications } = useNotifications()

    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmount(newAmount)
        console.log(newAmount)
    }

    const { approveAndFund, approveAndFundEtherState } = useFundEther()
    const handleFundSubmit = () => {
        return approveAndFund(amount.toString())
    }
    const isMining = approveAndFundEtherState.status === "Mining"
    const [showFundEtherSuccess, setShowFundEtherSuccess] = useState(false)
    const handleCloseSnack = () => {
        setShowFundEtherSuccess(false)
    }

    useEffect(() => {
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Fund Ether"
        ).length > 0) {
            setShowFundEtherSuccess(true)
        }
    }, [notifications, showFundEtherSuccess])

    return (
        <>
            <div>
                <Input
                    onChange={handleInputChange} />
                <Button
                    onClick={handleFundSubmit}
                    color="primary"
                    size="large">
                    {isMining ? <CircularProgress size={26} /> : "Fund!!!"}
                </Button>
            </div>
            <Snackbar
                open={showFundEtherSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack}>
                <Alert onClose={handleCloseSnack} severity="success">
                    Ether Fundd!
                </Alert>
            </Snackbar>
        </>
    )
}