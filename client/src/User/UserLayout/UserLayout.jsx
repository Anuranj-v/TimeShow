import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import UserRoutes from "../../Routes/UserRoutes";
import styles from "./User.module.css";
import Banner from "../components/Banner/Banner";


const UserLayout = () => {
    return (
        <div className={styles.userLayout}>
            <Navbar />

            {/* <Banner /> */}

            <div className={styles.content}>
                <UserRoutes />
            </div>

            <Footer />
        </div>
    );
};

export default UserLayout;
