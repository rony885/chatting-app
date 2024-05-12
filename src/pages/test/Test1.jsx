// ****** navbar ******

import { Link, useNavigate } from "react-router-dom";
// import profileImg from "../assets/images/hb.jpg"
import { SlHome } from "react-icons/sl";
import { BsChatDotsFill } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoLogOutSharp } from "react-icons/io5";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux"; 
import { userLoginInfo } from "../slices/userSlice";
import { IoCloudUploadSharp } from "react-icons/io5";
import { Cropper } from "react-cropper";
import { useState, createRef } from "react";
import "cropperjs/dist/cropper.css";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";


const Navbar = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const storage = getStorage();


    // === react cropper start ===
    const [image, setImage] = useState("");
    const [cropData, setCropData] = useState("#");
    const cropperRef = createRef();
    // === react cropper end ===

    // === modal ===
    const [showModal, setShowModal] = useState(false)
    const closeModal = () => {
        setShowModal(false)
    }

    const data = useSelector((state) => state.userLoginInfo.userInfo);
    // console.log(data)

    const handleLogOut = ()=> {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/login")
            dispatch(userLoginInfo(null));
            localStorage.removeItem("user");

          }).catch((error) => {
            // An error happened.
            console.log(error)
          });
    }

    // === react cropper start ===
    const handleProfilePicture = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
          files = e.dataTransfer.files;
        } else if (e.target) {
          files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
      };

      const getCropData = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
          setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
          // console.log(cropData)
          const storageRef = ref(storage, auth.currentUser.uid);
          const message4 = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
          uploadString(storageRef, message4, 'data_url').then((snapshot) => {
          //  console.log('Uploaded a data_url string!');

           getDownloadURL(storageRef) .then((downloadURL) => {
             console.log(downloadURL)

             dispatch(userLoginInfo({...data, photoURL:downloadURL}));

             localStorage.setItem("user", JSON.stringify({...data, photoURL:downloadURL}));

             setShowModal(false)
            })
        
          });

        }
      };

    // === react cropper end ===

    return (
        <nav id="navbar" className="bg-indigo-500 py-1">
            <div className="container mx-auto flex justify-between items-center">

                <div className="profileAndName">

                    <div className="img relative cursor-pointer group">
                        <img src={data.photoURL} className="w-full" alt="Profile_Picture" />
                     {/* <h2 className="defaultProfilePic group-hover:opacity-0">{data?.displayName[0]}</h2>  */}
                     <div onClick={() => setShowModal(true)} className="overlay hidden group-hover:block">
                     <IoCloudUploadSharp />
                     </div>
                    </div>

                    <h2>{data?.displayName}</h2>
                </div>

                <div className="menu_item flex gap-6">
                    <Link to="/home"> <SlHome /> </Link>
                    <Link to="/chat"> <BsChatDotsFill /> </Link>
                    <Link to="/"> <IoMdNotificationsOutline /> </Link>
                    <div className="cursor-pointer">
                       <IoLogOutSharp onClick={handleLogOut} />
                    </div>
                </div>
            </div>

            {/* ===== modal start ==== */}
            {
                showModal &&
            <div className="modal">
                <div className="profileImage">
                    <h2>Update Your Profile</h2>
                    <input onChange={handleProfilePicture} className="my-3" type="file" />
                    
                    {/* ===== cropper start ===== */}
                    {
                      image &&
                      <div className="bg-gray-300 h-[100px] w-[100px] mx-auto overflow-hidden my-2 rounded-full">
                       <div className="img-preview w-full h-full mx-auto" />
                      </div>
                    }
                    {/* <div className="bg-gray-300 h-[100px] w-[100px] mx-auto overflow-hidden my-2 rounded-full">
                      <div className="img-preview w-full h-full mx-auto" />
                    </div> */}

                    {
                      image &&
                      <Cropper
                        ref={cropperRef}
                        style={{ height: 400, width: "100%" }}
                        zoomTo={0.5}
                        initialAspectRatio={1}
                        preview=".img-preview"
                        src={image}
                        viewMode={1}
                        minCropBoxHeight={10}
                        minCropBoxWidth={10}
                        background={false}
                        responsive={true}
                        autoCropArea={1}
                        checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                        guides={true}
                      />
                    }
                    {/* ===== cropper end ===== */}
                      
                    <div>
                      <div className="flex gap-8">
                        {
                          image &&
                          <button onClick={getCropData} className="button_v_3">Upload</button>
                        }
                         <button onClick={closeModal} className="button_v_4">Cancel</button>
                      </div>
                    </div>
                </div>
            </div>
            }
           
            {/* ===== modal end ==== */}

        </nav>
    );
};

export default Navbar;