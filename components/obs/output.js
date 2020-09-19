import { useObsStore } from '../../components/obsStore';
import { useSettingsStore } from '../../components/settingsStore';
import { useEffect, useState, useRef } from 'react';
import classNames from "classnames";
import { sendCommand } from '../../lib/obs';

const Output = ({ children }) => {
    const obsStore = useObsStore();
    const settingsStore = useSettingsStore();
    const [mainScene, setMainScene] = useState(false);
    const [previewScene, setPreviewScene] = useState(false);
    const [studioMode, setStudioMode] = useState(false);
    const [previewScreenshot, setPreviewScreenshot] = useState(false);
    const [mainScreenshot, setMainScreenshot] = useState(false);
    let timeout = useRef(false);
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
        getScreenshot();
    }, [mainScene, previewScene, studioMode]);

    const getScreenshot = async () => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }

        if (!obsStore.connected || !mainSceneRef.current) {
            return;
        }

        if (mainSceneRef.current) {
            let data = await sendCommand(obsStore.obs, 'TakeSourceScreenshot', { sourceName: mainSceneRef.current, embedPictureFormat: 'jpeg', width: 960, height: 540 });
            if (data && data.img) {
                setMainScreenshot(data.img);
            }
        }

        if (studioModeRef.current && previewSceneRef.current) {
            let data = await sendCommand(obsStore.obs, 'TakeSourceScreenshot', { sourceName: previewSceneRef.current, embedPictureFormat: 'jpeg', width: 960, height: 540 });
            if (data && data.img) {
                setPreviewScreenshot(data.img);
            }
        } else {
            setPreviewScreenshot(false);
        }
        timeout.current = setTimeout(getScreenshot, 500);
    };

    return (
        <>
            {previewScene}
            {mainScene}

            <img src={previewScreenshot} />
            <img src={mainScreenshot} />

            {children}
        </>
    );
};

export default Output;