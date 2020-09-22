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
    const [hiddenScene, setHiddenScene] = useState('preview');
    let timeout = useRef(false);
    let mainSceneRef = useRef(false);
    let previewSceneRef = useRef(false);
    let studioModeRef = useRef(false);
    let livePreview = useRef(false);
    let refreshRate = useRef(false);
    let connected = useRef(false);

    useEffect(() => {
        setMainScene(obsStore.mainScene);
        mainSceneRef.current = obsStore.mainScene;
    }, [obsStore.mainScene]);

    useEffect(() => {
        connected.current = obsStore.connected;
    }, [obsStore.connected]);

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
        refreshRate.current = settingsStore.refreshRate;
    }, [settingsStore.refreshRate]);

    useEffect(() => {
        getScreenshotMain();
        getScreenshotPreview();
    }, [
        mainScene,
        previewScene,
        studioMode,
        settingsStore.livePreview,
        settingsStore.refreshRate
    ]);

    const getScreenshotMain = async () => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }

        if (!connected.current || !mainSceneRef.current) {
            return;
        }

        if (mainSceneRef.current) {
            let data = await sendCommand(obsStore.obs, 'TakeSourceScreenshot', { sourceName: mainSceneRef.current, embedPictureFormat: 'jpeg', width: 1920, height: 1080 });
            if (data && data.img) {
                setMainScreenshot(data.img);
            }
        }

        if (livePreview.current) {
            timeout.current = setTimeout(getScreenshotMain, refreshRate.current);
        }
    };

    const getScreenshotPreview = async () => {
        if (!connected.current || !mainSceneRef.current) {
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
            <div className="img-wrapper">
                <div className="img-holder">
                    <Image src={props.screenshot} fluid />
                </div>
            </div>
        );
    }

    function RenderPlaceholderScene(props) {
        return (
            <div className="img-wrapper">
                <div className="img-holder"></div>
            </div>
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
                    <Col
                        md={6}
                        className={classNames({
                            'output-scene': true,
                            'preview': true,
                            'hidden': hiddenScene === 'preview'
                        })}
                    >
                        {previewScreenshot
                            ? <RenderScene screenshot={previewScreenshot} />
                            : <RenderPlaceholderScene />
                        }
                    </Col>
                    <Col
                        md={6}
                        className={classNames({
                            'output-scene': true,
                            'main': true,
                            'hidden': hiddenScene === 'main'
                        })}
                    >
                        {mainScreenshot
                            ? <RenderScene screenshot={mainScreenshot} />
                            : <RenderPlaceholderScene />
                        }
                    </Col>
                </Row>
                <Row>
                    <Col
                        md={6} className="scene-title-wrapper preview" onClick={ e => setHiddenScene('main') }>
                        {previewScreenshot
                            ? <RenderTitle sceneName={previewScene + ' [Preview]'} />
                            : <RenderTitle sceneName="Preview" />
                        }
                    </Col>
                    <Col md={6} className="scene-title-wrapper main" onClick={ e => setHiddenScene('preview') }>
                        {previewScreenshot
                            ? <RenderTitle sceneName={mainScene + ' [Program]'} />
                            : <RenderTitle sceneName="Program" />
                        }
                    </Col>
                </Row>
            </div>
            {children}
        </>
    );
};

export default Output;