
import { FC } from "react";
import { Outlet } from 'react-router-dom';

import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

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
