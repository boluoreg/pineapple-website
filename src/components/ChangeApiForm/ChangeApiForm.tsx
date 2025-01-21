import {useState} from "react";
import {useLocalStorage} from "../../utils.ts";
import * as React from "react";
import {useNavigate} from "react-router-dom";

function ChangeApiForm() {
    const [api, setApi] = useLocalStorage("api");
    const [, setToken] = useLocalStorage("token");
    const [newApiAddress, setNewApiAddress] = useState(api);
    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null)

    const processChangeApi = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null); // clear error
        if (newApiAddress === api) {
            setError(`你已经在${api}这个农场了`)
            return;
        }
        if (!(newApiAddress.startsWith("http://") || newApiAddress.startsWith("https://"))) {
            setError("你的菠萝🍍协议不对,应该是http或者是它的复数");
            return;
        }
        setApi(newApiAddress);
        const params = new URLSearchParams(window.location.search);
        const callbackParam = params.get('callback');

        // clear token
        setToken(null)

        if (callbackParam) {
            navigate(callbackParam);
        } else {
            navigate("/");
        }
    }

    return (<>
        <form onSubmit={processChangeApi}>
            <div className={"flex flex-col  justify-center"}
                 style={{
                     maxWidth: "480px",
                     margin: "auto",
                     padding: "20px",
                     border: "1px solid #ccc",
                     borderRadius: "5px"
                 }}
            >
                <h2>🍍换一个农场🍍</h2>
                {error && <p className={"text-red-500"}>{error}</p>}
                <p>地址:</p>
                <input className={"border-amber-600 border-2 p-3"}
                       placeholder={"🍍菠萝址"}
                       value={newApiAddress}
                       onChange={(e) => setNewApiAddress(e.target.value)}

                       required/>
                <button type="submit" className={"rounded-xl bg-red-600 text-white m-2 p-2"}>火速前往</button>
            </div>
        </form>
    </>);
}

export default ChangeApiForm;