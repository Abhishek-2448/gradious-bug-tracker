import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";

function Layout() {
  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
