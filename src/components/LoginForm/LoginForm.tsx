import * as React from "react";
import {useState} from "react";
import axios from "axios";

function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    interface LoginResponse {
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


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault(); // 阻止默认表单提交行为
        setError(null); // 清除之前的错误

        try {
            const response = await axios.post<RestBean<LoginResponse>>("http://127.0.0.1:8080/api/user/login", {
                username,
                password,
            });

            if (!(response.data.code === 200)) {
                setError(response.data.message);
                return
            }
            localStorage.setItem("token", JSON.stringify(response.data.data));
            alert("Login successful!"); // todo
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Login failed. Please check your credentials.");
            } else {
                setError("An unexpected error occurred.");
            }
        }
    };

    return (
        <div
            style={{maxWidth: "300px", margin: "auto", padding: "20px", border: "1px solid #ccc", borderRadius: "5px"}}>
            <h2>Login</h2>
            {error && <p style={{color: "red"}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{width: "100%", padding: "8px", margin: "5px 0"}}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{width: "100%", padding: "8px", margin: "5px 0"}}
                    />
                </div>
                <button type="submit" style={{
                    width: "100%",
                    padding: "10px",
                    marginTop: "10px",
                    background: "blue",
                    color: "white",
                    border: "none",
                    cursor: "pointer"
                }}>
                    Login
                </button>
            </form>
        </div>
    );
}

export default LoginForm;