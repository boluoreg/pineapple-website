import './App.css'
import LoginForm from "./components/LoginForm/LoginForm.tsx";
import {useEffect, useRef} from "react";
import {setPageTitle} from "./utils.ts";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import FetchPineapple from "./components/FetchPineapple/FetchPineapple.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";

function App() {
    const title = useRef(document.title);

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

    return (
        <>
            <Navbar/>

            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<FetchPineapple />} />
                    <Route path="/user" element={<LoginForm />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
