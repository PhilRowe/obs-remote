import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { useObsStore } from '../../components/obsStore';
import { useSettingsStore } from '../../components/settingsStore';
import { useEffect, useState, useRef } from 'react';
import classNames from "classnames";
import { sendCommand } from '../../lib/obs';
import throttle from 'lodash/throttle';

const Output = ({ children }) => {
    const obsStore = useObsStore();
    const settingsStore = useSettingsStore();
    const [mainScene, setMainScene] = useState(false);
    const [previewScene, setPreviewScene] = useState(false);
    const [studioMode, setStudioMode] = useState(false);
    const [previewScreenshot, setPreviewScreenshot] = useState(false);
    const [mainScreenshot, setMainScreenshot] = useState(false);
    const [sticky, setSticky] = useState(false);
    const [height, setHeight] = useState(false);
    let timeout = useRef(false);
    let mainSceneRef = useRef(false);
    let previewSceneRef = useRef(false);
    let studioModeRef = useRef(false);
    let livePreview = useRef(false);
    let elm = useRef(null);

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
        getScreenshot();
    }, [mainScene, previewScene, studioMode, settingsStore.livePreview]);

    useEffect(() => {
        let throttleScroll = throttle(handleScroll, 50);
        let throttleResize = throttle(handleResize, 100);

        window.addEventListener('scroll', throttleScroll);
        window.addEventListener('resize', throttleResize);

        handleScroll();
        handleResize();

        return () => {
            window.removeEventListener('scroll', () => throttleScroll);
            window.removeEventListener('resize', () => throttleResize);
        };
    }, []);

    const getScreenshot = async () => {
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

        if (studioModeRef.current && previewSceneRef.current) {
            let data = await sendCommand(obsStore.obs, 'TakeSourceScreenshot', { sourceName: previewSceneRef.current, embedPictureFormat: 'jpeg', width: 1920, height: 1080 });
            if (data && data.img) {
                setPreviewScreenshot(data.img);
            }
        } else {
            setPreviewScreenshot(false);
        }

        if (livePreview.current) {
            timeout.current = setTimeout(getScreenshot, 500);
        }
    };

    const handleScroll = () => {
        if (elm.current) {
            setSticky(elm.current.parentNode.getBoundingClientRect().top <= 0);
            handleResize();
        }
    };

    const handleResize = () => {
        if (elm.current) {
            setHeight(elm.current.offsetHeight);
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
                        <Image src={props.screenshot} fluid />
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
                    <div className="img-wrapper"></div>
                    <RenderTitle sceneName={props.sceneName} />
                </div>
            </Col>
        );
    }

    return (
        <>
            <div
                className={classNames({
                    'studioMode': studioMode,
                    'output-wrapper': true

                })}
                style={{ height: height }}
            >
                <div
                    className={classNames({
                        'output-holder': true,
                        'pt-4': true,
                        'sticky': sticky
                    })}
                    ref={elm}
                >
                    <Container>
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
                    </Container>
                </div>
            </div>
            {children}
        </>
    );
};

export default Output;