import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbtack } from '@fortawesome/free-solid-svg-icons'
import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import classNames from "classnames";
import { useObsStore } from '../../components/obsStore';
import { useSettingsStore, useDispatchSettingsStore } from '../../components/settingsStore';
import { useEffect, useState, useRef } from 'react';
import { handleSceneChange } from '../../lib/obs';
import pull from 'lodash/pull';

const PinnedScenes = ({ children }) => {
    const obsStore = useObsStore();
    const settingsStore = useSettingsStore();
    const settingsDispatch = useDispatchSettingsStore();
    const [mainScene, setMainScene] = useState(false);
    const [previewScene, setPreviewScene] = useState(false);
    const [pinnedScenes, setPinnedScenes] = useState([]);
    let mainSceneRef = useRef(false);
    let previewSceneRef = useRef(false);
    let studioModeRef = useRef(false);

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
        setPinnedScenes(settingsStore.pinnedScenes);
    }, [settingsStore.pinnedScenes]);

    useEffect(() => {
        if (!pinnedScenes || !pinnedScenes.length) {
            return;
        }
        if (!obsStore.scenes || !obsStore.scenes.length) {
            return;
        }

        // Lets check our pinned scenes are still valid :-)
        let available = obsStore.scenes.map(value => value.name);
        let found = pinnedScenes.filter(name => available.includes(name));
        if (found.length !== pinnedScenes.length) {
            settingsDispatch({
                pinnedScenes: found
            });
        }
    }, [obsStore.scenes]);

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
        let pins = [...pinnedScenes];
        pull(pins, name);
        settingsDispatch({
            pinnedScenes: pins
        });
    };

    if (!pinnedScenes || pinnedScenes.length === 0) {
        return (<></>);
    }

    return (
        <>
            <div className="scene-list-wrapper pt-2">
                {pinnedScenes.map((name, index) => (
                    <Card
                        key={name}
                        className={classNames({
                            'scene-item': true,
                            'mb-2': (index !== pinnedScenes.length - 1),
                            'main-scene': name === mainScene,
                            'preview-scene': name === previewScene,
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
                                            'is-pinned': true,
                                        })}
                                        onClick={ e => handlePinClick(e, name)}
                                    >
                                        <FontAwesomeIcon icon={faThumbtack} />
                                    </a>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))}
            </div>
            {children}
        </>
    );
};

export default PinnedScenes;