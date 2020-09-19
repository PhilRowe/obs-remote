import Layout from "../components/layout";
import Output from "../components/obs/output";
import Scenes from "../components/obs/scenes";
import Dock from "../components/obs/dock";
import useObs from '../hooks/useObs';
import useObsCoreData from '../hooks/useObsCoreData';

const Remote = () => {
    useObs();
    useObsCoreData();

    return (
        <Layout title="Remote">
            <Output />
            <Scenes />
            <Dock />
        </Layout>
    );
}

export default Remote;