import Layout from "../components/layout";
import useObs from '../hooks/useObs';

const Remote = () => {
    useObs();

    return (
        <Layout title="Remote">
            <div>Hello</div>
        </Layout>
    );
}

export default Remote;