import * as React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import {useLocalStorage} from "../../utils.ts";

import styles from "./LoginForm.module.css"

function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    interface Token {
        username: string;
        token: string;
        expire: number;
        roles: string[];
    }

    interface RestBean<T> {
        code: number;
        message: string;
        data: T;
    }

    const [api, setApi] = useLocalStorage("api");
    const [token, setToken] = useLocalStorage("token");
    const [clickCount, setClickCount] = useState(0);

    if (api === null) {
        setApi("http://localhost:8080");
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const apiParam = params.get('api');

        if (apiParam) {
            setApi(apiParam);
            params.delete("api")
            window.location.search = params.toString()
        }
    }, [setApi]);

    const processLogout = async () => {
        if (clickCount === 0) {
            setClickCount(clickCount + 1);
            return;
        }
        setToken(null);
        // post to the logout endpoint
        const tokenObj: Token = JSON.parse(token)
        const jwt = tokenObj.token;
        await axios.post<RestBean<Token>>(`${api}/api/user/logout`, null, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });
    }

    const processBack = () => {
        window.location.href = "/";
    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post<RestBean<Token>>(`${api}/api/user/login`,
                `username=${username}&&password=${password}`
            );

            if (!(response.data.code === 200)) {
                setError(response.data.message);
                return
            }
            setToken(JSON.stringify(response.data.data));
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "🍍菠萝户不对 或者菠萝🍍端没开");
            } else {
                setError("菠萝🍍错误");
            }
        }
    };

    if (token !== null) {
        // decode token
        const tokenObj: Token = JSON.parse(token)
        if (tokenObj.expire > Date.now()) {
            return (
                <div
                    style={{
                        maxWidth: "350px",
                        margin: "auto",
                        padding: "20px",
                        border: "1px solid #ccc",
                        borderRadius: "5px"
                    }}>
                    <h2>🍍你的菠萝🍍</h2>
                    <p onClick={() => {}}>菠萝🍍农场: {api} (点击可更换/复制分享链接)</p>
                    <p>恭喜你,你已经成功登录 你的用户名是{tokenObj.username}</p>
                    <p>你要退出登录吗?请点击下面的<label className={styles.red}>红色</label>按钮</p>
                    <button onClick={processLogout} className={`${styles.button} ${styles.red}`}>
                        {clickCount === 0 ? '出售菠萝🍍' : '你确认吗?请再点击一次'}
                    </button>
                    <button onClick={processBack} className={`${styles.button} ${styles.blue}`}>
                        不,我想要更多菠萝🍍
                    </button>
                </div>
            )
        }
    }

    return (
        <div
            style={{maxWidth: "350px", margin: "auto", padding: "20px", border: "1px solid #ccc", borderRadius: "5px"}}>
            <h2>🍍登录你的菠萝🍍</h2>
            <p>菠萝🍍农场: {api} (点击可更换/复制分享链接)</p>
            {error && <p style={{color: "red"}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>用户名:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{width: "90%", padding: "8px", margin: "5px 0"}}
                    />
                </div>
                <div>
                    <label>密码:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{width: "90%", padding: "8px", margin: "5px 0"}}
                    />
                </div>
                <button type="submit" className={`${styles.button} ${styles.blue}`}>
                    要一个菠萝🍍
                </button>
            </form>
        </div>
    );
}

export default LoginForm;