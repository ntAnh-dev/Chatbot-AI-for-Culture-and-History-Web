import ChatWindow from "./components/Chat"
import Topbar from "./components/Topbar"

function App() {

  return (
    <div className='w-screen h-dvh flex relative bg-[#212121]'>
      <div className="flex-grow h-full flex flex-col">
        <Topbar />
        <ChatWindow />
      </div>
    </div>
  )
}

export default App


//         | Topbar
// Sidebar |_________
//         | Main