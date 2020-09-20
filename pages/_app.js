import '../styles/main.scss'
import { SettingsStoreProvider } from '../components/settingsStore'
import { ObsStoreProvider } from '../components/obsStore'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS
config.autoAddCss = false // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

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