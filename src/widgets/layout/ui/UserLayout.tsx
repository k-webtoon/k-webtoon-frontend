import { FC } from "react";
import { Outlet } from 'react-router-dom';

import UserHeader from "@/widgets/header/ui/UserHeader.tsx";
import Footer from '../../footer/ui/Footer.tsx';

const Layout: FC = () => {
    return (
        <>
            <UserHeader />
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
