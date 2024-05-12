
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { HiOutlineDotsVertical } from "react-icons/hi";

const MessageGroup = () => {
    const db = getDatabase();
    const data = useSelector((state) => state.userLoginInfo.userInfo)


    // ==== get input value ====
    const [groupName, setGroupName] = useState("");
    const [groupIntro, setGroupIntro] = useState("");

    const [groupNameError, setGroupNameError] = useState("");
    const [groupIntroError, setGroupIntroError] = useState("");

    const [groupList, setGroupList] = useState([]);
    console.log(groupList)

    const handleGroupName = (e) =>{
        setGroupName(e.target.value)
        setGroupNameError("")
    }
    const handleGroupIntro = (e) =>{
        setGroupIntro(e.target.value)
        setGroupIntroError("")
    }

    

// ==== get group list start ====
useEffect(()=>{
    const groupRef = ref(db, "group");
    onValue(groupRef, (snapshot)=>{
        let list = [];
        snapshot.forEach((item)=>{
            list.push({...item.val(), id: item.key});
        })
        setGroupList(list)
    })
},[])
// ==== get group list end ====

    return (
        <div className="list mb-6 relative">
            <div className="title w-full sticky top-0 left-0 py-3 bg-red-100">
                <h2>Group List</h2>
                <div>
                <HiOutlineDotsVertical />
                </div>
            </div>

            <div>
                    {
                        groupList.map((item, i) => {
                            return(
                                <div key={i} className="flex justify-between items-center mb-3 pb-3 border-b-2 border-blue-500">
                                 <div className="flex gap-3 items-center">
                                        <div className="h-[65px] w-[65px] bg-orange-400 rounded-full overflow-hidden">
                                            <img className="w-full" src="" alt="" />
                                        </div>
                                        <div>
                                            <h2 className="text-base text-rose-500 font-semibold">Admin:{item.adminName}</h2>
                                            <h2 className="font-semibold text-lg text-teal-500">{item.groupName}</h2>
                                            <h2 className="text-gray-500">{item.groupIntro}</h2>
                                        </div>
                                    </div>
                                    <div>
                                        <button className="button_v_3">Message</button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
        </div>
    );
};

export default MessageGroup;