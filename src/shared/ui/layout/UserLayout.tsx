import { FC } from "react";
import { Outlet } from 'react-router-dom';

import UserHeader from "@/shared/ui/layout/UserHeader.tsx";
import Footer from './Footer.tsx';

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
