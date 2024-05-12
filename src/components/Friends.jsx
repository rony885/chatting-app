import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { useEffect, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import ProfilePicture from "./ProfilePicture";
import { activeChat } from "../slices/activeChatSlice";
import { IoIosSearch } from "react-icons/io";

const Friends = () => {

    const db = getDatabase();
    const data = useSelector((state) => state.userLoginInfo.userInfo)
    const dispatch = useDispatch();

    const [friendList, setFriendList] = useState([]);
    // console.log(friendList)
    let [searchUser, setSearchUser] = useState([]);
 
    // === get friend list from friends collection start ===
    useEffect(()=>{
        const friendRef = ref(db, 'friends');
        onValue(friendRef, (snapshot) =>{
            const list = []
            snapshot.forEach((item)=>{
                if(data.uid == item.val(). receiverId || data.uid == item.val().senderId){
                    list.push({...item.val(), id: item.key})
                }
            })
            setFriendList(list)
        })
    }, [])
    // === get friend list from friends collection end ===

    // ==== block start ====
    const handleBlock = (item)=> {
        if(data.uid == item.senderId){
            set(push(ref(db, 'block')), {
                block: item.recevierName,
                blockId: item.receiverId,
                blockBy: item.senderName,
                blockById: item.senderId
            }) .then(()=> {
                remove(ref(db, 'friends/' + item.id))
            })
        }
        else{
            set(push(ref(db, 'block')), {
                block: item.senderName,
                blockId: item.senderId,
                blockBy: item.recevierName,
                blockById: item.receiverId
            }) .then(() => {
                remove(ref(db, 'friends/' + item.id)) 
            })
        }
    }
    // ==== block end ====

    // ==== active friend start ====
    const handleActiveFriend = (item)=> {
        if( item.receiverId == data.uid){
            dispatch(activeChat({status: "single", id:item.senderId, name:item.senderName}))
            localStorage.setItem("activeFriend", JSON.stringify({status: "single", id:item.senderId, name:item.senderName}))
        }
        else{
            dispatch(activeChat({status: "single", id:item.receiverId, name:item.recevierName}))
            localStorage.setItem("activeFriend", JSON.stringify({status: "single", id:item.receiverId, name:item.recevierName}))
        }
        // console.log(item)
    } 
    // ==== active friend end ====

    // ====== search start ======
const handleSearch = (e) => {
    let array = [];
    friendList.filter((item) => {
        // Adjust the property names to match your data structure
        const nameToSearch = data.uid === item.senderId ? item.receiverName : item.senderName;

        if (nameToSearch.toLowerCase().includes(e.target.value.toLowerCase())) {
            array.push(item);
        }
    });
    setSearchUser(array)
    // console.log(searchUser)
}
// ====== search end ======


    return (
        <div className="list mb-6">
            <div className="title">
                <h2>Friends</h2>
                <div className="relative">
                <input onChange={handleSearch} type="text" placeholder="Search" className="search" />
                <IoIosSearch className="absolute top-[10px] left-0 !text-base !text-gray-400 ml-1" />
                </div>
                <HiOutlineDotsVertical />
            </div>

            {
                searchUser.length > 0?
                searchUser.map((item) =>{
                    return(
                        <div onClick={()=> handleActiveFriend (item)} key={item.id} className="flex justify-between items-center mb-3 pb-3 border-b-2 border-blue-500 cursor-pointer">
                        <div className="flex gap-3 items-center">
                            <div className="h-[65px] w-[65px] bg-orange-400 rounded-full overflow-hidden">
                                {/* <img className="w-full" src="" alt="" /> */}
                                <ProfilePicture imgId={data.uid == item.sender ? item.receiverId : item.senderId } />
                            </div>

                            <div>
                                {
                                    data.uid == item.senderId ?
                                    <h2 className="font-semibold text-lg text-gray-500">{item.recevierName}</h2>
                                    :
                                    <h2 className="font-semibold text-lg text-gray-500">{item.senderName}</h2>
                                }
                                <h2 className="text-gray-500">hello....</h2>
                            </div>

                        </div>
                        <div className="flex gap-2">
                            <button className="button_v_3">Unfriend</button>
                            <button onClick={()=> handleBlock(item)} className="button_v_4">Block</button>
                        </div>
                    </div>
                    )
                })
                :
                friendList.map((item) =>{
                    return(
                        <div onClick={()=> handleActiveFriend (item)} key={item.id} className="flex justify-between items-center mb-3 pb-3 border-b-2 border-blue-500 cursor-pointer">
                        <div className="flex gap-3 items-center">
                            <div className="h-[65px] w-[65px] bg-orange-400 rounded-full overflow-hidden">
                                {/* <img className="w-full" src="" alt="" /> */}
                                <ProfilePicture imgId={data.uid == item.sender ? item.receiverId : item.senderId } />
                            </div>

                            <div>
                                {
                                    data.uid == item.senderId ?
                                    <h2 className="font-semibold text-lg text-gray-500">{item.recevierName}</h2>
                                    :
                                    <h2 className="font-semibold text-lg text-gray-500">{item.senderName}</h2>
                                }
                                <h2 className="text-gray-500">hello....</h2>
                            </div>

                        </div>
                        <div className="flex gap-2">
                            <button className="button_v_3">Unfriend</button>
                            <button onClick={()=> handleBlock(item)} className="button_v_4">Block</button>
                        </div>
                    </div>
                    )
                })
            }

            <div>
                {
                   
                }
            </div>

        </div>
    );
};

export default Friends;