import React from 'react';
import {useWeb3React} from '@web3-react/core';
import {Web3Provider} from "@ethersproject/providers";
import {Connector} from "./Connector";
import {Col, Container, Row} from "react-bootstrap";
import {Header} from "./Header";
import {PacketDeploy} from "./PacketDeploy";
import {PacketsList} from "./PacketsList";

const PLACEHOLDER_ERC20 = "0xd099F2FD6df4f649B2cD9A80EfCA8d496D9c3825";

function App() {
    const web3 = useWeb3React<Web3Provider>();

    return (
        <Container fluid className="mt-2">
            <Row className="my-2">
                <Col>
                    <Header/>
                </Col>
            </Row>
            <Row className="my-2">
                <Col>
                    <Connector/>
                </Col>
            </Row>

            {
                web3.active ?
                    <Row className="my-2">
                        <Col>
                            <p>Enter ERC-20 address here</p>
                        </Col>
                    </Row>
                    : <div/>
            }
            {
                web3.active ?
                    <Row className="my-2">
                        <Col>
                            <PacketDeploy address={PLACEHOLDER_ERC20}/>
                        </Col>
                    </Row>
                    : <div/>
            }

            {
                web3.active ?
                    <Row className="my-2">
                        <Col>
                            <PacketsList/>
                        </Col>
                    </Row>
                    : <div/>
            }

        </Container>
    );
}

export default App;
