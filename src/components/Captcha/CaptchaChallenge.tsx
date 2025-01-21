import axios from "axios";
import {Captcha, RestBean, useLocalStorage} from "../../utils.ts";
import {useEffect, useState} from "react";

function CaptchaChallenge() {
    const [captchaTicket, setCaptchaTicket] = useState<string | null>(null);
    const [captchaImage, setCaptchaImage] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);

    const [api] = useLocalStorage("api");

    const fetchCaptcha = async () => {
        try {
            const response = await axios.get<RestBean<Captcha>>(`${api}/api/captcha`);
            setCaptchaTicket(response.data.data.ticket);
            setCaptchaImage("data:image/png;base64, " + response.data.data.image);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || "菠萝🍍端有问题!");
            } else {
                setError("菠萝🍍错误");
            }
        }
    };

    useEffect(() => {
        fetchCaptcha();
    }, []);

    return (<div className={"flex flex-col items-center justify-center"}>
        {error && <p className={"text-red-500"}>{error}</p>}
        {captchaImage ? (
            <div className={"flex flex-col items-center justify-center"}>
                <p>我告诉你吧,其实你只要点击所有<label className={"text-red-500"}>旋转的菠萝</label>就可以通过挑战</p>
                <img src={captchaImage} alt="Captcha" style={{cursor: "pointer"}}/>
            </div>
        ) : (
            (captchaImage && !error) && <p className={"text-cyan-500"}>加载中...</p>
        )}
        {captchaTicket && <p>Ticket: {captchaTicket}</p>}
        <button onClick={fetchCaptcha} className={"rounded-xl bg-amber-200 text-sky-600 p-2"}>换一个菠萝🍍挑战</button>
    </div>);
}

export default CaptchaChallenge;