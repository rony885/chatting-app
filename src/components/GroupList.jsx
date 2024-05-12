// import { HiOutlineDotsVertical } from "react-icons/hi";

import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const GroupList = () => {
    const db = getDatabase();
    const data = useSelector((state) => state.userLoginInfo.userInfo)
    //==== show Modal ====
    const [show, setShow] = useState(false);

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

    // ==== create group start ====
    const handleCreateGroup = () => {
        if(groupName == ""){
            setGroupNameError("Group Name is Required")
        }
        else if(groupIntro == ""){
            setGroupIntroError("Group intro is Required")
        }
        else{
            set(push(ref(db, "group")), {
                groupName: groupName,
                groupIntro: groupIntro,
                adminName: data.displayName,
                adminId: data.uid
            })         
            .then(()=>{
                toast.success("Group Created")
                setShow(false)
                setGroupName("")
                setGroupIntro("")
            })
        }
    }
 // ==== create group end ====

// ==== get group list start ====
useEffect(()=>{
    const groupRef = ref(db, "group");
    onValue(groupRef, (snapshot)=>{
        let list = [];
        snapshot.forEach((item)=>{
            if(data.uid !== item.val(). adminId){
                list.push({...item.val(), id: item.key});
            }
        })
        setGroupList(list)
    })
},[])
// ==== get group list end ====

// ==== handle group join start ====
const handleGroupJoin = (item)=> {
    set(push(ref(db, "groupJoinRequest")), {
        groupId: item.id,
        groupName: item.groupName,
        adminId: item.adminId,
        adminName: item.adminName,
        groupIntro: item.groupIntro,
        userId: data.uid,
        userName: data.displayName,
    }) .then(() => {
        toast.success("request send")
    })
    console.log(item)
}
// ==== handle group join end ====

    return (
        <div className="list mb-6">
            <div className="title">
                <h2>Group List</h2>
                {/* <HiOutlineDotsVertical /> */}
                <button onClick={() => setShow(!show)} className="button_v_5 w-auto outline-none">{show? "Cancel" : "Create Group"}</button>
            </div>

            {
                show?
                <div className="bg-blue-500 p-3 rounded-lg">
                 <input onChange={handleGroupName} type="text" placeholder="Group Name" className="w-full p-1 rounded outline-none mb-2" />
                 <p className="text-red-500 mb-2">{groupNameError}</p>
                 <input onChange={handleGroupIntro} type="text" placeholder="Group Intro" className="w-full p-1 rounded outline-none" />
                 <p>{groupIntroError}</p>
                 <button onClick={handleCreateGroup}  className="button_v_5 mt-3">Create</button>
                </div>
                :
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
                                        <button onClick={()=> handleGroupJoin(item)} className="button_v_3">Join</button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            }





        </div>
    );
};

export default GroupList;