import Layout from "../components/layout";
import Scenes from "../components/obs/scenes";
import useObs from '../hooks/useObs';

const Remote = () => {
    useObs();

    return (
        <Layout title="Remote">
            <Scenes>
            </Scenes>
        </Layout>
    );
}

export default Remote;