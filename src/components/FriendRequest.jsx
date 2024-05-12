import { HiOutlineDotsVertical } from "react-icons/hi";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ProfilePicture from "./ProfilePicture";

const FriendRequest = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  // console.log(data)

  let [friendRequestList, setFriendRequestList] = useState([]);

  // === get friend request list from friendRequest collection start ===
  useEffect(() => {
    const friendRequestRef = ref(db, "friendRequest");

    onValue(friendRequestRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (item.val().receiverId === data.uid) {
          list.push({ ...item.val(), id: item.key });
        }
      });
      setFriendRequestList(list);
    });
  }, []);
  // === get friend request list from friendRequest collection start ===

  // === friend request accept start ===
  const handleFriendRequestAccept = (item) => {
    // console.log(item)
    set(push(ref(db, "friends")), { ...item }).then(() => {
      remove(ref(db, "friendRequest/" + item.id));
    });
  };
  // === friend request accept end ===

  // ==== friend request cancel start ====
  const handleFriendRequestCancel = (item) => {
    remove(ref(db, "friends/" + item.id));
  };
  // ==== friend request cancel end ====

  return (
    <div className="list mb-6">
      <div className="title">
        <h2>Friend Request</h2>
        <HiOutlineDotsVertical />
      </div>

      <div>
        {friendRequestList.map((item) => {
          return (
            <div
              key={item.id}
              className="flex justify-between items-center mb-3 pb-3 border-b-2 border-blue-500"
            >
              <div className="flex gap-3 items-center">
                <div className="h-[65px] w-[65px] bg-orange-400 rounded-full overflow-hidden">
                  <ProfilePicture imgId={item.senderId} />
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-gray-500">
                    {item.senderName}
                  </h2>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFriendRequestAccept(item)}
                  className="button_v_3"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleFriendRequestCancel(item)}
                  className="button_v_4"
                >
                  Cancele
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FriendRequest;
