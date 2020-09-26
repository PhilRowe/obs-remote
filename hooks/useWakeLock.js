import { useEffect } from 'react';

export default function useWakeLock() {
    var wakeLock;

    useEffect(() => {
        // Request screen wakelock
        if ('wakeLock' in navigator) {
            try {
                navigator.wakeLock.request('screen');
            }
            catch(e) { }
        }
    }, []);
}