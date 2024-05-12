import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
// import { HiOutlineDotsVertical } from "react-icons/hi";
import GroupList from "../../components/GroupList";
import UserList from "../../components/UserList";
import Friends from "../../components/Friends";
import FriendReuest from "../../components/FriendRequest";
import MyGroup from "../../components/MyGroup";
import BlockedUsers from "../../components/BlockedUsers";

const Home = () => {
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  const navigate = useNavigate();

  useEffect(() => {
    if (!data) {
      navigate("/login");
    }
  });

  return (
    <div>
      <Navbar></Navbar>

      <div className="main_content py-7 ">
        {/* ===== grouplist start ===== */}
        <div className="item">
          <GroupList></GroupList>
        </div>
        {/* ===== grouplist end ===== */}

        {/* ===== friends start ===== */}
        <div className="item">
          <Friends></Friends>
        </div>
        {/* ===== friends end ===== */}

        {/* ===== user_list start ===== */}
        <div className="item">
          <UserList></UserList>
        </div>
        {/* ===== user_list end ===== */}

        {/* ===== friends request start ===== */}
        <div className="item">
          <FriendReuest></FriendReuest>
        </div>
        {/* ===== friends request end ===== */}

        {/* ===== Mygroup start =====*/}
        <div className="item">
          <MyGroup></MyGroup>
        </div>
        {/* ===== Mygroup end ===== */}

        {/* ===== Blocked Users start ===== */}
        <div className="item">
          <BlockedUsers></BlockedUsers>
        </div>
        {/* ===== Blocked Users end ===== */}
      </div>
    </div>
  );
};

export default Home;
