import { FC } from "react";
import { Outlet } from "react-router-dom";

import Header from "../../header/ui/Header.tsx";
import Footer from "../../footer/ui/Footer.tsx";

const Layout: FC = () => {
  return (
    <>
      <Header />
      <main className="main">
        <div className="pt-10">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Layout;
