import Layout from "../components/layout";
import Output from "../components/obs/output";
import Scenes from "../components/obs/scenes";
import useObs from '../hooks/useObs';
import useObsCoreData from '../hooks/useObsCoreData';

const Remote = () => {
    useObs();
    useObsCoreData();

    return (
        <Layout title="Remote">
            <Output />
            <Scenes />
        </Layout>
    );
}

export default Remote;