import { FC } from "react";
import { Outlet } from 'react-router-dom';

import Header from './Header.tsx';
import Footer from './Footer.tsx';

const Layout: FC = () => {
    return (
        <>
            <Header />
            <main className="main">
                <div>
                    <Outlet />
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Layout;
