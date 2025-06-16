import React from "react";
import HideSidebar from "../../assets/hidesidebar.png";
import Pen from "../../assets/pen.png";
import axios from "axios";
import { getToken } from "../../utils/localStorage";
import { useQuery } from "@tanstack/react-query";

const apiUrl = 'http://host.docker.internal:9000';

const getConversations = async () => {
  return axios.get(`${apiUrl}/chatbot/conversations`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
}

const Sidebar = ({ isOpenSidebar, setIsOpenSidebar, setConversationId }) => {
  const { data: conversations, refetch } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });

  const handleClick = (id) => {
    setConversationId(id);
  }

  return (
    <div className="h-full w-full md:w-[350px] flex flex-col bg-[#171717]">
      <div className="w-full h-14 px-4 py-2 relative">
        <div className="h-10 flex absolute top-2 right-4">
          <button className={"p-1.5 rounded-md " + "hover:cursor-pointer hover:bg-slate-100/20"} onClick={() => setConversationId("")}>
              <img src={Pen} className="h-full aspect-square" />
          </button>
          <button className={"p-1.5 rounded-md " + "hover:cursor-pointer hover:bg-slate-100/20"} onClick={() => setIsOpenSidebar(false)}>
              <img src={HideSidebar} className="h-full aspect-square" />
          </button>
        </div>
      </div>
      <div className="w-full flex-grow overflow-y-auto flex flex-col gap-4 p-4 hide-scrollbar">
        {conversations?.data.map((conversation => (
          <div className="p-4 bg-slate-700/20 hover:bg-slate-700/70 hover:cursor-pointer text-white rounded-lg" onClick={() => handleClick(conversation._id)}>{conversation.name}</div>
        )))}
      </div>
    </div>
  )
}

export default Sidebar;