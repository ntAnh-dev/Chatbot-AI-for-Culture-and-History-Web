import ShowSidebar from "../../assets/showsidebar.png";
import Pen from "../../assets/pen.png";
import { useState } from "react";
import { clearEmail, clearToken, getEmail, hasToken, saveEmail, saveToken } from "../../utils/localStorage";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const apiUrl = 'http://localhost:9000';

const In = async (data: { email: string }) => {
  return axios.post(`${apiUrl}/auth/in`, data);
}

const Check = async (data: { email: string, code: string }) => {
    return axios.post(`${apiUrl}/auth/check`, data);
}

const Topbar = ({ isOpenSidebar, setIsOpenSidebar, setConversationId }) => {
    const [isLogin, setIsLogin] = useState(hasToken());
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [email, setEmail] = useState(getEmail());
    const [isLoading, setIsLoading] = useState(false);

    const authIn = useMutation({
        mutationFn: In,
        onSuccess: () => {
            setEmail(value);
            setValue("");
            setIsLoading(false);
        }
    });

    const authCheck = useMutation({
        mutationFn: Check,
        onSuccess: (response) => {
            saveToken(response.data.access_token);
            saveEmail(response.data.email);
            setValue("");
            setIsLogin(true);
            setOpen(false);
            setIsLoading(false);
        }
    })

    const handleClick = () => {
        if (isLogin) {
            setIsLogin(false);
            setEmail(null);
            clearEmail();
            clearToken();
            setOpen(false);
        } else {
            setIsLoading(true);
            if (email) {
                authCheck.mutate({email, code: value});
            } else {
                authIn.mutate({ email: value });
            }
        }
    }

    return ( <>
        <div className="w-full h-14 px-4 py-2 relative">
            {!isOpenSidebar && <div className="h-10 flex absolute top-2 left-4">
                <button className={"p-1.5 rounded-md " + (isLogin ? "hover:cursor-pointer hover:bg-slate-100/20" : "opacity-30 hover:cursor-not-allowed")} disabled={!isLogin} onClick={() => setIsOpenSidebar(true)}>
                    <img src={ShowSidebar} className="h-full aspect-square" />
                </button>
                <button className={"p-1.5 rounded-md " + (isLogin ? "hover:cursor-pointer hover:bg-slate-100/20" : "opacity-30 hover:cursor-not-allowed")} disabled={!isLogin} onClick={() => setConversationId("")}>
                    <img src={Pen} className="h-full aspect-square" />
                </button>
            </div>}
            <div className="h-10 flex gap-2 absolute top-2 right-4">
                <button 
                    className="py-2.5 px-5 rounded-full border border-slate-100/10 flex items-center gap-1 text-sm text-white font-semibold hover:cursor-pointer hover:bg-slate-100/10"
                    onClick={() => setOpen(true)}
                >
                    {!isLogin ? "Đăng nhập" : email}
                </button>
            </div>
        </div>
        {open && <div className="w-screen h-screen bg-black/70 fixed inset-0 flex items-center justify-center">
            <div className="bg-[#212121] w-full h-fit max-w-96 max-h-96 rounded-2xl flex flex-col p-6 gap-4">
                <span className="text-white text-xl">{!isLogin ? "Đăng nhập" : "Đăng xuất"}</span>
                {!isLogin && <input 
                    className={"focus:outline-none text-white h-11 p-6 border border-slate-100/10 rounded-2xl " + (isLoading ? "opacity-50" : "")} placeholder={email ? "Code" : "Email"}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={isLoading}
                />}
                <button className="py-2.5 px-5 rounded-full border border-slate-100/10 flex items-center justify-center gap-1 text-sm text-white font-semibold hover:cursor-pointer hover:bg-slate-100/10" onClick={handleClick}>
                    {isLogin ? "Xác nhận" : email ? "Xác minh" : "Gửi code"}
                </button>
                <button className="py-2.5 px-5 rounded-full border border-slate-100/10 flex items-center justify-center gap-1 text-sm text-white font-semibold hover:cursor-pointer hover:bg-slate-100/10" onClick={() => setOpen(false)}>Hủy</button>
            </div>
        </div>}
    </>)
}

export default Topbar;