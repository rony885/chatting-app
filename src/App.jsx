import { Route, Routes } from "react-router-dom";
import "./App.css";
import Registration from "./pages/registration/Registration";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Chat from "./pages/chat/Chat";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";

// import { ToastContainer} from 'react-toastify';

function App() {
  return (
    <>
      {/* <ToastContainer position="top-center" /> */}
      <Routes>
        <Route path="/" element={<Registration></Registration>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/home" element={<Home></Home>}></Route>
        <Route
          path="/forgotPassword"
          element={<ForgotPassword></ForgotPassword>}
        ></Route>
        <Route path="/chat" element={<Chat></Chat>}></Route>
      </Routes>
    </>
  );
}

export default App;
