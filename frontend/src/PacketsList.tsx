import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {Button, Col, Row, Table} from "react-bootstrap";

export function PacketsList() {
    const web3 = useWeb3React<Web3Provider>();

    // TODO: Make <tr>s a separate component
    return (
        <div>
            <h4>Your packets</h4>
            <Row>
                <Col xs={3}>
                    <Table striped hover>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Amount</th>
                            <th>Message</th>
                            <th/>
                            <th/>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>0</td>
                            <td>4200</td>
                            <td>What's up. Happy birthday!</td>
                            <td><Button variant="danger">Burn</Button></td>
                            <td><Button>Transfer</Button></td>
                        </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>

        </div>
    )
}