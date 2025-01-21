import {setPageTitle} from "../../utils.ts";
import Navbar from "../Navbar/Navbar.tsx";

function FetchPineapple() {
    setPageTitle("🍍 主页 | 菠萝注册鸡 - 注册属于你的菠萝")
    return (<>
        <Navbar/>
    </>);
}

export default FetchPineapple;