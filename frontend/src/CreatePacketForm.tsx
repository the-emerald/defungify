import {Button, Col, Form} from "react-bootstrap";
import {SyntheticEvent} from "react";

export function CreatePacketForm() {

    const createPacket = (event: SyntheticEvent) => {
        event.preventDefault();
        alert("Create packet.")
    }
    return (
        <div>
            <h4>Create a new packet</h4>
            <Form>
                <Form.Row className="align-items-center">
                    <Col xs="auto">
                        <Form.Group controlId="packetAmount">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control type="number" placeholder="0"/>
                        </Form.Group>
                    </Col>
                </Form.Row>
                <Form.Row className="align-items-center">
                    <Col xs={2}>
                        <Form.Group controlId="packetMessage">
                            <Form.Label>Message</Form.Label>
                            <Form.Control as="textarea"/>
                        </Form.Group>
                    </Col>
                </Form.Row>
                <Button onClick={createPacket}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}