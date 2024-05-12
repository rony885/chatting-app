import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useEffect, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useSelector } from "react-redux";
import ProfilePicture from "./ProfilePicture";

const BlockedUsers = () => {
  const [blockList, setBlockList] = useState([]);
  const db = getDatabase();
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  // ==== get block start ====
  useEffect(() => {
    const blockRef = ref(db, "block");
    onValue(blockRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (data.uid == item.val().blockById) {
          list.push({
            id: item.key,
            block: item.val().block,
            blockId: item.val().blockId,
          });
        } else {
          list.push({
            id: item.key,
            blockBy: item.val().blockBy,
            blockById: item.val().blockById,
          });
        }
      });
      setBlockList(list);
    });
  }, []);
  // ==== get block end ====

  // === handleUnBlock start ===
  const handleUnBlock = (item) => {
    set(push(ref(db, "friends")), {
      senderId: item.blockId,
      senderName: item.block,
      receiverId: data.uid,
      recevierName: data.displayName,
    }).then(() => {
      remove(ref(db, "block/" + item.id));
    });
  };
  // === handleUnBlock end ===

  return (
    <div className="list mb-6">
      <div className="title">
        <h2>Blocked User</h2>
        <HiOutlineDotsVertical />
      </div>
      {blockList.map((item, i) => {
        console.log("dfgf", item);
        return (
          <div
            key={i}
            className="flex justify-between items-center mb-3 pb-3 border-b-2 border-blue-500"
          >
            <div className="flex gap-3 items-center">
              <div className="h-[65px] w-[65px] bg-orange-400 rounded-full overflow-hidden">
                {/* <img className="w-full" src="" alt="" /> */}
                {item.blockById ? (
                  <ProfilePicture imgId={item.blockById} />
                ) : (
                  <ProfilePicture imgId={item.blockId} />
                )}
              </div>
              <div>
                <h2 className="font-semibold text-lg text-gray-500">
                  {item.block ? item.block : item.blockBy}
                </h2>
                {/* <h2 className="font-semibold text-lg text-gray-500">{item.blockBy}</h2> */}
                <h2 className="text-gray-500">rony@gmail.com</h2>
              </div>
            </div>
            <div>
              {item.blockById ? (
                <button className="button_v_3">I block you</button>
              ) : (
                <button
                  onClick={() => handleUnBlock(item)}
                  className="button_v_5"
                >
                  Unblock
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BlockedUsers;
