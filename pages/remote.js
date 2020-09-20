import Layout from "../components/layout";
import StickyTop from "../components/layout/stickyTop";
import Output from "../components/obs/output";
import Scenes from "../components/obs/scenes";
import PinnedScenes from "../components/obs/pinnedScenes";
import Dock from "../components/obs/dock";
import useObs from '../hooks/useObs';
import useObsCoreData from '../hooks/useObsCoreData';

const Remote = () => {
    useObs();
    useObsCoreData();

    return (
        <Layout title="Remote">
            <StickyTop>
                <Output />
                <PinnedScenes />
            </StickyTop>
            <Scenes />
            <Dock />
        </Layout>
    );
}

export default Remote;