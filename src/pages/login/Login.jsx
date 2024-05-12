
import Lottie from "lottie-react";
import loginAnimation from "../../../public/animation/login.json"
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Buttons_v_1 } from "../../components/Buttons";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from 'react-toastify';
import { RotatingLines } from 'react-loader-spinner'
import { useDispatch } from "react-redux";
import { userLoginInfo } from "../../slices/userSlice";

const Login = () => {
    const auth = getAuth();

    const navigate = useNavigate()

    // redux dispatch start
    const dispatch = useDispatch()
    // redux dispatch end

    //input information
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // innput error
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")

     // email & name regex
     const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    // show icon
    const [showPassword, setShowPassword] = useState("false")
    !showPassword

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
        else{
            setLoader(true)
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                toast.success("successfully")
                console.log(user)
                setLoader(false)
                
                dispatch(userLoginInfo(user))
                localStorage.setItem('user', JSON.stringify(user));

                navigate("/home")
            })
            .catch((error) => {
                setLoader(false)
                const errorCode = error.code;
                const errorMessage = error.message;

                // console.log(errorCode)
                console.log(errorMessage)
            
                if (errorCode === "auth/invalid-email") {
                    setEmailError("Invalid email");
                    toast.error("Invalid email");
                } else if (errorCode === "auth/user-not-found") {
                    setEmailError("User not found");
                    toast.error("User not found");
                } else if (errorCode === "auth/wrong-password") {
                    setPasswordError("Wrong password");
                    toast.error("wrong password");
                } 
                else {
                    // Handle other error cases
                    toast.error("Authentication failed. Please try again.");
                }
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
                        
                        {
                         loader?
                         <div className="flex justify-center">
                          <RotatingLines color="blue" />
                         </div>
                         :
                         <Buttons_v_1 type="submit">Submit</Buttons_v_1>
                        }
                       <div className="flex justify-between items-center">
                        <p className="text-slate-500">New here? please
                         <Link to="/" className="text-blue-500 font-semibold ml-2">Sign Up</Link>
                         </p>
                         <Link to="/forgotPassword" className="text-blue-500 font-semibold ml-2">Forgot Password</Link>
                       </div>
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



