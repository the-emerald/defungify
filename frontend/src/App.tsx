import React from 'react';
import {Web3ReactProvider} from '@web3-react/core';
import {Web3Provider} from "@ethersproject/providers";
import {Connector} from "./Connector";
import {Col, Container, Row} from "react-bootstrap";
import {Header} from "./Header";

function getLibrary(provider: any): Web3Provider {
    const lib = new Web3Provider(provider);
    lib.pollingInterval = 12000;
    return lib;
}

function App() {
    return (
        <Container fluid className="mt-2">
            <Web3ReactProvider getLibrary={getLibrary}>
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
                <Row className="my-2">
                    <Col>
                        <p>Hello, world!</p>
                    </Col>
                </Row>
            </Web3ReactProvider>
        </Container>

    );
}

export default App;
