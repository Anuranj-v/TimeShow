import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ correct
import MainRoutes from "./Routes/MainRoutes";
import "./assets/css/Global.css";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <MainRoutes />
    </BrowserRouter>
);
