import { useReducer, useContext, createContext, useEffect, useState } from 'react'

const SettingsStoreStateContext = createContext();
const SettingsStoreDispatchContext = createContext();
const storeInitial = {
    host: '',
    port: '',
    password: '',
    secure: false,
    autoConnect: true,
    livePreview: true,
    hideAfter: '------------',
    pinnedScenes: []
};
const StorageKey = 'settings';

const reducer = (state, action) => {
    if (typeof action === 'object' && !!action && !('type' in action)) {
        return Object.assign({}, state, action);
    }

    switch (action.type) {
        case "reset":
            return storeInitial;
        case 'byKey':
            return { ...state, [action.key]: action.value };
        default:
            throw new Error(`Unknown action: ${action.type}`)
    }
}

export const SettingsStoreProvider = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [state, dispatch] = useReducer(reducer, storeInitial);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem(StorageKey, JSON.stringify(state));
        }
    });

    useEffect(() => {
        dispatch(Object.assign({}, storeInitial, JSON.parse(localStorage.getItem(StorageKey))));
        setIsInitialized(true);
    }, []);

    return (
        <SettingsStoreDispatchContext.Provider value={dispatch}>
            <SettingsStoreStateContext.Provider value={state}>
                {children}
            </SettingsStoreStateContext.Provider>
        </SettingsStoreDispatchContext.Provider>
    )
}

export const useSettingsStore = () => useContext(SettingsStoreStateContext)
export const useDispatchSettingsStore = () => useContext(SettingsStoreDispatchContext)