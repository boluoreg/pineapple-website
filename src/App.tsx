import './App.css'
import LoginForm from "./components/LoginForm/LoginForm.tsx";
import {useEffect, useRef} from "react";
import {setPageTitle, useLocalStorage} from "./utils.ts";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import FetchPineapple from "./components/FetchPineapple/FetchPineapple.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";
import ChangeApiForm from "./components/ChangeApiForm/ChangeApiForm.tsx";
import EasterEgg from "./components/EasterEgg/EasterEgg.tsx";

function App() {
    const title = useRef(document.title);
    const [api, setApi] = useLocalStorage("api");

    const handleVisibilityChange = () => {
        if (document.hidden) {
            title.current = document.title;
            setPageTitle("🍍🍍🍍🍍🍍");
        } else {
            setPageTitle(title.current);
        }
    };

    useEffect(() => {
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    if (api === null) {
        setApi("http://localhost:8080");
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const apiParam = params.get('api');

        if (apiParam) {
            setApi(apiParam);
        }
    }, [setApi]);

    return (
        <>

            <BrowserRouter>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<FetchPineapple/>}/>
                    <Route path="/user" element={<LoginForm/>}/>
                    <Route path="/api" element={<ChangeApiForm/>}/>
                    <Route path="/easter-egg" element={<EasterEgg/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
