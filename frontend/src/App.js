import {useEffect, useState} from "react";
import {ethers} from "ethers";
import {Route, Routes} from "react-router";
import TabComponent from "./TabComponent";
import './App.css'
import ManageFind from "./ManageFind";
import ManageDetails from "./ManageDetails";

export default function App() {

    const [address, setAddress] = useState()
    const [signer, setSigner] = useState()
    const [provider, setProvider] = useState()

    const initialize = async () => {
        console.log("Initializing")
        const etherProvider = new ethers.providers.Web3Provider(window.ethereum);

        const accounts = await etherProvider.send(
            'eth_requestAccounts',
            [],
        );
        setSigner(await etherProvider.getSigner())
        setAddress(accounts[0])
        setProvider(etherProvider)
    }

    useEffect(() => {
        initialize()
    }, [])

    return <Routes>
        <Route exact path="/manage/:address" element={<TabComponent active={"manage"}
                                                                    address={address}
                                                                    signer={signer}
                                                                    manageComponent={() => <ManageDetails myAddress={address} signer={signer}
                                                                                                          provider={provider}/>}/>}/>
        <Route exact path="/deploy" element={<TabComponent active={"deploy"} provider={provider} signer={signer} manageComponent={() => {}}/>}/>
        <Route exact path="/" element={<TabComponent active={"manage"}
                                               address={address}
                                               signer={signer}
                                               manageComponent={() => <ManageFind address={address} signer={signer}
                                                                                  provider={provider}/>}/>}/>
    </Routes>
}
