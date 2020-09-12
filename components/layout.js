import Head from "./layout/head";
import Header from "./layout/header";
import Footer from "./layout/footer";

const Layout = ({
    title,
    active,
    children
}) => (
    <>
        <Head title={title} />
        <div className="main">
            <Header active={active} />
            <div className="content">
                {children}
            </div>
            <Footer />
        </div>
    </>
)

export default Layout;