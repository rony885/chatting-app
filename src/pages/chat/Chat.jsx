import Navbar from "../../components/Navbar";
import Friends from "../../components/Friends"
import MessageGroup from "../../components/MessageGroup";
import Chating from "../../components/Chating";

const Chat = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className="container mx-auto flex justify-between">
                <div className="w-[30%]">
                    <div className=".chat_friends p-4 border-2 border-blue-500 mb-5 rounded-lg h-[350px] overflow-y-scroll mt-2">
                        <Friends></Friends>
                    </div>
                    <div className="p-4 border-2 border-blue-500 mb-5 rounded-lg h-[350px] overflow-y-scroll mt-2">
                        <MessageGroup></MessageGroup>
                    </div>
                </div>
                <div className="w-[60%]">
                    <Chating></Chating>
                </div>
            </div>
        </div>
    );
};

export default Chat;