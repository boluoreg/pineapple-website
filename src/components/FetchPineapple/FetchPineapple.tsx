import {Analysis, Pineapple, RestBean, setPageTitle, Token, useLocalStorage} from "../../utils.ts";
import {FaCheck, FaCopy} from "react-icons/fa";
import {useEffect, useState} from "react";

import axios, {AxiosResponse} from "axios";
import {useNavigate} from "react-router-dom";
import lizihao from "../../assets/lizihao.webp";
import CaptchaChallenge from "../Captcha/CaptchaChallenge.tsx";

function FetchPineapple() {
    const [pineapple, setPineapple] = useState<string | null>();

    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false);
    const [api] = useLocalStorage("api");
    const [planting, setPlanting] = useState(false)
    const navigate = useNavigate();

    const [pineappleCount, setPineappleCount] = useState(0)

    const [token] = useLocalStorage("token");
    const [tokenObj, setTokenObj] = useState<Token | null>()

    useEffect(() => {
        if (!token) {
            setTokenObj(null);
            return;
        }
        setTokenObj(JSON.parse(token));
    }, [token]);

    const [loading, setLoading] = useState(true);
    const [analysis, setAnalysis] = useState<Analysis | null>(null)

    const [showCaptcha, setShowCaptcha] = useState(false)
    const [captchaTicket] = useLocalStorage("captcha");

    const fetchStatistics = async () => {
        try {
            const response: AxiosResponse<RestBean<Analysis>> = await axios.get(`${api}/api/pineapple`);
            setAnalysis(response.data?.data);
        } catch (error) {
            setError("无法获取菠萝")
            console.error("Error fetching statistics:", error);
        }
    };

    useEffect(() => {
        fetchStatistics().then(() => {
            setLoading(false);
        })

        const intervalId = setInterval(fetchStatistics, 50000);

        return () => clearInterval(intervalId);
    }, []);

    const fetchPineapple = async (): Promise<void> => {
        setCopied(false);
        try {
            const response: AxiosResponse<RestBean<Pineapple>> = await axios.get(`${api}/api/pineapple/get?ticket=${captchaTicket}`)
            if (!(response.data.code === 200)) {
                setError(response.data.message);
                return
            }
            const data = response.data.data;
            setPineapple(`${data.username}:${data.password}`)
            fetchStatistics();
        } catch (error) {
            setPineapple(null);
            if (axios.isAxiosError(error)) {
                if (!captchaTicket) {
                    setShowCaptcha(true);
                }
                setError(error.response?.data?.message || "菠萝🍍端有问题!");
            } else {
                setError("菠萝🍍问题");
            }
        }
    }

    const copyPineapple = () => {
        if (pineapple === null) return;
        navigator.clipboard.writeText(pineapple!)
            .then(() => {
                setCopied(true);
            })
            .catch(err => {
                console.error(err);
            });
    }

    const handleChangeApi = () => {
        navigate("/api");
    }

    const producePineapple = async () => {
        try {
            const response = await axios.post(`${api}/api/production-line/planting`, {
                count: pineappleCount
            }, {
                headers: {
                    Authorization: `Bearer ${tokenObj?.token}`
                }
            })

            if (!(response.data.code === 200)) {
                setError(response.data.message);
            } else {
                setPlanting(true);
                setTimeout(() => {
                    fetchStatistics()
                }, 2000);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || error);
            } else {
                console.error(error)
            }
        }
    }

    setPageTitle("🍍 菠萝注册鸡 - 注册属于你的菠萝")
    if (analysis === null) {
        return (<>
            <div className={"flex flex-col justify-center items-center p3 select-none"}>
                {loading && '🍍正在赶往菠萝农场,再等等🍍'}
                {error && <label className={"text-red-500"}>{error}</label>}
                <div
                    className={"rounded bg-slate-800 text-amber-200 p-1 hover:scale-105 transition-all duration-200 cursor-pointer"}
                    onClick={handleChangeApi}>
                    菠萝农场地址不对?点这里换一个
                </div>
            </div>
        </>);
    }
    return (<>
        <div className={"flex flex-col justify-center items-center p-3"}>
            <h2>🍍点击下面的菠萝按钮获取一个菠萝🍍</h2>
            <p>农场里还有<label className={"text-red-500"}>{analysis!.totalPineapples}</label>个菠萝,快来抢</p>
            {analysis.planting && <p className={"text-cyan-600"}>正在制作菠萝,别急</p>}

            {error && <div className={"text-red-500"}>{error}</div>}
            <div className={"flex flex-row p-1"}>
                <input className={"max-w-40 p-2 rounded border-2 hover:border-amber-200"}
                       value={pineapple || ""}
                       placeholder={"🍍菠萝号"}/>
                {pineapple && <div
                    className={"flex text-amber-400 m-2 rounded-full border-2 active:translate-y-0.5 hover:border-amber-600 w-10 h-10 items-center justify-center"}
                    onClick={copyPineapple}
                >
                    {
                        copied ? <FaCheck/> :
                            <FaCopy size={20}/>
                    }
                </div>
                }
            </div>
            <button className={"btn-pineapple p-2 bg-amber-200 rounded-xl"} onClick={fetchPineapple}>🍍🍍🍍</button>

            {showCaptcha && <div className={"flex flex-col items-center p-2 rounded-xl border-2 border-slate-500"}>
                <label className={"text-red-500"}>你是菠萝人吗?请完成验证</label>
                <CaptchaChallenge/>
            </div>}

            {(token && tokenObj?.roles.includes("ADMIN")) &&
                <div className={"m-10 justify-center flex flex-col items-center"}>
                    <h2>神权面板</h2>
                    <div className={"flex flex-row"}>你为什么能看到这个面板?主播是
                        <div className={"underline-offset-1 underline text-cyan-500 group flex flex-row"}>李子豪
                            <img src={lizihao}
                                 className={"rounded-xl border border-slate-500 absolute scale-0 group-hover:scale-100 p-8 m-3"}
                                 alt="easter-egg"/>
                        </div>
                        吗?
                    </div>
                    <p>🍍我想要几个菠萝?🍍</p>
                    <input
                        placeholder={"🍍我想要几个菠萝🍍"}
                        type="number"
                        value={pineappleCount}
                        onChange={(e) => setPineappleCount(parseInt(e.target.value))}
                        className={"rounded-xl border border-amber-500 p-3"}/>
                    <button className={"rounded-xl bg-red-500 p-3 text-white m-2"}
                            disabled={planting}
                            onClick={producePineapple}>{planting ? '正在种菠萝🍍' : '开始生产菠萝🍍'}
                    </button>
                </div>
            }
        </div>
    </>);
}

export default FetchPineapple;