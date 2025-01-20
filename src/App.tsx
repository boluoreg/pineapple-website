import './App.css'
import LoginForm from "./components/LoginForm/LoginForm.tsx";
import {useEffect, useRef} from "react";
import {setPageTitle} from "./utils.ts";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import FetchPineapple from "./components/FetchPineapple/FetchPineapple.tsx";

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
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<FetchPineapple />} />
                    <Route path="/login" element={<LoginForm />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
