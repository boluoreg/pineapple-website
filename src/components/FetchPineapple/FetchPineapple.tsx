import {setPageTitle} from "../../utils.ts";
import {FaCheck, FaCopy} from "react-icons/fa";
import {useState} from "react";

function FetchPineapple() {
    const [pineapple, setPineapple] = useState<string>()

    const [copied, setCopied] = useState(false)

    const fetchPineapple = () => {
        setCopied(false);
        setPineapple("xxx");
    }

    const copyPineapple = () => {
        if (pineapple === null) return;
        navigator.clipboard.writeText(pineapple!)
            .then(() => {
                setCopied(true);
            })
            .catch(err => {
                console.error("复制失败：", err);
            });
    }

    setPageTitle("🍍 主页 | 菠萝注册鸡 - 注册属于你的菠萝")
    return (<>
        <div className={"flex flex-col justify-center items-center p-3"}>
            <div className={"flex flex-row p-1"}>
                <input className={"max-w-40 p-2 rounded border-2 hover:border-amber-200"}
                       value={pineapple}
                       placeholder={"🍍菠萝号"}/>
                <div
                    className={"flex text-amber-400 m-2 rounded-full border-2 hover:border-amber-600 w-10 h-10 items-center justify-center"}
                    onClick={copyPineapple}
                >
                    {
                        copied ? <FaCheck/> :
                            <FaCopy size={20}/>
                    }
                </div>
            </div>
            <button className={"btn-pineapple p-2 bg-amber-200 rounded-xl"} onClick={fetchPineapple}>🍍🍍🍍</button>
        </div>
    </>);
}

export default FetchPineapple;