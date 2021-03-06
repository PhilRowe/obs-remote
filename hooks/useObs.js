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

        // Build the connection url
        let url = settingsStore.host;
        if (settingsStore.port) {
            url += ':' + settingsStore.port;
        }

        obs.connect({
            address: url,
            password: settingsStore.password,
            secure: settingsStore.secure
        })
        .then(() => {
            obsDispatch({
                obs: obs,
                message: '',
                connected: true
            });

            if (router.pathname === '/') {
                router.push('/remote');
            }
        })
        .catch(err => {
            reset('Failed to connect to OBS. Error: "' + err.description + '"');
        });

        // Handle the connection being closed
        obs.on('ConnectionClosed', data => {
            reset('Connection closed, Please reconnect.');
        });

        obs.on('error', err => {
            reset('socket error');
        });
    }, [settingsStore]);

    const reset = (message) => {
        // Remove global OBS object
        obsDispatch({
            type: 'reset'
        });
        // Turn off autoconnect
        settingsDispatch({
            type: 'byKey',
            key: 'autoConnect',
            value: false
        });

        // Redirect to the login page
        router.push('/');
    };
}