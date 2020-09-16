import { useEffect } from 'react';
import { useSettingsStore, useDispatchSettingsStore } from '../components/settingsStore';
import { useObsStore, useDispatchObsStore } from '../components/obsStore';
import { useRouter } from 'next/router';
import obsWebSocket from 'obs-websocket-js';

export default function useObs() {
    const router = useRouter();
    const settingsStore = useSettingsStore();
    const settingsDispatch = useDispatchSettingsStore();
    const obsStore = useObsStore();
    const obsDispatch = useDispatchObsStore();
    const obs = new obsWebSocket();

    useEffect(() => {
        if (obsStore.connected) {
            return;
        }

        if (!settingsStore.autoConnect) {
            return;
        }

        if (settingsStore.host === '' && settingsStore.port === '') {
            return;
        }

        obs.disconnect();
        obs.connect({
            address: settingsStore.host + ':' + settingsStore.port,
            password: settingsStore.password,
            secure: (location.protocol === 'https:')
        })
        .then(() => {
            obsDispatch({
                type: 'all',
                value: {
                    obs: obs,
                    message: '',
                    connected: true
                }
            });

            if (router.pathname === '/') {
                router.push('/remote');
            }
        })
        .catch(err => {
            obsDispatch({
                type: 'all',
                value: {
                    obs: false,
                    message: 'Failed to connect to OBS. Error: "' + err.description + '"',
                    connected: false
                }
            });

            settingsDispatch({
                type: 'byKey',
                key: 'autoConnect',
                value: false
            });

            if (router.pathname != '/') {
                router.push('/');
            }
        });

    }, [settingsStore]);
}