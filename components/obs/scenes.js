import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbtack } from '@fortawesome/free-solid-svg-icons'
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import classNames from "classnames";
import { useObsStore } from '../../components/obsStore';
import { useSettingsStore, useDispatchSettingsStore } from '../../components/settingsStore';
import { useEffect, useState, useRef } from 'react';
import { processScenes } from '../../lib/scenes';
import { handleSceneChange } from '../../lib/obs';
import pull from 'lodash/pull';

const Scenes = ({ children }) => {
    const obsStore = useObsStore();
    const settingsStore = useSettingsStore();
    const settingsDispatch = useDispatchSettingsStore();
    const [mainScene, setMainScene] = useState(false);
    const [previewScene, setPreviewScene] = useState(false);
    const [scenes, setScenes] = useState([]);
    const [pinnedScenes, setPinnedScenes] = useState([]);
    let mainSceneRef = useRef(false);
    let previewSceneRef = useRef(false);
    let studioModeRef = useRef(false);
    let pinnedScenesRef = useRef([]);

    useEffect(() => {
        setMainScene(obsStore.mainScene);
        mainSceneRef.current = obsStore.mainScene;
    }, [obsStore.mainScene]);

    useEffect(() => {
        setPreviewScene(obsStore.previewScene);
        previewSceneRef.current = obsStore.previewScene;
    }, [obsStore.previewScene]);

    useEffect(() => {
        studioModeRef.current = obsStore.studioMode;
    }, [obsStore.studioMode]);

    useEffect(() => {
        setScenes(processScenes(obsStore.scenes, settingsStore.hideAfter));
    }, [obsStore.scenes]);

    useEffect(() => {
        setPinnedScenes(settingsStore.pinnedScenes);
        pinnedScenesRef.current = settingsStore.pinnedScenes;
    }, [settingsStore.pinnedScenes]);

    const handleSceneClick = (e, name) => {
        e.preventDefault();

        return handleSceneChange(
            obsStore.obs,
            name,
            previewSceneRef.current,
            mainSceneRef.current,
            studioModeRef.current
        );
    };

    const handlePinClick = (e, name) => {
        e.preventDefault();
        if (pinnedScenes.includes(name)) {
            // remove the pin
            let pins = [...pinnedScenes];
            pull(pins, name);
            settingsDispatch({
                pinnedScenes: pins
            });
            return;
        }

        // Add the new Pin
        let pins = [...pinnedScenes, name];
        settingsDispatch({
            pinnedScenes: pins
        });
    };

    return (
        <Container>
            <div className="scene-list-wrapper pb-4">
                {scenes.map(({ name }) => (
                    <Card
                        key={name}
                        className={classNames({
                            'scene-item': true,
                            'mb-2': true,
                            'main-scene': name === mainScene,
                            'preview-scene': name === previewScene
                        })}
                    >
                        <Card.Body>
                            <Row>
                                <Col>
                                    <a className="scene-name" onClick={ e => handleSceneClick(e, name)}>
                                        {name}
                                    </a>
                                </Col>
                                <Col className="pin-col">
                                    <a
                                        className={classNames({
                                            'pin': true,
                                            'is-pinned': pinnedScenes.includes(name)
                                        })}
                                        onClick={ e => handlePinClick(e, name)}
                                    >
                                        <FontAwesomeIcon icon={faThumbtack} size="md" />
                                    </a>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))}
            </div>
            {children}
        </Container>
    );
};

export default Scenes;