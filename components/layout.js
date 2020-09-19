import Head from "./layout/head";
import Header from "./layout/header";
import Footer from "./layout/footer";

const Layout = ({
    title,
    children
}) => (
    <>
        <Head title={title} />
        <div className="main">
            <Header title={title} />
            {children}
            <Footer />
        </div>
    </>
)

export default Layout;