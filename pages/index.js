import Head from "../components/layout/head";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { useInput } from '../hooks/useInput';
import { useState, useEffect } from 'react';
import { useSettingsStore, useDispatchSettingsStore } from '../components/settingsStore';
import { useObsStore } from '../components/obsStore'
import useObs from '../hooks/useObs';

const Index = () => {
    useObs();
    const settingsStore = useSettingsStore();
    const settingsDispatch = useDispatchSettingsStore();
    const obsStore = useObsStore();
    const { value: host, setValue: setHost, bind: bindHost } = useInput('');
    const { value: port, setValue: setPort, bind: bindPort } = useInput('');
    const { value: password, setValue: setPassword, bind: bindPassword } = useInput('');
    const [secure, setSecure] = useState(false);

    const [message, setMessage] = useState({
        show: false,
        text: ""
    });

    useEffect(() => {
        setHost(settingsStore.host);
    }, [settingsStore.host]);

    useEffect(() => {
        setPort(settingsStore.port);
    }, [settingsStore.port]);

    useEffect(() => {
        setPassword(settingsStore.password);
    }, [settingsStore.password]);

    useEffect(() => {
        setSecure(settingsStore.secure);
    }, [settingsStore.secure]);

    useEffect(() => {
        if (message !== obsStore.message) {
            setMessage({
                show: obsStore.message ? true : false,
                text: obsStore.message
            });
        }
    }, [obsStore]);

    const handleSubmit = (evt) => {
        evt.preventDefault();

        setMessage({
            show: false,
            text: ""
        });

        let currentHost = host;
        let currentPort = port;
        if (!currentHost) {
            currentHost = 'localhost';
            if (!currentPort) {
                currentPort = '4444'
            }
        }

        settingsDispatch({
            host: currentHost,
            port: currentPort,
            password: password,
            secure: secure,
            autoConnect: true
        });
    }

    return (
        <>
            <Head title="Index" />

            <div className="form-signin my-4">
                <div className="signin-logo mb-4">
                    <img className="mx-auto d-block" src="/obs.svg" alt="OBS Remote" width="100" height="100" />
                </div>

                <Form onSubmit={handleSubmit}>
                    <Alert show={message.show} variant="danger">
                        {message.text}
                    </Alert>

                    <Form.Group controlId="formHost">
                        <Form.Label>Host</Form.Label>
                        <Form.Control type="text" placeholder="localhost (Current Computer)" {...bindHost} />
                    </Form.Group>

                    <Form.Group controlId="formPort">
                        <Form.Label>Port</Form.Label>
                        <Form.Control type="text" placeholder="4444" {...bindPort} />
                    </Form.Group>

                    <Form.Group controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" {...bindPassword} />
                        <Form.Text className="text-muted">
                            Password not required if not set in OBS
                        </Form.Text>
                    </Form.Group>

                    <Form.Group id="formSecure">
                        <Form.Check type="checkbox" label="Secure Connection?" checked={secure} onChange={ e => setSecure(e.target.checked) }  />
                    </Form.Group>

                    <Button variant="primary" type="submit" size="lg" block>
                        Connect
                    </Button>
                </Form>
            </div>
        </>
    )
};

export default Index;