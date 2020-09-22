import Layout from "../components/layout";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { useInput } from '../hooks/useInput';
import { useState, useEffect } from 'react';
import { useSettingsStore, useDispatchSettingsStore } from '../components/settingsStore';

const Settings = () => {
    const settingsStore = useSettingsStore();
    const settingsDispatch = useDispatchSettingsStore();
    const { value: hideAfter, setValue: setHideAfter, bind: bindHideAfter } = useInput('');
    const [livePreview, setLivePreview] = useState(true);
    const { value: refreshRate, setValue: setRefreshRate, bind: bindRefreshRate } = useInput('');
    const { value: pinnedScenes, setValue: setPinnedScenes, bind: bindPinnedScenes } = useInput('');

    useEffect(() => {
        setHideAfter(settingsStore.hideAfter);
    }, [settingsStore.hideAfter]);

    useEffect(() => {
        setLivePreview(settingsStore.livePreview);
    }, [settingsStore.livePreview]);

    useEffect(() => {
        setRefreshRate(settingsStore.refreshRate);
    }, [settingsStore.refreshRate]);

    useEffect(() => {
        setPinnedScenes(JSON.stringify(settingsStore.pinnedScenes, null, 2));
    }, [settingsStore.pinnedScenes]);

    const handleSubmit = (evt) => {
        evt.preventDefault();
        settingsDispatch({
            hideAfter: hideAfter,
            livePreview: livePreview,
            refreshRate: refreshRate,
            pinnedScenes: JSON.parse(pinnedScenes)
        });
    }

    return (
        <Layout title="Settings">
            <Container>
                <Card className="my-4 form-settings">
                    <Card.Header as="h4">Main Settings</Card.Header>
                    <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formHideAfter">
                            <Form.Label>Hide After</Form.Label>
                            <Form.Control type="text" {...bindHideAfter} />
                            <Form.Text className="text-muted">
                                Hide all scenes in the scenes list after this scene has been found
                            </Form.Text>
                        </Form.Group>

                        <Form.Group id="formLivePreview">
                            <Form.Check id="livePreviewSwitch" label="Live Preview?" type="switch" checked={livePreview} onChange={ e => setLivePreview(e.target.checked) }  />
                            <Form.Text className="text-muted">
                                Show a live preview of the "program" scene
                            </Form.Text>
                        </Form.Group>

                        <Form.Group id="formRefreshRate">
                            <Form.Label>Refresh Rate</Form.Label>
                            <Form.Control as="select" {...bindRefreshRate}>
                                <option value="1000">Slow</option>
                                <option value="500">Medium</option>
                                <option value="200">Fast</option>
                                <option value="100">Super Fast</option>
                            </Form.Control>
                            <Form.Text className="text-muted">
                                Higher refresh rate could put higher load on OBS
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formPinnedScenes">
                            <Form.Label>Pinned Scenes</Form.Label>
                            <Form.Control as="textarea" rows="3" {...bindPinnedScenes} />
                            <Form.Text className="text-muted">
                                JSON object containing the current list of pinned scenes
                            </Form.Text>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Save Settings
                        </Button>
                    </Form>
                    </Card.Body>
                </Card>
            </Container>
        </Layout>
    )
}

export default Settings;