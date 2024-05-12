

import Lottie from "lottie-react";
import loginAnimation from "../../../public/animation/login.json"
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Buttons_v_1 } from "../../components/Buttons";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from 'react-toastify';
import { RotatingLines } from 'react-loader-spinner'

const Login = () => {
    const auth = getAuth();

    const navigate = useNavigate()

    //input information
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    // const [rePassword, setRePassword] = useState("")

    // innput error
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    // const [rePasswordError, setRePasswordError] = useState("")

     // email & name regex
     const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    // show icon
    const [showPassword, setShowPassword] = useState("false")
    !showPassword

    // const [showRePassword, setShowRePassword] = useState("false")
    // !showPassword

    // loader
    const [loader, setLoader] = useState(false);

    // login start
    const handleSubmit = (e) =>{
        e.preventDefault()
        if(!email){
            setEmailError("required email")
        } else if (!emailRegex.test(email)) {
            setEmailError("Email is not valid");
        } 
        else if(!password){
            setPasswordError("password required")
        } 
        // else if(!rePassword){
        //     setRePasswordError("confirm password required")
        // }
        else{
            setLoader(true)
            signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;

            console.log(user)
            toast.success("successfully")
            setLoader(false)
            navigate("/home")

           })
          .catch((error) => {
            setLoader(false)
            const errorCode = error.code;
            const errorMessage = error.message;
         
            console.log(errorCode)
            console.log(errorMessage)
          });
        }
    }

    return (
        <div className="login bg-green-100 py-5">
            <div className="container mx-auto flex justify-between flex-wrap items-center">
            

                <div className="w-[40%] login-form shadow-lg">
                    <h2>Log In</h2>
                    <form onSubmit={handleSubmit} action="">
                        <input onChange={(e)=> {setEmail(e.target.value); setEmailError("");}} value={email} type="email" placeholder="Email" />
                        <p>{emailError}</p>

                        <div className="relative">
                         <input onChange={(e) => {setPassword(e.target.value); setPasswordError("");}} value={password} type={showPassword? "password":"text"} placeholder="Password" />
                         {
                            showPassword?
                            <FaEyeSlash onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-3 text-blue-500 text-2xl cursor-pointer" />
                            :
                            <FaEye onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-3 text-blue-500 text-2xl cursor-pointer"  />
                         }
                        </div>
                        <p>{passwordError}</p>
                        
                        {/* <div className="relative">
                         <input onChange={(e) => {setRePassword(e.target.value); setRePasswordError("")}} value={rePassword} type={showRePassword? "password":"text"} placeholder="Confirm Password" />
                         {
                            showRePassword?
                            <FaEyeSlash onClick={() =>setShowRePassword(!showRePassword)} className="absolute right-2 top-3 text-blue-500 text-2xl cursor-pointer" />
                            :
                            <FaEye onClick={() =>setShowRePassword(!showRePassword)} className="absolute right-2 top-3 text-blue-500 text-2xl cursor-pointer" />
                         }
                        </div>
                        <p>{rePasswordError}</p> */}
                        
                        {
                         loader?
                         <div className="flex justify-center">
                         <RotatingLines />
                         </div>
                         :
                         <Buttons_v_1 type="submit">Submit</Buttons_v_1>
                        }
                        <p className="text-slate-500">New here? please<Link to="/" className="text-blue-500 font-semibold ml-2">Sign Up</Link></p>
                    </form>
                </div>
                <div className="w-[45%]">
                    <h1 className="mt-7">Welcome to Chat-Login</h1> 
                    <Lottie animationData={loginAnimation} className="w-full" />
                </div>
            </div>
        </div>
    );
};

export default Login;






// import Lottie from "lottie-react";
// import LoginAnimation from '../../../public/animation/login.json'
// import {Buttons_v_1} from "../../components/Buttons";
// import { useState } from "react";
// import { FaEyeSlash, FaEye } from "react-icons/fa";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// import { RotatingLines } from 'react-loader-spinner'
// import { Link, useNavigate } from "react-router-dom";


// const Login = () => {
//     const auth = getAuth();
    
//     const navigate = useNavigate();
    
//     // input information
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");


//     // email regex
//     const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
//     // loader
//     const [loader, setLoader] = useState(false);

//     // show icon
//     const [showPassword, setShowPassword] = useState(true);
//     !showPassword

//     // input error
//     const [emailError, setEmailError] = useState("");
//     const [passwordError, setPasswordError] = useState("");


//     // input value start
//     const handleEmail = (e) => {
//         setEmail(e.target.value);
//         setEmailError("")
//     }
//     const handlePassword = (e) =>{
//         setPassword(e.target.value);
//         setPasswordError("")
//     }

//     // registration start
//     const handleSubmit = (e) => {
//         e.preventDefault();

//         if (!email) {
//             setEmailError("Email is required");
//         } else if (!emailRegex.test(email)) {
//             setEmailError("Email is not valid");
//         }
//          else if (!password) {
//             setPasswordError("Password is required");
//         }
//         else{
//             setLoader(true)
//             signInWithEmailAndPassword(auth, email, password)
//             .then((userCredential) => {
//                 // Signed up 
//                 const user = userCredential.user;
//                 toast.success("successfully")
//                 console.log(user)
//                 setLoader(false)
//                 navigate("/home")
//             })
//             .catch((error) => {
//                 setLoader(false)
//                 const errorCode = error.code;
//                 const errorMessage = error.message;
            
//                 if (errorCode === "auth/invalid-email") {
//                     setEmailError("Invalid email");
//                     toast.error("Invalid email");
//                 } else if (errorCode === "auth/user-not-found") {
//                     setEmailError("User not found");
//                     toast.error("User not found");
//                 } else if (errorCode === "auth/wrong-password") {
//                     setPasswordError("Wrong password");
//                     toast.error("wrong password");
//                 } else {
//                     // Handle other error cases
//                     toast.error("Authentication failed. Please try again.");
//                 }
//             });
//         //  toast.success("successfully")
//         }
//     };


//     return (
//         <div className="registation bg-green-100">
//             <div className="container mx-auto flex justify-between flex-wrap items-center">
            
//                 <div className="w-[40%] registration-form shadow-lg ">
//                  <h2>Sign Up</h2>

//                  <form onSubmit={ handleSubmit} >

//                     <input onChange={handleEmail} value={email} type="email" placeholder="email" />
//                     <p>{emailError}</p>

//                     <div className="relative">
//                      <input onChange={handlePassword} value={password} type={showPassword? "password" :"text"} placeholder="password" />
//                      {
//                         showPassword?
//                         <FaEyeSlash onClick={()=> setShowPassword(!showPassword)} className="absolute right-2 top-3 text-blue-500 text-2xl cursor-pointer" />
//                         :
//                         <FaEye onClick={()=> setShowPassword(!showPassword)} className="absolute right-2 top-3 text-blue-500 text-2xl cursor-pointer" />
//                      }
//                     </div>
//                     <p>{passwordError}</p>
                     
//                     {
//                         loader?
//                         <div className="flex justify-center">
//                          <RotatingLines />
//                         </div>
//                         :
//                         <Buttons_v_1 type="submit">Submit</Buttons_v_1>
//                     }
//                     <div>
//                      <p className="text-slate-500">New here? please 
//                      <Link to="/" className="text-blue-500 font-semibold ml-2">Sign Up</Link></p>
//                     </div>
//                  </form>
//                 </div>

//                 <div className="w-[45%]">
//                     <h1>Welcome to Chat-App</h1>
//                 <Lottie animationData={LoginAnimation} className="w-full" />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;