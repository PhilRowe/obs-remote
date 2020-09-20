import Container from 'react-bootstrap/Container';
import { useEffect, useState, useRef } from 'react';
import classNames from "classnames";
import throttle from 'lodash/throttle';

const Output = ({ children }) => {
    const [sticky, setSticky] = useState(false);
    const [height, setHeight] = useState(false);
    let elm = useRef(null);

    useEffect(() => {
        // Watch scroll (with throttle)
        let throttleScroll = throttle(handleScroll, 50);
        window.addEventListener('scroll', throttleScroll);

        // Watch resize
        let resizeObserver = new ResizeObserver(handleResize).observe(elm.current);

        handleScroll();
        handleResize();

        return () => {
            window.removeEventListener('scroll', () => throttleScroll);
        };
    }, []);

    const handleScroll = () => {
        if (elm.current) {
            setSticky(elm.current.parentNode.getBoundingClientRect().top <= 0);
        }
    };

    const handleResize = () => {
        if (elm.current) {
            setHeight(elm.current.offsetHeight);
        }
    };

    return (
        <>
            <div
                className={classNames({
                    'sticky-top-wrapper': true
                })}
                style={{ height: height }}
            >
                <div
                    className={classNames({
                        'sticky-top': true,
                        'pt-4': true,
                        'sticky': sticky
                    })}
                    ref={elm}
                >
                    <Container>
                        {children}
                    </Container>
                </div>
            </div>
        </>
    );
};

export default Output;