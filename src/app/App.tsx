import './global.css';
import { BrowserRouter } from "react-router-dom";
import RoutesConfig from "@/app/routes";

function App() {
    return (
        <BrowserRouter>
            <RoutesConfig />
        </BrowserRouter>
    );
}

export default App;