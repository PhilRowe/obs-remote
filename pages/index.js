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
    const { value: host, setValue: setHost, bind: bindHost, reset: resetHost } = useInput('');
    const { value: port, setValue: setPort, bind: bindPort, reset: resetPort } = useInput('');
    const { value: password, setValue: setPassword, bind: bindPassword, reset: resetPassword } = useInput('');
    const [message, setMessage] = useState({
        show: false,
        text: ""
    });

    useEffect(() => {
        if (host !== settingsStore.host) {
            setHost(settingsStore.host);
        }
        if (host !== settingsStore.port) {
            setPort(settingsStore.port);
        }
        if (host !== settingsStore.password) {
            setPassword(settingsStore.password);
        }
    }, [settingsStore]);

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

        settingsDispatch({
            type: 'all',
            value: {
                host: host || 'localhost',
                port: port || '4444',
                password: password,
                autoConnect: true
            }
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

                    <Form.Group controlId="formHost">
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

                    <Button variant="primary" type="submit" size="lg" block>
                        Connect
                    </Button>
                </Form>
            </div>
        </>
    )
};

export default Index;