import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import classNames from "classnames";
import { useObsStore } from '../../components/obsStore';
import { useSettingsStore } from '../../components/settingsStore';
import { useEffect, useState, useRef } from 'react';
import { processScenes } from '../../lib/scenes';
import { setScene, setPreview } from '../../lib/obs';

const Scenes = ({ children }) => {
    const obsStore = useObsStore();
    const settingsStore = useSettingsStore();
    const [mainScene, setMainScene] = useState(false);
    const [previewScene, setPreviewScene] = useState(false);
    const [studioMode, setStudioMode] = useState(false);
    const [scenes, setScenes] = useState([]);
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
        setStudioMode(obsStore.studioMode);
        studioModeRef.current = obsStore.studioMode;
    }, [obsStore.studioMode]);

    useEffect(() => {
        setScenes(processScenes(obsStore.scenes, settingsStore.hideAfter));
    }, [obsStore.scenes]);

    const handleClick = (e, name) => {
        e.preventDefault();

        // is it already the mainScene?
        if (name === mainSceneRef.current) {
            return;
        }
        // if its the preview scene, set it as the mainScene
        if (name === previewSceneRef.current) {
            setScene(obsStore.obs, name);
            return;
        }

        if (studioModeRef.current) {
            // set Preview
            setPreview(obsStore.obs, name);
        } else {
            setScene(obsStore.obs, name);
        }
    };

    return (
        <Container>
            <div className="scene-list-wrapper pt-2 pb-4">
                {scenes.map(({ name }) => (
                    <Card
                        key={name}
                        className={classNames({
                            'scene-item': true,
                            'mb-2': true,
                            'main-scene': name === mainScene,
                            'preview-scene': name === previewScene
                        })}
                        as="a"
                        onClick={ e => handleClick(e, name)}
                    >
                        <Card.Body>{name}</Card.Body>
                    </Card>
                ))}
            </div>
            {children}
        </Container>
    );
};

export default Scenes;