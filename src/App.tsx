import { useState } from "react"
import ChatWindow from "./components/Chat"
import Topbar from "./components/Topbar"
import Sidebar from "./components/Sidebar";

function App() {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");

  return (
    <div className='w-screen h-dvh flex relative bg-[#212121]'>
      {isOpenSidebar && <Sidebar isOpenSidebar={isOpenSidebar} setIsOpenSidebar={setIsOpenSidebar} setConversationId={setConversationId} />}
      <div className="flex-grow h-full flex flex-col">
        <Topbar isOpenSidebar={isOpenSidebar} setIsOpenSidebar={setIsOpenSidebar} setConversationId={setConversationId} />
        <ChatWindow conversationId={conversationId} setConversationId={setConversationId} />
      </div>
    </div>
  )
}

export default App


//         | Topbar
// Sidebar |_________
//         | Main