import { useObsStore } from '../../components/obsStore';
import { useSettingsStore } from '../../components/settingsStore';
import { useEffect, useState, useRef } from 'react';
import classNames from "classnames";
import { sendCommand } from '../../lib/obs';

const Output = ({ children }) => {
    const obsStore = useObsStore();
    const settingsStore = useSettingsStore();
    const [currentState, setCurrentState] = useState({
        studioMode: false,
        mainScene: false,
        previewScene: false,
        mainScreenshot: false,
        previewScreenshot: false
    });
    let state = useRef({
        initialised: false,
        studioMode: false,
        mainScene: false,
        previewScene: false
    });

    useEffect(() => {
        if (!obsStore.connected) {
            state.current.initialised = false;
            return;
        }

        // Only want to setup events and get data once...
        if (state.current.initialised) {
            return;
        }

        state.current.initialised = true;

        obsStore.obs.send('GetStudioModeStatus')
            // Studio mode data
            .then(data => {
                if (data && data.studioMode) {
                    state.current.studioMode = data.studioMode;
                    setCurrentState(prevState => ({
                        ...prevState,
                        studioMode: data.studioMode
                    }));
                }
                return obsStore.obs.send('GetCurrentScene');
            })
            // Scene list data
            .then(data => {
                state.current.mainScene = data.name;
                setCurrentState(prevState => ({
                    ...prevState,
                    mainScene: data.name
                }));

                if (state.current.studioMode) {
                    return obsStore.obs.send('GetPreviewScene');
                }
                return false;
            })
            // Preview scene data
            .then(data => {
                state.current.previewScene = data.name;
                setCurrentState(prevState => ({
                    ...prevState,
                    previewScene: data.name
                }));

                console.log(data);
                console.log(currentState);

                getScreenshots();
            })
            .catch(_ => {
                // studio mode may be disabled which could trigger this
            });

        // The "main scene has been changed"
        obsStore.obs.on('SwitchScenes', data => {
            state.current.mainScene = data.sceneName;
            setCurrentState(prevState => ({
                ...prevState,
                mainScene: data.sceneName
            }));
        });

        // The preview scene has been changed
        obsStore.obs.on('PreviewSceneChanged', data => {
            state.current.previewScene = data.sceneName;
            setCurrentState(prevState => ({
                ...prevState,
                previewScene: data.sceneName
            }));
        });

        // Studio mode has been toggled
        obsStore.obs.on('StudioModeSwitched', data => {
            state.current.studioMode = data.studioMode;
            if (!data.studioMode) {
                setCurrentState(prevState => ({
                    ...prevState,
                    studioMode: data.studioMode,
                    previewScene: false
                }));
            }
        });
    }, [obsStore.connected]);

    const getScreenshots = async () => {
        if (!obsStore.connected) {
            return;
        }

        if (state.current.mainScene) {
            let data = await sendCommand(obsStore.obs, 'TakeSourceScreenshot', { sourceName: state.current.mainScene, embedPictureFormat: 'jpeg', width: 960, height: 540 });
            if (data && data.img) {
                setCurrentState(prevState => ({
                    ...prevState,
                    mainScreenshot: data.img
                }));
            }
        }
        if (state.current.studioMode && state.current.previewScene) {
            let data = await sendCommand(obsStore.obs, 'TakeSourceScreenshot', { sourceName: state.current.previewScene, embedPictureFormat: 'jpeg', width: 960, height: 540 });
            if (data && data.img) {
                setCurrentState(prevState => ({
                    ...prevState,
                    previewScreenshot: data.img
                }));
            }
        }
        setTimeout(getScreenshots, 500);
    };

    return (
        <>
            {currentState.previewScene}
            {currentState.mainScene}

            <img src={currentState.previewScreenshot} />
            <img src={currentState.mainScreenshot} />

            {children}
        </>
    );
};

export default Output;