import { HiOutlineDotsVertical } from "react-icons/hi";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProfilePicture from "./ProfilePicture";
import { IoIosSearch } from "react-icons/io";


const UserList = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.userLoginInfo.userInfo);

  let [userList, setUserList] = useState([]);
  let [friendRequestList, setFriendRequestList] = useState([]);
  let [friendList, setFriendList] = useState([]);
  let [searchUser, setSearchUser] = useState([]);

  // === get user list from users collection start ===
  useEffect(() => {
    const userRef = ref(db, "users");
    onValue(userRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (data.uid !== item.key) {
          list.push({ ...item.val(), id: item.key });
        }
      });
      setUserList(list);
      // console.log(userList);
    });
  }, []);
  // === get user list from users collection end ===

  // === friend request send start ====
  const handleFriendRequestSend = (item) => {
    // console.log("click", item)
    set(push(ref(db, 'friendRequest')), {
        senderId: data.uid,
        senderName: data.displayName,
        receiverId: item.id,
        recevierName: item.username,
      });
  }

  useEffect(() => {
    const friendRequestRef = ref(db, "friendRequest");
    onValue(friendRequestRef, (snapshot) => {
      let request = [];
      snapshot.forEach((item)=>{
        request.push(item.val().receiverId + item.val().senderId)
      })
      setFriendRequestList(request)
      // console.log(friendRequestList)
    })
  },[])
  // === friend request send end ====

  // === friend list data from friend collection start ===
  useEffect(() => {
    const friendListRef = ref(db, "friends");
    onValue(friendListRef, (snapshot)=>{
      let list = []
      snapshot.forEach((item)=>{
        list.push(item.val().receiverId + item.val().senderId) 
      })
      setFriendList(list)
    })
  }, [])
  // === friend list data from friend collection end ===

  // const userListRemove = (item)=>{
  //   remove(ref(db, "friends/" + item.id))
  //   // console.log(item)
  // }

  // ===== Search start =====
  const handleSearch = (e) => {
    let array = [];
    userList.filter((item) => {
      if(item.username.toLowerCase().includes(e.target.value.toLocaleLowerCase())){
        array.push(item)
      }
    })
    setSearchUser(array)
  }
  // console.log(searchUser)
  // ===== Search end =====

  return (
    <div className="list mb-6">
      <div className="title">
        <h2>User List</h2>
        <div className="relative">
         <input onChange={handleSearch} className="search " type="text" placeholder="Search" />
         <IoIosSearch className="absolute top-[6px] left-0 !text-gray-400 px-1" />
        </div>
        <HiOutlineDotsVertical />
      </div>

      {
        searchUser.length > 0 ?

        searchUser.map((item, i) => {
          // console.log(item);
          return (
           <div key={i}>
                <div  className="flex justify-between items-center mb-3 pb-3 border-b-2 border-blue-500" >
                  <div className="flex gap-3 items-center">
                    <div className="h-[65px] w-[65px] bg-orange-400 rounded-full overflow-hidden">
                      <ProfilePicture key={item.id} imgId={item.id} />
                    </div>
                   <div>
                      <h2 className="font-semibold text-lg text-gray-500"> {item.username} </h2>
                      <h2 className="text-gray-500"> {item.email} </h2>
                   </div>
                  </div>
                  <div>
  
                    {
                      friendList.includes(item.id + data.uid) || friendList.includes(data.uid + item.id) ?
                      <button className="button_v_3">Friend</button>
                      :
                      friendRequestList.includes(item.id+data.uid) || friendRequestList.includes(data.uid + item.id)
                      ?
                      // <div className="flex gap-2">
                      //   <button className="button_v_4">pending</button>
                      //   <button onClick={()=> userListRemove(item)} className="button_v_3">remove</button>
                      // </div>
                      <button className="button_v_3">Pending...</button>
                      : 
                      <button onClick={()=>handleFriendRequestSend(item)} className="button_v_3">Add Friend</button>
                    }
                      
                  </div>
               </div>
           </div>
          );
        })

        :

        userList.map((item, i) => {
          // console.log(item);
          return (
           <div key={i}>
                <div  className="flex justify-between items-center mb-3 pb-3 border-b-2 border-blue-500" >
                  <div className="flex gap-3 items-center">
                    <div className="h-[65px] w-[65px] bg-orange-400 rounded-full overflow-hidden">
                      <ProfilePicture imgId={item.id} />
                      {/* <img className="w-full" src="" alt="" />   */}
                    </div>
                   <div>
                      <h2 className="font-semibold text-lg text-gray-500"> {item.username} </h2>
                      <h2 className="text-gray-500"> {item.email} </h2>
                   </div>
                  </div>
                  <div>
  
                    {
                      friendList.includes(item.id + data.uid) || friendList.includes(data.uid + item.id) ?
                      <button className="button_v_3">Friend</button>
                      :
                      friendRequestList.includes(item.id+data.uid) || friendRequestList.includes(data.uid + item.id)
                      ?
                      // <div className="flex gap-2">
                      //   <button className="button_v_4">pending</button>
                      //   <button onClick={()=> userListRemove(item)} className="button_v_3">remove</button>
                      // </div>
                      <button className="button_v_3">Pending...</button>
                      : 
                      <button onClick={()=>handleFriendRequestSend(item)} className="button_v_3">Add Friend</button>
                    }
                      
                  </div>
               </div>
           </div>
          );
        })
      }

    </div>
  );
};

export default UserList;
