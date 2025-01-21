import styles from "./LoginForm.module.css";
import * as React from "react";
import {useState} from "react";

import axios, {AxiosResponse} from "axios";
import {RestBean, setPageTitle, Token, useLocalStorage} from "../../utils.ts";

interface Props {
    token: Token;
    handleBack?: () => void;
}

function ChangePasswordForm(props: Props) {
    setPageTitle("🍍 修改菠萝码 | 菠萝注册鸡 - 注册属于你的菠萝");

    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVerify, setPasswordVerify] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [api] = useLocalStorage("api");

    const [success, setSuccess] = useState(false);

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError(null);

        if (passwordVerify !== password) {
            setError("🍍菠萝码对不上,主播");
            return;
        }
        try {
            const response: AxiosResponse<RestBean<string>> = await axios.post(`${api}/api/user/resetPassword`, {
                oldPassword: oldPassword,
                password: password
            }, {
                headers: {
                    'Authorization': `Bearer ${props.token.token}`
                }
            })

            if (response.data.code !== 200) {
                setError(response.data.message);
                return;
            }
            // success
            setSuccess(true);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "菠萝🍍端有问题!");
            } else {
                setError("菠萝🍍错误");
            }
        }
    }

    return (<>
        <div className={"transition-all duration-300"}
             style={{
                 maxWidth: "480px",
                 margin: "auto",
                 padding: "20px",
                 border: "1px solid #ccc",
                 borderRadius: "5px"
             }}>
            <h2>🍍修改你的菠萝码🍍</h2>
            <p>菠萝🍍农场: <a href={"/api?callback=/user#login"}
                             className={"underline underline-offset-1 text-cyan-700"}>{api}</a> (点击可更换/复制分享链接)
            </p>
            {error && <p style={{color: "red"}}>{error}</p>}
            {
                success ? <button className={`${styles.button} ${styles.cyan}`} onClick={props.handleBack}>你成功了!点这里返回</button> :

                    <form onSubmit={handleChangePassword}>
                        <div>
                            <label>旧的密码:</label>
                            <input
                                type="text"
                                className={`border-amber-400 border-2 ${styles.input}`}
                                placeholder={"🍍旧的菠萝码"}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>新的密码:</label>
                            <input
                                type="password"
                                value={password}
                                className={styles.input}
                                placeholder={"🍍菠萝码"}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <input type="password"
                                   value={passwordVerify}
                                   className={styles.input}
                                   placeholder={"🍍再输入一次菠萝码"}
                                   onChange={(e) => setPasswordVerify(e.target.value)}
                                   required/>
                        </div>
                        <button type="submit" className={`${styles.button} ${styles.yellow}`}>
                            修改你的菠萝码🍍
                        </button>
                        <button type="button" onClick={props.handleBack}
                                className={`${styles.button} ${styles.red}`}>
                            不,我点错了
                        </button>
                    </form>
            }
        </div>
    </>);
}

export default ChangePasswordForm;