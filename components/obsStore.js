import { useReducer, useContext, createContext } from 'react';

const ObsStateContext = createContext();
const ObsDispatchContext = createContext();
const ObsInitial = {
    obs: false,
    message: '',
    connected: false,
    studioMode: false,
    mainScene: false,
    previewScene: false,
    scenes: []
};

const reducer = (state, action) => {
    if (typeof action === 'object' && !!action && !('type' in action)) {
        return Object.assign({}, state, action);
    }

    switch (action.type) {
        case "reset":
            return ObsInitial;
        case 'setObs':
            return { ...state, obs: action.value };
        case 'setMessage':
            return { ...state, message: action.value };
        case 'setConnected':
            return { ...state, message: action.value };
        default:
            throw new Error(`Unknown action: ${action.type}`)
    }
}

export const ObsStoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, ObsInitial);
    return (
        <ObsDispatchContext.Provider value={dispatch}>
            <ObsStateContext.Provider value={state}>
                {children}
            </ObsStateContext.Provider>
        </ObsDispatchContext.Provider>
    )
}

export const useObsStore = () => useContext(ObsStateContext)
export const useDispatchObsStore = () => useContext(ObsDispatchContext)