import React, {useEffect, useState} from 'react';
import {useWeb3React} from '@web3-react/core';
import {Web3Provider} from "@ethersproject/providers";
import {Connector} from "./Connector";
import {Col, Container, Row} from "react-bootstrap";
import {Header} from "./Header";
import {PacketDeploy} from "./PacketDeploy";
import {PacketsList} from "./PacketsList";
import {Erc20Input} from "./Erc20Input";
import {Defungify, Defungify__factory, DefungifyFactory__factory, IERC20} from "./typechain";
import {factoryLocation} from "./factoryLocation";

function App() {
    const web3 = useWeb3React<Web3Provider>();
    const [erc20, setErc20] = useState<IERC20 | null>(null);
    const [defungify, setDefungify] = useState<Defungify | null>(null);

    // Updates defungify on every block
    useEffect(() => {
        // Check defungify factory on every block
        const checkDefungify = async ()  => {
            if (erc20 !== null) {
                console.log("Fetching Defungify");
                const dfFactory = DefungifyFactory__factory.connect(factoryLocation.get(web3.chainId!)!, web3.library!);
                const a = await dfFactory.deployedContracts(erc20.address);
                if (a === "0x0000000000000000000000000000000000000000") {
                    setDefungify(null);
                }
                else {
                    setDefungify(Defungify__factory.connect(a, web3.library!));
                }
            }
        }

        // Register
        console.log("Registering listener for defungify");
        web3.library?.on("block", checkDefungify);

        return () => {
            console.log("Removing listener for defungify");
            web3.library?.removeListener("block", checkDefungify)
        }
    }, [erc20, web3.library, web3.account, web3.chainId]);

    return (
        <Container fluid className="mt-2">
            <Row className="my-2">
                <Col>
                    <Header/>
                </Col>
            </Row>
            <hr/>
            <Row className="my-2">
                <Col>
                    <Connector/>
                </Col>
            </Row>
            {
                web3.active ?
                    <Row className="my-2">
                        <Col>
                            <Erc20Input setErc20={setErc20}/>
                        </Col>
                    </Row>
                    : <div/>
            }
            <hr/>
            {
                (web3.active && erc20 != null) ?
                    <Row className="my-2">
                        <Col>
                            <PacketDeploy erc20={erc20} defungify={defungify} dfFactory={
                                DefungifyFactory__factory.connect(factoryLocation.get(web3.chainId!)!, web3.library!)
                            }/>
                        </Col>
                    </Row>
                    : <div/>
            }
            <hr/>
            {
                (web3.active && erc20 != null && defungify != null) ?
                    <Row className="my-2">
                        <Col>
                            <PacketsList defungify={defungify}/>
                        </Col>
                    </Row>
                    : <div/>
            }
        </Container>
    );
}

export default App;
