import { useEffect, useRef } from 'react';
import { useObsStore, useDispatchObsStore } from '../components/obsStore';

export default function useObs() {
    const obsStore = useObsStore();
    const obsDispatch = useDispatchObsStore();
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
                    obsDispatch({
                        studioMode: data.studioMode
                    });
                    studioMode.current = data.studioMode;
                }
                return obsStore.obs.send('GetSceneList');
            })
            // Scene list data
            .then(data => {
                obsDispatch({
                    mainScene: data.currentScene,
                    scenes: data.scenes
                });

                if (studioMode.current) {
                    return obsStore.obs.send('GetPreviewScene');
                }
                return false;
            })
            // Preview scene data
            .then(data => {
                obsDispatch({
                    previewScene: data.name
                });
            });

        // When a scene list changes we need to reload
        // Note: doesn't trigger for reorders???
        obsStore.obs.on('ScenesChanged', () => {
            obsStore.obs.send('GetSceneList')
                .then(data => {
                    obsDispatch({
                        mainScene: data.currentScene,
                        scenes: data.scenes
                    });
                });
        });

        // The "main scene has been changed"
        obsStore.obs.on('SwitchScenes', data => {
            obsDispatch({
                mainScene: data.sceneName
            });
        });

        // The preview scene has been changed
        obsStore.obs.on('PreviewSceneChanged', data => {
            obsDispatch({
                previewScene: data.sceneName
            });
        });

        // Studio mode has been toggled,
        // We use this to determine if we need to
        // an "active" preview scene
        obsStore.obs.on('StudioModeSwitched', data => {
            studioMode.current = data.studioMode;
            if (!data.studioMode) {
                obsDispatch({
                    studioMode: data.studioMode,
                    previewScene: false
                });
            } else {
                obsDispatch({
                    studioMode: data.studioMode
                });
            }
        });
    }, [obsStore.connected]);
}