import { Token } from "./Main"
import React, { useState } from "react"
import { useEthers } from "@usedapp/core";
import { constants } from "ethers"
import { Box, makeStyles } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import { Tab } from "@material-ui/core"
import { WalletBalance } from "./yourWallet/WalletBalance"
import { EthWalletBalance } from "./yourWallet/EthWalletBalance";
import networkMapping from "../chain-info/deployments/map.json"

interface FundWalletProps {
    supportedTokens: Array<Token>
}

const useStyles = makeStyles((theme) => ({
    tabContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(4)
    },
    box: {
        backgroundColor: "white",
        borderRadius: "25px"
    },
    header: {
        color: "white"
    }
}))

export const FundWallet = ({ supportedTokens }: FundWalletProps) => {
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }
    const classes = useStyles()
    const { chainId } = useEthers()
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero
    return (
        <Box>
            <h1 className={classes.header}> Fund Wallet! </h1>
            <Box className={classes.box}>
                <TabContext value={selectedTokenIndex.toString()}>
                    <TabList onChange={handleChange} aria-label="fund form tabs">
                        {supportedTokens.map((token, index) => {
                            return (
                                <Tab label={token.name}
                                    value={index.toString()}
                                    key={index} />
                            )
                        })}
                    <Tab label="ETH" value={(supportedTokens.length).toString()} key={supportedTokens.length}/>
                    </TabList>
                    {supportedTokens.map((token, index) => {
                        return (
                            <TabPanel value={index.toString()} key={index}>
                                <div className={classes.tabContent}>
                                    <WalletBalance token={supportedTokens[selectedTokenIndex]} account={String(tokenFarmAddress)} />
                                </div>
                            </TabPanel>
                        )
                    })}
                    <TabPanel value={(supportedTokens.length).toString()} key={supportedTokens.length}>
                        <div className={classes.tabContent}>
                        <EthWalletBalance account={String(tokenFarmAddress)} />
                        </div>
                    </TabPanel>
                </TabContext>
            </Box>
        </Box >
    )

}