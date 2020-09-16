import { useObsStore } from '../../components/obsStore';
import { useSettingsStore } from '../../components/settingsStore';
import { useEffect, useState, useRef } from 'react';
import Card from 'react-bootstrap/Card';
import classNames from "classnames";
import { processScenes } from '../../lib/scenes';
import { setScene, setPreview } from '../../lib/obs';

const Scenes = ({ children }) => {
    const obsStore = useObsStore();
    const settingsStore = useSettingsStore();
    const [scenesData, setScenesData] = useState([]);
    const [currentState, setCurrentState] = useState({
        mainScene: false,
        previewScene: false
    });
    let studioMode = useRef(false);
    let initialised = useRef(false);

    useEffect(() => {
        if (!obsStore.connected) {
            initialised.current = false;
            return;
        }

        // Only want to setup events and get data once...
        if (initialised.current) {
            return;
        }

        initialised.current = true;
        obsStore.obs.send('GetStudioModeStatus')
            // Studio mode data
            .then(data => {
                if (data && data.studioMode) {
                    studioMode.current = data.studioMode;
                }
                return obsStore.obs.send('GetSceneList');
            })
            // Scene list data
            .then(data => {
                setScenesData(processScenes(data.scenes, settingsStore.hideAfter));
                setCurrentState(prevState => ({
                    ...prevState,
                    mainScene: data.currentScene
                }));

                if (studioMode.current) {
                    return obsStore.obs.send('GetPreviewScene');
                }
                return false;
            })
            // Preview scene data
            .then(data => {
                setCurrentState(prevState => ({
                    ...prevState,
                    previewScene: data.name
                }));
            })
            .catch(_ => {
                // studio mode may be disabled which could trigger this
            });

        // When a scene list changes we need to reload
        // Note: doesn't trigger for reorders???
        obsStore.obs.on('ScenesChanged', () => {
            obsStore.obs.send('GetSceneList')
                .then(data => {
                    setScenesData(processScenes(data.scenes, settingsStore.hideAfter));
                    setCurrentState(prevState => ({
                        ...prevState,
                        mainScene: data.currentState
                    }));
                });
        });

        // The "main scene has been changed"
        obsStore.obs.on('SwitchScenes', data => {
            setCurrentState(prevState => ({
                ...prevState,
                mainScene: data.sceneName
            }));
        });

        // The preview scene has been changed
        obsStore.obs.on('PreviewSceneChanged', data => {
            setCurrentState(prevState => ({
                ...prevState,
                previewScene: data.sceneName
            }));
        });

        // Studio mode has been toggled,
        // We use this to determine if we need to
        // an "active" preview scene
        obsStore.obs.on('StudioModeSwitched', data => {
            studioMode.current = data.studioMode;
            if (!data.studioMode) {
                setCurrentState(prevState => ({
                    ...prevState,
                    previewScene: false
                }));
            }
        });
    }, [obsStore.connected]);

    const handleClick = (e, name) => {
        e.preventDefault();

        // is it already the mainScene?
        if (name === currentState.mainScene) {
            return;
        }
        // if its the preview scene, set it as the mainScene
        if (name === currentState.previewScene) {
            setScene(obsStore.obs, name);
        }

        if (studioMode.current) {
            // set Preview
            setPreview(obsStore.obs, name);
        } else {
            setScene(obsStore.obs, name);
        }
    };

    return (
        <>
            <div className="scene-list-wrapper mt-4">
                {scenesData.map(({ name }) => (
                    <Card
                        key={name}
                        className={classNames({
                            'scene-item': true,
                            'mb-2': true,
                            'main-scene': name === currentState.mainScene,
                            'preview-scene': name === currentState.previewScene
                        })}
                        as="a"
                        onClick={ e => handleClick(e, name)}
                    >
                        <Card.Body>{name}</Card.Body>
                    </Card>
                ))}
            </div>
            {children}
        </>
    );
};

export default Scenes;