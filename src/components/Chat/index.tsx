import { useEffect, useRef, useState } from "react";
import SendMessage from "../../assets/send-message.png";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getToken } from "../../utils/localStorage";

const apiUrl = 'http://host.docker.internal:9000';

const createConver = async (data) => {
  const token = getToken();
  const config = {
    headers: {}
  };
  if (token) config.headers = {
    Authorization: `Bearer ${getToken()}`
  };
  return axios.post(`${apiUrl}/chatbot/conversation`, data, config);
}

const createMessage = async (data) => {
  return axios.post(`${apiUrl}/chatbot/message`, data);
}

const getConversation = async (id) => {
  return axios.get(`${apiUrl}/chatbot/conversation/${id}`);
}

const ChatWindow = ({ conversationId, setConversationId }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isWaiting, setIsWaiting] = useState(false);

  const { data: conversation, refetch } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversation(conversationId),
    enabled: !!conversationId,
    refetchInterval: 1500
  });

  const sendMessage = useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      setInputValue("");
      refetch();
    }
  });

  const createConversation = useMutation({
    mutationFn: createConver
  });

  const handleSendMessage = (message: string) => {
    if (message.length == 0) return;
    if (conversationId.length == 0) {
      createConversation.mutate({
        firstMessage: message
      }, {
        onSuccess: (response) => {
          const newConversationId = response.data._id;
          setConversationId(newConversationId);
          sendMessage.mutate({
            conversationId: newConversationId,
            message
          });
        }
      });
    } else {
      sendMessage.mutate({
        conversationId,
        message
      });
    }
  }

  useEffect(() => {
    if (scrollRef.current && isWaiting) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    const data = conversation?.data?.messages || [];
    if (data.length % 2 === 1) setIsWaiting(true);
    else setIsWaiting(false);
  }, [conversation?.data?.messages, isWaiting]);
  
  return (
    <div 
      className="w-full flex flex-col justify-center p-4"
      style={{
        height: `calc(100% - 56px)`
      }}
    >
      <div className="flex-grow flex flex-col gap-4 overflow-y-auto pb-4 hide-scrollbar" ref={scrollRef}>
        {(conversation?.data.messages || []).map(item => (
          <>
            <div className={"w-full flex " + (item.role === "user" ? "justify-end" : "")}>
              <div className={"w-10/12 bg-[#303030] text-white p-4 rounded-md flex flex-col "}>
                <span>{item.message}</span>
                {item.extra && item.role !== "user" && <span>Bạn có muốn tôi giải đáp các câu hỏi:</span>}
                {item.extra.slice(0,3).map((ex, index) => (
                  <a className="hover:cursor-pointer hover:text-blue-600" onClick={() => handleSendMessage(ex)}>{index+1}. {ex}</a>
                ))}
                {item.extra && item.role !== "user" && item.extra.slice(3).length && <span>Bạn có thể tìm thêm thông tin ở các nguồn:</span>}
                {item.extra.slice(3).map((ex, index) => (
                  <a className="hover:cursor-pointer hover:text-blue-600" href={ex} target="_blank" rel="noopener noreferrer">{index+1}. {ex}</a>
                ))}
              </div>
            </div>
          </>
        ))}
        {isWaiting && (
          <div className="w-full flex ">
            <div className={"w-10/12 bg-[#303030] text-white p-4 rounded-md flex flex-col "}>
              <span>Đang tìm kiếm câu trả lời ...</span>
            </div>
          </div>
        )}
      </div>
      <div className="bg-[#303030] rounded-xl p-4 h-14 flex">
        <input 
          className="focus:outline-none text-white flex-grow" placeholder="Hỏi tôi về đình, đền, chùa Việt Nam"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage(inputValue);
            }
          }}
          disabled={isWaiting}
        />
        <button className={(inputValue.length > 0 ? "hover:cursor-pointer" : "opacity-30")} disabled={inputValue.length === 0} onClick={() => handleSendMessage(inputValue)}>
          <img src={SendMessage} className="h-full" />
        </button>
      </div>
    </div>
  )
}

export default ChatWindow;