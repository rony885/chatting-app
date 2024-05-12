import { useState } from "react";
import { Buttons_v_1 } from "../../components/Buttons";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail  } from "firebase/auth";
import { toast } from "react-toastify";

const ForgotPassword = () => {
    const auth = getAuth();

    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("")

    const handleEmail = (e)=>{
        setEmail(e.target.value)
        setEmailError("")
    }

    const handleSubmit = (e) =>{
        e.preventDefault()
        if(!email){
            setEmailError("required email")
        }
        else{
            sendPasswordResetEmail(auth, email)
            .then(() => {
            // Password reset email sent!
            toast.success("Email send")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // if(error.message === Firebase: Error(auth/user-not-found).){

                // }

               console.log(errorCode)
               console.log(errorMessage)
            });
        }
    }

    return (
        <div id="forgot_password" className="h-screen bg-green-100 flex justify-center items-center">
            <form onSubmit={handleSubmit} className="w-[450px] p-10 rounded-lg bg-white">
                <h2>Forgot Password</h2>
                <input onChange={handleEmail} type="email" placeholder="Enter Your email" />
                <p>{emailError}</p>
                <div className="flex justify-between gap-5">
                    <Buttons_v_1>Send</Buttons_v_1>
                    <Buttons_v_1>
                        <Link to="/login">Back to LogIn</Link>
                    </Buttons_v_1>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;