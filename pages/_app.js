import '../styles/main.scss'
import { SettingsStoreProvider } from '../components/settingsStore'
import { ObsStoreProvider } from '../components/obsStore'

function MyApp( { Component, pageProps } ) {
    return (
        <SettingsStoreProvider>
            <ObsStoreProvider>
                <Component { ...pageProps } />
            </ObsStoreProvider>
        </SettingsStoreProvider>
    )
}

export default MyApp