import { useEffect, useState, useRef } from 'react';
import { useObsStore } from '../../components/obsStore';
import { transitionScene } from '../../lib/obs';

const Scenes = ({ children }) => {
    const obsStore = useObsStore();
    const [studioMode, setStudioMode] = useState(false);
    let studioModeRef = useRef(false);

    useEffect(() => {
        setStudioMode(obsStore.studioMode);
        studioModeRef.current = obsStore.studioMode;
    }, [obsStore.studioMode]);

    const handleClick = (e) => {
        e.preventDefault();
        transitionScene(obsStore.obs);
    };

    return (
        <>
            <div className="dock">
                <div className="dock-inner">
                    {studioMode &&
                        <div className="transition"><a onClick={handleClick}>+</a></div>
                    }
                </div>
            </div>
            {children}
        </>
    );
};

export default Scenes;