import * as React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import {RestBean, setPageTitle, Token, useLocalStorage} from "../../utils.ts";

import styles from "./LoginForm.module.css"
import ChangePasswordForm from "./ChangePasswordForm.tsx";

function LoginForm() {
    setPageTitle("🍍 登录你的菠萝 | 菠萝注册鸡 - 注册属于你的菠萝")

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVerify, setPasswordVerify] = useState("");
    const [error, setError] = useState<string | null>(null);

    const [mode, setMode] = useState(window.location.hash || "login")

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
        localStorage.removeItem("token");
        setToken(null)
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

    const handleToggleRegister = () => {
        setMode(mode !== "register" ? "register" : "login");
    }

    useEffect(() => {
        window.location.hash = mode;
    }, [mode]);


    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (password !== passwordVerify) {
            setError("🍍菠萝码不一样");
            return;
        }

        try {
            const response = await axios.post<RestBean<Token>>(`${api}/api/user/register`, {
                    username: username,
                    password: password
                }
            );

            if (!(response.data.code === 200)) {
                setError(response.data.message);
                return
            }
            await handleLogin(e) // login with the same credit
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "菠萝🍍端有问题!");
            } else {
                setError("菠萝🍍错误");
            }
        }
    }

    const processChangePassword = () => {
        setMode("change-password")
    }


    const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
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
            if (mode === "change-password") {
                return <ChangePasswordForm token={tokenObj} handleBack={() => {
                    setMode("login")
                }}/>
            }
            return (
                <div className={"transition-all duration-300"}
                     style={{
                         maxWidth: "450px",
                         margin: "auto",
                         padding: "25px",
                         border: "1px solid #ccc",
                         borderRadius: "5px"
                     }}>
                    <h2>🍍你的菠萝🍍</h2>
                    <p>菠萝🍍农场: <a href={"/api?callback=login"}
                                     className={"underline underline-offset-1 text-cyan-700"}>{api}</a> (点击可更换/复制分享链接)
                    </p>
                    <p>恭喜你,你已经成功登录 你的用户名是{tokenObj.username}</p>
                    <p>你要退出登录吗?请点击下面的<label className={styles.red}>红色</label>按钮</p>
                    <p>你要更换密码吗?请点击下面的<label className={styles.yellow}>黄色</label>按钮</p>
                    <p>你要返回吗?请点击下面的<label className={styles.blue}>蓝色</label>按钮</p>
                    <button onClick={processLogout} className={`${styles.button} ${styles.red}`}>
                        {clickCount === 0 ? '出售菠萝🍍' : '你确认吗?请再点击一次'}
                    </button>
                    <div className={"flex flex-row"}>
                        <button onClick={processChangePassword}
                                className={`${styles.button} ${styles.yellow}`}>不,我要更换菠萝码🍍
                        </button>
                        <button onClick={processBack} className={`${styles.button} ${styles.blue}`}>
                            不,我想要更多菠萝🍍
                        </button>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className={"transition-all duration-300"}
             style={{
                 maxWidth: "480px",
                 margin: "auto",
                 padding: "20px",
                 border: "1px solid #ccc",
                 borderRadius: "5px"
             }}>
            <h2>🍍{mode === "register" ? '注册' : '登录'}你的菠萝🍍</h2>
            <p>菠萝🍍农场: <a href={"/api?callback=login"}
                             className={"underline underline-offset-1 text-cyan-700"}>{api}</a> (点击可更换/复制分享链接)
            </p>
            {mode === "register" && <p>用户名必须只包含英文字母,且长度大于等于5</p>}
            {error && <p style={{color: "red"}}>{error}</p>}
            <form onSubmit={mode === "register" ? handleRegister : handleLogin}>
                <div>
                    <label>用户名:</label>
                    <input
                        type="text"
                        className={`border-amber-400 border-2 ${styles.input}`}
                        placeholder={"🍍菠萝名"}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>密码:</label>
                    <input
                        type="password"
                        value={password}
                        className={styles.input}
                        placeholder={"🍍菠萝码"}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {mode === "register" && <input type="password"
                                                   value={passwordVerify}
                                                   className={styles.input}
                                                   placeholder={"🍍再输入一次菠萝码"}
                                                   onChange={(e) => setPasswordVerify(e.target.value)}
                                                   required/>
                    }
                </div>
                <div className={"flex flex-col"}>
                    {
                        mode === "register" ? <div className={"flex flex-row"}>
                                <button type="submit" className={`${styles.button} ${styles.yellow}`}>
                                    创建你的菠萝户🍍
                                </button>
                                <button type="button" onClick={handleToggleRegister}
                                        className={`${styles.button} ${styles.red}`}>
                                    不,我想起来我有菠萝🍍
                                </button>
                            </div> :

                            <div className={"flex flex-row"}>
                                <button type="submit" className={`${styles.button} ${styles.blue}`}>
                                    我有菠萝🍍,请放我进去!
                                </button>
                                <button type="button" onClick={handleToggleRegister}
                                        className={`${styles.button} ${styles.yellow}`}>
                                    要一个菠萝🍍
                                </button>
                            </div>
                    }
                    <button onClick={processBack} className={`${styles.button} ${styles.cyan}`}>我只是想要免费的菠萝
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;