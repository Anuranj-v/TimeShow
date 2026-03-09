import React from "react";
import Navbar from "../../Admin/components/Navbar/Navbar.jsx";
import Sidebar from "../../Admin/components/Sidebar/Sidebar.jsx";
import AdminRoutes from "../../Routes/AdminRoutes.jsx";
import style from "./AdminLayout.module.css";

const AdminHomepage = () => {
    return (
        <div className={style.home}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className={style.homecontainer}>
                <Navbar />
                <AdminRoutes />
            </div>
        </div>
    );
};

export default AdminHomepage;
