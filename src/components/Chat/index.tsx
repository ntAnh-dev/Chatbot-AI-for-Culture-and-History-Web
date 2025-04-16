import { useEffect, useState } from "react";
import Micro from "../../assets/mic.png";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = 'http://localhost:9000';

const createConversation = async (callback) => {
  const response = await axios.post(`${apiUrl}/chatbot/conversation`);
  callback(response.data._id);
  return;
}

const createMessage = async (data) => {
  return axios.post(`${apiUrl}/chatbot/message`, data);
}

const getConversation = async (id) => {
  return axios.get(`${apiUrl}/chatbot/conversation/${id}`);
}

const ChatWindow = () => {
  const [conversationId, setConversationId] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    createConversation(setConversationId);
    console.log("Call");
  }, [setConversationId]);

  const { data: conversation, refetch } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversation(conversationId),
    enabled: !!conversationId
  });

  const sendMessage = useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      setInputValue("");
      refetch();
    }
  });
  
  return (
    <div className="h-full w-full flex flex-col justify-center p-4">
      <div className="flex-grow flex flex-col gap-4">
        {(conversation?.data.messages || []).map(item => (
          <div className={"w-full flex " + (item.role === "user" ? "justify-end" : "")}>
            <div className={"w-10/12 bg-[#303030] text-white p-4 rounded-md "}>
              {item.message}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-[#303030] rounded-xl p-4 h-14 flex">
        <input 
          className="focus:outline-none text-white flex-grow" placeholder="Hỏi tôi về đình, đền, chùa Việt Nam"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage.mutate({
                conversationId,
                message: inputValue
              });
            }
          }}
        />
        <button className="opacity-30 hover:opacity-100 hover:cursor-pointer">
          <img src={Micro} className="h-full aspect-square" />
        </button>
      </div>
    </div>
  )
}

export default ChatWindow;