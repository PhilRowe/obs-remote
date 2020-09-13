import Head from "./layout/head";
import Header from "./layout/header";
import Footer from "./layout/footer";
import Container from 'react-bootstrap/Container';

const Layout = ({
    title,
    children
}) => (
    <>
        <Head title={title} />
        <div className="main">
            <Header title={title} />
                <Container>
                    {children}
                </Container>
            <Footer />
        </div>
    </>
)

export default Layout;