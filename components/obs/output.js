import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
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
    let livePreview = useRef(false);

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
        livePreview.current = settingsStore.livePreview;
    }, [settingsStore.livePreview]);

    useEffect(() => {
        getScreenshotMain();
        getScreenshotPreview();
    }, [mainScene, previewScene, studioMode, settingsStore.livePreview]);

    const getScreenshotMain = async () => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }

        if (!obsStore.connected || !mainSceneRef.current) {
            return;
        }

        if (mainSceneRef.current) {
            let data = await sendCommand(obsStore.obs, 'TakeSourceScreenshot', { sourceName: mainSceneRef.current, embedPictureFormat: 'jpeg', width: 1920, height: 1080 });
            if (data && data.img) {
                setMainScreenshot(data.img);
            }
        }

        if (livePreview.current) {
            timeout.current = setTimeout(getScreenshotMain, 500);
        }
    };

    const getScreenshotPreview = async () => {
        if (!obsStore.connected || !mainSceneRef.current) {
            return;
        }

        if (studioModeRef.current && previewSceneRef.current) {
            let data = await sendCommand(obsStore.obs, 'TakeSourceScreenshot', { sourceName: previewSceneRef.current, embedPictureFormat: 'jpeg', width: 1920, height: 1080 });
            if (data && data.img) {
                setPreviewScreenshot(data.img);
            }
        } else {
            setPreviewScreenshot(false);
        }
    };

    function RenderTitle(props) {
        return (
            <div className="scene-title">
                <span>{props.sceneName}</span>
            </div>
        );
    }

    function RenderScene(props) {
        return (
            <Col sm={6} className={props.sceneClass}>
                <div className="output-scene">
                    <div className="img-wrapper">
                        <div className="img-holder">
                            <Image src={props.screenshot} fluid />
                        </div>
                    </div>
                    <RenderTitle sceneName={props.sceneName} />
                </div>
            </Col>
        );
    }

    function RenderPlaceholderScene(props) {
        return (
            <Col sm={6} className={props.sceneClass}>
                <div className="output-scene">
                    <div className="img-wrapper">
                        <div className="img-holder"></div>
                    </div>
                    <RenderTitle sceneName={props.sceneName} />
                </div>
            </Col>
        );
    }

    return (
        <>
            <div
                className={classNames({
                    'output-holder': true,
                    'studioMode': studioMode,
                })}
            >
                <Row>
                    {previewScreenshot
                        ? <RenderScene sceneClass="preview" sceneName={previewScene + ' [Preview]'} screenshot={previewScreenshot} />
                        : <RenderPlaceholderScene sceneClass="preview" sceneName="Preview" />
                    }
                    {mainScreenshot
                        ? <RenderScene sceneClass="main" sceneName={mainScene + ' [Program]'} screenshot={mainScreenshot} />
                        : <RenderPlaceholderScene sceneClass="main" sceneName="Preview" />
                    }
                </Row>
            </div>
            {children}
        </>
    );
};

export default Output;