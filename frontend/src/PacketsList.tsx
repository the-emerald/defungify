import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {Col, Row, Table} from "react-bootstrap";
import {Defungify} from "./typechain";
import {useEffect, useState} from "react";
import {hexZeroPad, id} from "ethers/lib/utils";
import {EventFilter} from "ethers/lib/ethers";
import {BigNumber} from "ethers";
import {PacketRow} from "./PacketRow";

export interface PacketsListProps {
    defungify: Defungify
}

export interface Packet {
    id: number,
    amount: BigNumber,
    message: string
}

export function PacketsList(props: PacketsListProps) {
    const web3 = useWeb3React<Web3Provider>();
    const [packets, setPackets] = useState<Array<Packet>>([]);

    useEffect(() => {
        const enumeratePackets = async () => {
            const numberOwned = (await props.defungify.balanceOf(web3.account!)).toNumber();
            let ps = [];
            for (let i = 0; i < numberOwned; i++) {
                const id = await props.defungify.tokenOfOwnerByIndex(web3.account!, i);
                let packet: Packet = {
                    id: id.toNumber(),
                    amount: await props.defungify.amountInside(id),
                    message: await props.defungify.tokenURI(id),
                }
                ps.push(packet)
            }
            return ps;
        };

        const filterTransferOut: EventFilter = {
            address: props.defungify.address,
            topics: [
                id("Transfer(address,address,uint256)"),
                hexZeroPad(web3.account!, 32)
            ]
        };

        const filterTransferIn: EventFilter = {
            address: props.defungify.address,
            topics: [
                id("Transfer(address,address,uint256)"),
                // @ts-ignore
                null,
                hexZeroPad(web3.account!, 32)
            ]
        };

        props.defungify.on(filterTransferIn, () => {
            enumeratePackets().then(r => {
                setPackets(r);
            })
        });

        props.defungify.on(filterTransferOut, () => {
            enumeratePackets().then(r => {
                setPackets(r);
            })
        })

        enumeratePackets().then(r => {
            setPackets(r);
        });

    }, [props.defungify, web3.account])

    // TODO: Make <tr>s a separate component
    return (
        <div>
            <h4>Your packets</h4>
            <p><b>Burn</b> packets to release their contents into your wallet.</p>
            <p><b>Transfer</b> packets to other people.</p>

            <Row>
                <Col xs={8}>
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
                        {
                            packets.map((p) => <PacketRow key={p.id} packet={p} defungify={props.defungify}/>)
                        }
                        </tbody>
                    </Table>
                </Col>
            </Row>

        </div>
    )
}