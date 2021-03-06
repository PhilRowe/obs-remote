import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { useRouter } from 'next/router';
import { useObsStore, useDispatchObsStore } from '../../components/obsStore';
import { useDispatchSettingsStore } from '../../components/settingsStore';

const Header = ({ title }) => {
    const router = useRouter();
    const obsStore = useObsStore();
    const obsDispatch = useDispatchObsStore();
    const settingsDispatch = useDispatchSettingsStore();

    const handleClick = (e) => {
        e.preventDefault();
        let href = e.target.getAttribute('href');
        router.push(href);
    };

    const handleLogout = (e) => {
        e.preventDefault();

        if (obsStore.obs) {
            obsStore.obs.disconnect();
        }

        obsDispatch({
            obs: false,
            connected: false
        });

        settingsDispatch({
            host: '',
            port: '',
            password: '',
            autoConnect: false
        });

        router.push('/');
    };

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand>
                    <img
                        alt=""
                        src="/obs.svg"
                        width="30"
                        height="30"
                        className="d-inline-block align-top pr-2"
                    />
                    { title }
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link href="/remote" active={router.pathname === '/remote'} onClick={handleClick}>Remote</Nav.Link>
                        <Nav.Link href="/settings" active={router.pathname === '/settings'} onClick={handleClick}>Settings</Nav.Link>
                        <Nav.Link href="/stats" active={router.pathname === '/stats'} onClick={handleClick}>Stats</Nav.Link>
                        <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
};

export default Header;
