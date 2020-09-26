import Layout from "../components/layout";
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import { Sparklines, SparklinesBars, SparklinesLine } from 'react-sparklines';
import { useState, useEffect, useRef } from 'react';
import useObs from '../hooks/useObs';
import { sendCommand } from '../lib/obs';
import { useObsStore } from '../components/obsStore';
import camelcaseKeys from 'camelcase-keys';
import round from '@alvarocastro/round';

const Stats = () => {
    useObs();
    const obsStore = useObsStore();
    const [stats, setStats] = useState({});
    const [cpu, setCpu] = useState([]);
    const [memory, setMemory] = useState([]);
    let connected = useRef(false);
    let timeout = useRef(false);

    useEffect(() => {
        connected.current = obsStore.connected;
        if (obsStore.connected) {
            getStats();
        } else {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
        }

        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
        }
    }, [obsStore.connected]);

    useEffect(() => {
        if (!stats.cpuUsage) {
            return;
        }
        let newData = cpu.slice(-1 * 30);
        newData.push(stats.cpuUsage);
        setCpu(newData);
    }, [stats.cpuUsage]);

    useEffect(() => {
        if (!stats.memoryUsage) {
            return;
        }
        let newData = memory.slice(-1 * 30);
        newData.push(stats.memoryUsage);
        setMemory(newData);
    }, [stats.memoryUsage]);

    const getStats = async () => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
        let data = await sendCommand(obsStore.obs, 'GetStats');
        data = camelcaseKeys(data.stats);

        Object.keys(data).map(key => {
            data[key] = round(data[key]);
        });
        setStats(data);

        if (!connected.current) {
            return;
        }
        timeout.current = setTimeout(getStats, 1000);
    };

    return (
        <Layout title="Stats">
            <Container>
                <Row>
                    <Col sm={6} className="mt-3 mb-3">
                        <Card>
                            <Card.Header as="h5">CPU Usage</Card.Header>
                            <Card.Body>
                                <Sparklines data={cpu} limit={25}>
                                    <SparklinesBars style={{ fill: "#343a40", fillOpacity: ".25" }} />
                                    <SparklinesLine style={{ stroke: "#343a40", fill: "none" }} />
                                </Sparklines>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col sm={6} className="mt-3 mb-3">
                        <Card>
                            <Card.Header as="h5">Memory Usage</Card.Header>
                            <Card.Body>
                                <Sparklines data={memory} limit={25}>
                                    <SparklinesBars style={{ fill: "#343a40", fillOpacity: ".25" }} />
                                    <SparklinesLine style={{ stroke: "#343a40", fill: "none" }} />
                                </Sparklines>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Card>
                    <Card.Body>
                    <Table responsive striped hover className="mb-0">
                        <tbody>
                            <tr>
                                <td>CPU Usage</td>
                                <td>{stats.cpuUsage}%</td>
                            </tr>
                            <tr>
                                <td>Memory Usage</td>
                                <td>{stats.memoryUsage} MB</td>
                            </tr>
                            <tr>
                                <td>Free Disk Space</td>
                                <td>{stats.freeDiskSpace} MB</td>
                            </tr>
                            <tr>
                                <td>FPS</td>
                                <td>{stats.fps}</td>
                            </tr>
                            <tr>
                                <td>Average Frame render time</td>
                                <td>{stats.averageFrameTime} ms</td>
                            </tr>
                            <tr>
                                <td>Render Frames Missed (Rendering lag)</td>
                                <td>{stats.renderMissedFrames}/{stats.renderTotalFrames}</td>
                            </tr>
                            <tr>
                                <td>Output Frames Skipped (Encoding lag)</td>
                                <td>{stats.outputSkippedFrames}/{stats.outputTotalFrames}</td>
                            </tr>
                        </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Container>
        </Layout>
    )
}

export default Stats;