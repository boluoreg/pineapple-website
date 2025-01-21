import {useLocalStorage} from "../../utils.ts";
import styles from "./Navbar.module.css"


function Navbar() {
    const processLogin = () => {
        window.location.href = "/user";
    }

    const processChangeAPI = () => {
        window.location.href = "/api";
    }

    const [api] = useLocalStorage("api");

    return (<>
        <div className={"flex flex-row bg-slate-500 text-amber-200 justify-between transition-all duration-200 m-2"}>
            <div className={`${styles.link} group flex-col flex`} onClick={processChangeAPI}>换菠萝农场
                <label className={`${styles.api} absolute group-hover:scale-100 scale-0`}>{api}</label>
            </div>
            <div className={styles.link}>🍍菠萝注册鸡 - 注册属于你的菠萝</div>
            <div className={styles.link} onClick={processLogin}>登录/注册</div>
        </div>
    </>)
}

export default Navbar;