import { useEffect, useState, useRef } from 'react';
import { useObsStore, useDispatchObsStore } from '../../components/obsStore';
import { transitionScene } from '../../lib/obs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faSyncAlt } from '@fortawesome/free-solid-svg-icons'

const Scenes = ({ children }) => {
    const obsStore = useObsStore();
    const obsDispatch = useDispatchObsStore();
    const [studioMode, setStudioMode] = useState(false);
    let studioModeRef = useRef(false);

    useEffect(() => {
        setStudioMode(obsStore.studioMode);
        studioModeRef.current = obsStore.studioMode;
    }, [obsStore.studioMode]);

    const handleTransitionClick = (e) => {
        e.preventDefault();
        transitionScene(obsStore.obs);
    };

    const handleRefreshClick = (e) => {
        e.preventDefault();
        if (!obsStore.connected) {
            return;
        }
        obsStore.obs.send('GetSceneList')
            .then(data => {
                obsDispatch({
                    mainScene: data.currentScene,
                    scenes: data.scenes
                });
            });
    };

    return (
        <>
            <div className="dock">
                <div className="dock-inner">
                    {studioMode &&
                        <div className="transition">
                            <a onClick={handleTransitionClick}>
                                <FontAwesomeIcon icon={faPlay} size="sm" />
                            </a>
                        </div>
                    }

                    <div className="refresh">
                        <a onClick={handleRefreshClick}>
                            <FontAwesomeIcon icon={faSyncAlt} size="sm" />
                        </a>
                    </div>
                </div>
            </div>
            {children}
        </>
    );
};

export default Scenes;