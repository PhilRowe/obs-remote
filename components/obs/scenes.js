import { useObsStore } from '../../components/obsStore';
import { useSettingsStore } from '../../components/settingsStore';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import classNames from "classnames";
import { processScenes } from '../../lib/scenes';
import { setScene, setPreview } from '../../lib/obs';

const Scenes = ({ children }) => {
    const obsStore = useObsStore();
    const settingsStore = useSettingsStore();
    const [initialised, setInitialised] = useState(false);
    const [scenesData, setScenesData] = useState([]);
    const [currentState, setCurrentState] = useState({
        mainScene: false,
        previewScene: false,
        studioMode: false
    });

    useEffect(() => {
        if (!obsStore.connected) {
            setInitialised(false);
            return;
        }

        if (initialised) {
            return;
        }

        obsStore.obs.send('GetStudioModeStatus')
            .then(data => {
                if (data && data.studioMode) {
                    setCurrentState(prevState => ({
                        ...prevState,
                        studioMode: data.studioMode
                    }));
                }
                return obsStore.obs.send('GetSceneList');
            })
            .then(data => {
                setScenesData(processScenes(data.scenes, settingsStore.hideAfter));
                setCurrentState(prevState => ({
                    ...prevState,
                    mainScene: data.currentScene
                }));

                if (currentState.studioMode) {
                    return obsStore.obs.send('GetPreviewScene');
                }
                return false;
            })
            .then(data => {
                setCurrentState(prevState => ({
                    ...prevState,
                    previewScene: data.name
                }));
            })
            .catch(_ => {
                // studio mode may be disabled which could trigger this
            });

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

        obsStore.obs.on('SwitchScenes', data => {
            setCurrentState(prevState => ({
                ...prevState,
                mainScene: data.sceneName
            }));
        });

        obsStore.obs.on('PreviewSceneChanged', data => {
            setCurrentState(prevState => ({
                ...prevState,
                previewScene: data.sceneName
            }));
        });

        obsStore.obs.on('StudioModeSwitched', data => {
            setCurrentState(prevState => ({
                ...prevState,
                studioMode: data.studioMode
            }));
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

        if (currentState.studioMode) {
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