import ModalImage from "react-modal-image";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { GrGallery } from "react-icons/gr";
import { AiFillAudio } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useState } from "react";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import {
  getStorage,
  ref as sref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useEffect } from "react";
const imageUrl =
  "https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630";

const Chating = () => {
  const db = getDatabase();
  const storage = getStorage();

  const activeChatName = useSelector((state) => state.activeChatSlice);
  // console.log(activeChatName.active.id)

  const data = useSelector((state) => state.userLoginInfo.userInfo);

  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  // console.log(messageList.length)
  // console.log(activeChatName.active.id)

  // ===================== handle message start =======================
  const handleMessageSend = () => {
    if (activeChatName.active.status == "single") {
      set(push(ref(db, "singleMessage")), {
        whoSendId: data.uid,
        whoSendName: data.displayName,
        whoReceiveId: activeChatName.active.id,
        whoReceiveName: activeChatName.active.name,
        Message: message,
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()},${new Date().getHours() % 12 || 12} :
                ${new Date().getMinutes()} ${
          new Date().getHours() >= 12 ? "PM" : "AM"
        }`,
      })
        .then(() => {
          setMessage("");
          console.log("mgs gesa");
        })
        .catch((error) => {
          console.log("not send");
        });
    } else {
      console.log("group");
    }
  };

  useEffect(() => {
    onValue(ref(db, "singleMessage"), (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        console.log(item.val());

        if (
          (item.val().whoSendId == data.uid &&
            item.val().whoReceiveId == activeChatName.active.id) ||
          (item.val().whoReceiveId == data.uid &&
            item.val().whoSendId == activeChatName.active.id)
        ) {
          array.push(item.val());
        }
      });
      setMessageList(array);
    });
  }, [activeChatName.active?.id]);
  // ====================== handle message end ========================

  // ====================== handleImgUpload Start ========================
  const handleImgUpload = (e) => {
    // console.log(e.target.files[0].name)
    const storageRef = sref(storage, e.target.files[0].name);
    const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.log("donot upload", error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.log('File available at', downloadURL);
          set(push(ref(db, "singleMessage")), {
            whoSendId: data.uid,
            whoSendName: data.displayName,
            whoReceiveId: activeChatName.active.id,
            whoReceiveName: activeChatName.active.name,
            Image: downloadURL,
            date: `${new Date().getFullYear()}-${
              new Date().getMonth() + 1
            }-${new Date().getDate()},${new Date().getHours() % 12 || 12} :
                    ${new Date().getMinutes()} ${
              new Date().getHours() >= 12 ? "PM" : "AM"
            }`,
          });
        });
      }
    );
  };
  // ================= handleImgUpload end ===================

  return (
    <>
      {activeChatName.active == null ? (
        <h1>No Active Chat</h1>
      ) : (
        <div className="relative h-[700px] overflow-y-scroll border-2 border-blue-500 rounded-lg px-6 mt-2">
          {/* ==================== identify start ===================== */}
          <div className="sticky z-10 top-0 left-0 flex items-center gap-3 bg-white border-b-2 mb-3 border-blue-500 py-2">
            <div className="h-[65px] w-[65px] overflow-hidden bg-blue-500 rounded-full">
              <img src="" alt="" />
            </div>
            <div>
              <h2 className="text-base font-bold capitalize">
                {activeChatName.active?.name}
              </h2>
              <p className="text-gray-600 text-base">Online</p>
            </div>
          </div>
          {/* ===================== identify end ===================== */}

          {activeChatName.active?.status == "single" ? (
            messageList.map((item, i) => {
              return item.whoSendId == data.uid ? (
                item.Message ? (
                  /* ==== send message start ====  */
                  <div key={i} className="text-right my-3">
                    <div className="bg-blue-500 inline-block rounded-lg py-1 px-3">
                      <p className="text-white text-left">{item.Message}</p>
                    </div>
                    <p className="text-gray-500 text-sm">{item.date}</p>
                  </div>
                ) : (
                  /* ==== send message end ==== */
                  /* ==== send image start ====  */
                  <div className="text-right my-3">
                    <div className="bg-blue-500 inline-block rounded-lg p-1">
                      <ModalImage
                        className="rounded h-[150px]"
                        small={item.Image}
                        large={item.Image}
                        alt={imageUrl}
                      />
                    </div>
                    <p className="text-gray-500 text-sm">{item.date}</p>
                  </div>
                )
              ) : /* ==== send image end ====  */
              item.Message ? (
                /* ==== receive message start ====  */
                <div key={i} className="text-left">
                  <div className="bg-gray-200 inline-block rounded-lg py-1 px-3">
                    <p className="text-black text-left">{item.Message}</p>
                  </div>
                  <p className="text-gray-500 text-sm">{item.date}</p>
                </div>
              ) : (
                /* ==== receive message end ==== */
                /* ==== receive image start ====  */
                <div className="text-left">
                  <div className="bg-gray-200 inline-block rounded-lg p-1">
                    <ModalImage
                      className="h-[150px]"
                      small={item.Image}
                      large={item.Image}
                      alt="Hello World!"
                    />
                  </div>
                  <p className="text-gray-500 text-sm">{item.date}</p>
                </div>
              );
              /* ==== receive image end ====  */
            })
          ) : (
            <h1>Group</h1>
          )}

          {/* ===================================== ***** ================================ */}
          <div className="w-full sticky left-0 bottom-0 flex justify-between items-center gap-3 bg-white">
            <div className="flex justify-between gap-3 items-center bg-gray-200 w-full rounded-lg mb-1">
              <div className="w-full">
                <input
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                  type="text"
                  placeholder="Type message"
                  className="input w-full border border-blue-500 rounded-xl outline-none p-1"
                />
              </div>
              <div className="flex items-center">
                <button className="rounded-lg font-semibold text-2xl text-blue-500">
                  <MdOutlineEmojiEmotions />
                </button>
                <button className="rounded-lg font-semibold text-2xl text-blue-500">
                  <AiFillAudio />
                </button>
                <label>
                  <input
                    onChange={handleImgUpload}
                    type="file"
                    className="hidden"
                  />
                  <GrGallery className="rounded-lg font-semibold text-2xl text-blue-500 mr-2" />
                </label>
              </div>
            </div>
            <div>
              <button
                onClick={handleMessageSend}
                className="bg-blue-500 px-4 py-2 rounded-md font-semibold text-white outline-none"
              >
                <IoSend />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chating;
