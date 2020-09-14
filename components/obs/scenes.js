import { useObsStore } from '../../components/obsStore';
import { useSettingsStore } from '../../components/settingsStore';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';

const Scenes = ({ children }) => {
    const obsStore = useObsStore();
    const settingsStore = useSettingsStore();
    const [initialised, setInitialised] = useState(false);
    const [scenesData, setScenesData] = useState([]);
    const [currentScene, setCurrentScene] = useState({
        main: false,
        preview: false
    });

    useEffect(() => {
        if (!obsStore.connected) {
            setInitialised(false);
            return;
        }

        if (initialised) {
            return;
        }

        obsStore.obs.send('GetSceneList')
            .then(data => {
                setScenesData(processScenes(data.scenes));
                setCurrentScene(prevState => ({
                    ...prevState,
                    main: data.currentScene
                }));

                return obsStore.obs.send('GetPreviewScene');
            })
            .then(data => {
                setCurrentScene(prevState => ({
                    ...prevState,
                    preview: data.name
                }));
            })
            .catch(_ => {
                // studio mode may be disabled which could trigger this
            });

        obsStore.obs.on('ScenesChanged', data => {
            obsStore.obs.send('GetSceneList')
                .then(data => {
                    setScenesData(processScenes(data.scenes));
                    setCurrentScene(prevState => ({
                        ...prevState,
                        main: data.currentScene
                    }));
                });
        });

        obsStore.obs.on('SwitchScenes', data => {
            setCurrentScene(prevState => ({
                ...prevState,
                main: data.sceneName
            }));
        });

        obsStore.obs.on('PreviewSceneChanged', data => {
            setCurrentScene(prevState => ({
                ...prevState,
                preview: data.sceneName
            }));
        });

    }, [obsStore.connected]);

    function processScenes(scenes) {
        var found = true;

        scenes = scenes.filter(scene => {
            if (found && scene.name.includes(settingsStore.hideAfter)) {
                found = false;
            }

            return found;
        });

        return scenes;
    }

    const handleClick = (e, name) => {
        e.preventDefault();
        console.log(name);
    };

    return (
        <>
            {scenesData.map(({ name }) => (
                <Card key={name} className="mb-2" as="a" onClick={ e => handleClick(e, name)}>
                    <Card.Body>{name}</Card.Body>
                </Card>
            ))}

            {children}
        </>
    );
};

export default Scenes;