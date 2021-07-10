import React from 'react';
import {useWeb3React} from '@web3-react/core';
import {Web3Provider} from "@ethersproject/providers";
import {Connector} from "./Connector";
import {Col, Container, Row} from "react-bootstrap";
import {Header} from "./Header";
import {ContractInteraction} from "./ContractInteraction";


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
                <Row className="my-2 mt-3">
                    <Col>
                        {
                            web3.active ? <ContractInteraction/>: <div/>
                        }
                    </Col>
                </Row>
        </Container>
    );
}

export default App;
