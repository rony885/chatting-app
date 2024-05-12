import { getDatabase, onValue, push, ref, remove, set, } from "firebase/database";
import { useEffect, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useSelector } from "react-redux";
import ProfilePicture from "./ProfilePicture"

const MyGroup = () => {
    const db = getDatabase();
    const data = useSelector((state) => state.userLoginInfo.userInfo);
    const [groupList, setGroupList] = useState([]);

    const [showRequest, setShowRequest] = useState(false);  
    const [groupJoinRequestList, setGroupJoinRequestList] = useState([]) ; 
    
    const [showGroupInfo, setShowGroupInfo] = useState(false)
    const [groupMembers, setGroupMembers] = useState([])

    // ==== get mygroup start ====
    const groupRef = ref(db, "group")
    useEffect(() =>{
        onValue(groupRef, (snapshot) => {
            let list = []
            snapshot.forEach((item) => {
                if(data.uid == item.val(). adminId){
                    list.push({...item.val(), key: item.key});
                }
            })
            setGroupList(list)
        })
    }, [])
    // ==== get mygroup end ====

    // ==== handle group delete start ====
    const handleGroupDelete = (item) => {
        remove(ref(db, "group/" + item.key))
    }
    // ==== handle group delete end ====

    // ==== handle group request start ====
    const handleGroupRequest = (group) => {
        setShowRequest(!showRequest)
        
        const groupJoinRequestRef = ref(db, "groupJoinRequest");
        onValue(groupJoinRequestRef, (snapshot)=> {
            let list = [];
            snapshot.forEach((item) => {
                if(data.uid == item.val(). adminId && item.val().groupId == group.key){
                    list.push({...item.val(), key: item.key})
                }
            })
            setGroupJoinRequestList(list)
        })
        // console.log(groupJoinRequestList)
    }
    // ==== handle group request end ====

    // ==== handle group requestAccept start ====
    const handleGroupRequestAccept = (item) => {
        set(push(ref(db, "groupMembers")), {
            groupId: item.groupId,
            groupName: item.groupName,
            adminId: item.adminId,
            adminName: item.adminName,
            userId: item.userId,
            userName: item.userName,
        }) .then(() => {
            remove(ref(db, "groupJoinRequest/" + item.key))
        })
    }
    // ==== handle group requestAccept end ====

    // ==== handle group requestReject start ====
    const handleGroupRequestReject = (item) => {
        remove(ref(db, "groupJoinRequest/" + item.key))
    }
    // ==== handle group requestReject end ====

    // ==== handle groupInfo start  ====
    const handleGroupInfo = (itemInfo) => {
        setShowGroupInfo(!showGroupInfo)

        const groupMemberRef = ref(db, "groupMembers");
        onValue(groupMemberRef, (snapshot) =>{
            let list = [];
            snapshot.forEach((item) => {
                if(data.uid == itemInfo.adminId && item.val().groupId == itemInfo.key){
                    list.push({...item.val(), key: item.key})
                }
            })
            setGroupMembers(list)
        })
    }
    // ==== handle groupInfo end  ====

    // ==== handle groupInfo reject start  ====
    const handleGroupInfoReject = (item)=>{
        remove(ref(db, "groupMembers/" + item.key))
    }
    // ==== handle groupInfo reject end  ====

    return (
        <div className="list mb-6">
            <div className="title">
                <h2>My Groups</h2>
                <HiOutlineDotsVertical />
            </div>

            <div>
                {
                    groupList.length == 0 ?
                    <h2 className="text-lg text-rose-500 font-semibold text-center capitalize">No Group Available</h2>
                    :
                    showRequest ?
                    <div className="bg-blue-500 rounded-lg px-12 py-10 relative">
                        <button onClick={()=> setShowRequest(!showRequest)} className="button_v_4 absolute top-2 right-2 w-auto">Close</button>
                        {
                            groupJoinRequestList.map((item, i) => {
                                return(
                                    <div key={i} className="flex justify-between items-center mb-3 pb-3 border-b-2 border-blue-500 bg-white p-5 rounded-lg mt-5">
                                    <div className="flex gap-3 items-center mr-3">
                                        <div className="h-[65px] w-[65px] bg-orange-400 rounded-full overflow-hidden flex justify-center items-center">
                                            <ProfilePicture imgId={item.userId} />
                                        </div>
                                        <div>
                                            <h2 className="font-semibold  text-teal-500">{item.groupName}</h2>
                                            <h2 className="font-semibold text-yellow-500">{item.userName}</h2>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={()=> handleGroupRequestAccept(item)} className="button_v_2">Accept</button>
                                        <button onClick={()=> handleGroupRequestReject(item)} className="button_v_4">Reject</button>
                                    </div>
                                </div>
                                )
                            })
                        }

                    </div>
                    :
                    // ==== showGroupInfo start ====
                    showGroupInfo ?
                    
                    <div className="bg-blue-500 rounded-lg px-12 py-10 relative">
                    <button onClick={()=> setShowGroupInfo(!showGroupInfo)} className="button_v_4 absolute top-2 right-2 w-auto">Close</button>
                    
                    {
                        groupMembers.map((item, i) => {
                            return(
                                <div key={i} className="flex justify-between items-center mb-3 pb-3 border-b-2 border-blue-500 bg-white p-5 rounded-lg mt-5">
                                <div className="flex gap-3 items-center mr-3">
                                    <div className="h-[65px] w-[65px] bg-orange-400 rounded-full overflow-hidden flex justify-center items-center">
                                        <ProfilePicture imgId={item.userId} />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold  text-teal-500">{item.groupName}</h2>
                                        <h2 className="font-semibold text-yellow-500">{item.userName}</h2>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={()=> handleGroupRequestAccept(item)} className="button_v_2">Accept</button>
                                    <button onClick={()=> handleGroupInfoReject(item)} className="button_v_4">Reject</button>
                                </div>
                            </div>
                            )
                        })
                    }

                    </div>
                 // ==== showGroupInfo end ====
                    
                    :

                    groupList.map((item, i) => {
                        return(
                            <div key={i} className="flex justify-between items-center mb-3 pb-3 border-b-2 border-blue-500">
                            <div className="flex gap-3 items-center">
                                <div className="h-[65px] w-[65px] bg-orange-400 rounded-full overflow-hidden flex justify-center items-center">
                                    <h2 className="text-xl font-bold text-white">{item.groupName[0]}</h2>
                                    {/* <img className="w-full" src="" alt="" /> */}
                                </div>
                                <div>
                                    <h2 className="font-bold text-base text-rose-500">Admin:{item.adminName}</h2>
                                    <h2 className="font-semibold  text-teal-500">{item.groupName}</h2>
                                    <h2 className="text-gray-500">{item.groupIntro}</h2>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={()=> handleGroupInfo(item)} className="button_v_3">Info</button>
                                <button onClick={()=> handleGroupRequest(item)} className="button_v_5">Request</button>
                                <button onClick={()=> handleGroupDelete(item)} className="button_v_4">Delect</button>
                            </div>
                        </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default MyGroup;