import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {Col, Row, Table} from "react-bootstrap";
import {Defungify, Defungify__factory, IERC20Metadata__factory} from "./typechain";
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
    decimals: number
    message: string
}

export function PacketsList(props: PacketsListProps) {
    const web3 = useWeb3React<Web3Provider>();
    const [packets, setPackets] = useState<Array<Packet>>([]);

    // Update packet list on send and receive
    useEffect(() => {
        const defungify_ = Defungify__factory.connect(props.defungify.address, web3.library!);

        const enumeratePackets = async () => {
            console.log("Enumerating packets");
            const decimals = await IERC20Metadata__factory.connect(await defungify_.token(), web3.library!)
                .decimals();
            const numberOwned = (await defungify_.balanceOf(web3.account!)).toNumber();
            let ps = [];
            for (let i = 0; i < numberOwned; i++) {
                const id = await defungify_.tokenOfOwnerByIndex(web3.account!, i);
                let packet: Packet = {
                    decimals: decimals,
                    id: id.toNumber(),
                    amount: await defungify_.amountInside(id),
                    message: await defungify_.tokenURI(id)
                }
                ps.push(packet)
            }
            setPackets(ps);
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

        console.log("Registering packets listener");
        defungify_.on(filterTransferIn, enumeratePackets);
        defungify_.on(filterTransferOut, enumeratePackets);

        enumeratePackets().then(() => {
            console.log("Enumerating ONCE")
        });

        return () => {
            console.log("Removing packets listener");
            defungify_.removeAllListeners();
        }

    }, [props.defungify.address, web3.account, web3.library])

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
                            packets.length !== 0 ?
                                packets.map((p) => <PacketRow
                                    key={p.id}
                                    packet={p}
                                    defungify={props.defungify}/>
                                )
                                :
                                <tr>
                                    <td>
                                        You have no packets yet! Go make some.
                                    </td>
                                    <td/>
                                    <td/>
                                    <td/>
                                    <td/>
                                </tr>
                        }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </div>
    )
}