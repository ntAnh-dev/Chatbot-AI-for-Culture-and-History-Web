import axios from "axios";
import { useEffect, useState } from "react";

type Message = {
  role: string;
  content: string;
}

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [value, setValue] = useState("");

  const handleQuestion = () => {
    const url = "http://127.0.0.1:8000/question";
    axios.post(url, {
      question: value
    }).then((response) => {
      setMessages([...messages, {
        role: "chatbot", 
        content: response.data.answer
      }]);
    }).catch((error) => {
      console.log(error);
    })
  }

  const handleEnter = () => {
    setMessages([...messages, {
      role: "user",
      content: value
    }]); 
    setValue(""); 
  }

  useEffect(() => {
    if (value !== "") {
      handleQuestion();
    }
  }, [value]);
 
  return (
    <div className="w-screen h-dvh bg-black flex flex-col p-5 gap-5">
      <div className="flex-grow flex flex-col gap-2">
        {messages.map((message, index) => 
          <div key={index} className={"p-2 bg-white rounded-sm w-1/2 " + (message.role === "user" ? "self-end" : "")}>
            {message.content}
          </div>
        )}
      </div>
      <input 
        type="text" placeholder="Type your message"
        className="w-full p-2 bg-white rounded-sm" 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
        onKeyDown={(e) => { 
          if (e.key === "Enter") { 
            handleEnter();
          }
        }} 
      />
    </div>
  )
}

export default ChatWindow;