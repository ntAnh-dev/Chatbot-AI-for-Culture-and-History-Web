import Micro from "../../assets/mic.png";

const ChatWindow = () => {
 
  return (
    <div className="h-full w-full flex flex-col justify-center p-4">
      <div className="flex-grow flex flex-col">CHAT CONTENT</div>
      <div className="bg-[#303030] rounded-xl p-4 h-14 flex">
        <input className="focus:outline-none text-white flex-grow" placeholder="Hỏi tôi về đình, đền, chùa Việt Nam" />
        <button className="opacity-30 hover:opacity-100 hover:cursor-pointer">
          <img src={Micro} className="h-full aspect-square" />
        </button>
      </div>
    </div>
  )
}

export default ChatWindow;