import axios from "axios";
import {Captcha, RestBean, useLocalStorage} from "../../utils.ts";
import * as React from "react";
import {useEffect, useRef, useState} from "react";

interface Props {
    onComplete?: () => void;
}

function CaptchaChallenge(props: Props) {
    const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
    const imgRef = useRef<HTMLImageElement>(null);

    const [captchaTicket, setCaptchaTicket] = useLocalStorage("captcha");
    const [captchaImage, setCaptchaImage] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);

    const [api] = useLocalStorage("api");

    const handleRemovePoint = (index: number) => {
        setPoints([...points.slice(0, index), ...points.slice(index + 1)]);
    }

    const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
        if (!imgRef.current) return;
        const x = Math.abs(imgRef.current.x + window.scrollX - event.pageX);
        const y = Math.abs(imgRef.current.y + window.scrollY - event.pageY);

        setPoints([...points, {x, y}]);
    };

    const fetchCaptcha = async () => {
        try {
            const response = await axios.get<RestBean<Captcha>>(`${api}/api/captcha`);
            setCaptchaTicket(response.data.data.ticket);
            setCaptchaImage("data:image/png;base64, " + response.data.data.image);
            setPoints([]); // clear selected points
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || "菠萝🍍端有问题!");
            } else {
                setError("菠萝🍍错误");
            }
        }
    };

    const handleSubmit = async () => {
        // calc abs position
        if (!imgRef.current) return;

        setError(null);

        try {
            const response = await axios.post(`${api}/api/captcha`, {
                ticket: captchaTicket,
                points: points
            })

            if (response.data.code !== 200) {
                setError(response.data.message);
                return;
            }
            props.onComplete?.();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || "菠萝🍍端有问题!");
            } else {
                setError("菠萝🍍错误");
            }
        }
        setPoints([])
    }

    useEffect(() => {
        fetchCaptcha();
    }, []);

    return (<div className={"flex flex-col items-center justify-center"}>
        {error && <p className={"text-red-500"}>{error}</p>}
        {captchaImage ? (
            <div className={"flex flex-col items-center justify-center"}>
                <p>我告诉你吧,其实你只要点击所有<label className={"text-red-500"}>旋转的菠萝</label>就可以通过挑战</p>
                <p>蓝色的小圆点再点一下可以取消,选完了点按钮提交验证码</p>
                <p>图片里应该有4个菠萝🍍,如果没有请刷新验证码,这个是bug,后续会优化.</p>
                <p>不要缩放网页,后续会优化</p>
                <img ref={imgRef} onClick={handleImageClick}
                     src={captchaImage} alt="Captcha"
                     style={{cursor: "crosshair"}}/>
            </div>
        ) : (
            (captchaImage && !error) && <p className={"text-cyan-500"}>加载中...</p>
        )}
        {points.map((point, index) => (
            <div
                className={"absolute w-3 h-3 rounded-full bg-cyan-500 cursor-pointer border"}
                key={index}
                style={{
                    left: `${(imgRef.current?.offsetLeft || 0) + point.x}px`,
                    top: `${(imgRef.current?.offsetTop || 0) + point.y}px`,
                    transform: "translate(-50%, -50%)",
                }}
                onClick={() => handleRemovePoint(index)}
            ></div>))
        }
        {captchaTicket && <p>Ticket: {captchaTicket}</p>}
        <div className={"flex flex-row m-3"}>
            {captchaImage &&
                <button onClick={handleSubmit}
                        className={"rounded-xl bg-yellow-200 text-sky-600 p-2 m-1"}>吃掉这些菠萝🍍</button>}
            <button onClick={fetchCaptcha} className={"rounded-xl bg-amber-200 text-sky-600 p-2 m-1"}>换一个菠萝🍍挑战
            </button>
        </div>
    </div>);
}

export default CaptchaChallenge;