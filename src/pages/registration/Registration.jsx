
import Lottie from "lottie-react";
import Animation from '../../../public/animation/registration.json'
import {Buttons_v_1} from "../../components/Buttons";
import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { RotatingLines } from 'react-loader-spinner'
import { Link, useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";


const Registration = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const db = getDatabase();

    
    // input information
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");

    // email & name regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    // const nameRegex = /^[a-zA-Z ]+$/;
    
    // loader
    const [loader, setLoader] = useState(false);

    // show icon
    const [showPassword, setShowPassword] = useState(true);
    !showPassword

    const [showRePassword, setShowRePassword] = useState(true);
    !showRePassword

    // input error
    const [fullNameError, setFullNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [rePasswordError, setRePasswordError] = useState("");

    // input value start
    const handleFullName = (e) => {
        setFullName(e.target.value);
        setFullNameError("")
    }
    const handleEmail = (e) => {
        setEmail(e.target.value);
        setEmailError("")
    }
    const handlePassword = (e) =>{
        setPassword(e.target.value);
        setPasswordError("")
    }
    const handleRePassword = (e) =>{
        setRePassword(e.target.value);
        setRePasswordError("")
    }

    // registration start
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!fullName) {
            setFullNameError("Fullname is required");
        } 
        else if (!email) {
            setEmailError("Email is required");
        } else if (!emailRegex.test(email)) {
            setEmailError("Email is not valid");
        }
         else if (!password) {
            setPasswordError("Password is required");
        }
        else if (!rePassword) {
            setRePasswordError("Confirm password is required");
        }
        else if (password !== rePassword){
            setRePasswordError("password not match")
        }
        // else if(fullName &&  email && emailRegex.test(email) && password && rePassword && password === rePassword){
        //     alert("Everything Okey")
        // }
        else{
            setLoader(true)
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {

                // ==== update profile start ====
                updateProfile(auth.currentUser, {
                    displayName: fullName, 
                    photoURL: "https://as2.ftcdn.net/v2/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg"
                  })
                  .then(() => {
                    const user = userCredential.user;
                    console.log(user)
                    toast.success("successfully")
                    setLoader(false)
                    navigate("/login")
                  })
                // ==== update profile end ====
                   
                // ===== realtime database Users start =====
                  .then(() => {
                    set(ref(db, 'users/' + auth.currentUser.uid), {
                        username: fullName,
                        email: email,
                        // profile_picture : imageUrl
                      });
                  })
                  .catch((error) =>{
                    console.log(error)
                  })

                  .catch((error) => {
                    console.log(error)
                  });
                  // ===== realtime database Users end =====

                // Signed up 
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if(errorCode.includes("auth/email-already-in-use")){
                    setEmailError("Email is already in use")
                    toast.error("Email is already in use")
                }
                // console.log(errorMessage)
                setLoader(false)
            });
        }
    };


    return (
        <div className="registation bg-green-100">
            <div className="container mx-auto flex justify-between flex-wrap items-center">
            
                <div className="w-[40%] registration-form shadow-lg ">
                 <h2>Sign Up</h2>

                 <form onSubmit={ handleSubmit} >
                    <input onChange={handleFullName} value={fullName} type="text" placeholder="full name" />
                    <p>{fullNameError}</p>

                    <input onChange={handleEmail} value={email} type="email" placeholder="email" />
                    <p>{emailError}</p>

                    <div className="relative">
                     <input onChange={handlePassword} value={password} type={showPassword? "password" :"text"} placeholder="password" />
                     {
                        showPassword?
                        <FaEyeSlash onClick={()=> setShowPassword(!showPassword)} className="absolute right-2 top-3 text-blue-500 text-2xl cursor-pointer" />
                        :
                        <FaEye onClick={()=> setShowPassword(!showPassword)} className="absolute right-2 top-3 text-blue-500 text-2xl cursor-pointer" />
                     }
                    </div>
                    <p>{passwordError}</p>
                    
                    <div className="relative">
                     <input onChange={handleRePassword} value={rePassword} type={showRePassword? "password" :"text"} placeholder="confirm password" />
                     {
                        showRePassword?
                        <FaEyeSlash onClick={()=> setShowRePassword(!showRePassword)} className="absolute right-2 top-3 text-blue-500 text-2xl cursor-pointer" />
                        :
                        <FaEye onClick={()=> setShowRePassword(!showRePassword)} className="absolute right-2 top-3 text-blue-500 text-2xl cursor-pointer" />
                     }
                    </div>
                    <p>{rePasswordError}</p>
                     
                    {
                        loader?
                        <div className="flex justify-center">
                         <RotatingLines />
                        </div>
                        :
                        <Buttons_v_1 type="submit">Submit</Buttons_v_1>
                    }
                    <div>
                     <p className="text-slate-500">Already have an account? please 
                     <Link to="/login" className="text-blue-500 font-semibold ml-2">Login</Link></p>
                    </div>
                 </form>
                </div>

                <div className="w-[45%]">
                    <h1>Welcome to Chat-App</h1>
                <Lottie animationData={Animation} className="w-full" />
                </div>
            </div>
        </div>
    );
};

export default Registration;