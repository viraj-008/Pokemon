import React from "react";

import app from "./Firebase";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [Email, setEmail] = useState("");
  const [Paswword, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const auth = getAuth(app);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let isValid = true;

     
      if (!Email.includes("@") || !Email.includes(".com")) {
        isValid = false;
        setErrorMessage("Invalid Email");
      }
      if (Email.length===0) {
        isValid = false;
        setErrorMessage("email field empty");
      }
      
      if (Paswword.length<8) {
        isValid = false;
        setErrorMessage("your password must be at least 8 characters");
      
      }
      if (!Paswword) {
        isValid = false;
        setErrorMessage("password field empty");
      
      }

        
      if (Email && Paswword.length >8) {
        setErrorMessage('');
      
      }
     
      if (isValid) {
        await signInWithEmailAndPassword(auth, Email, Paswword);
        toast.success("Successfull Login");
        navigate("/home");
      }
    } catch (error) {

      console.log(error);
      toast.error(error.code);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-emerald-400 h-screen">
        <div className="p-4 ">
          <img
            alt="pokemon"
            className="w-[12%]  z-1  hover:scale-x-125 duration-300 min-w-[120px]  rounded-lg h-[10%]  mx-auto  "
            src="https://logodownload.org/wp-content/uploads/2017/08/pokemon-logo.png"
          />
          <img
            alt="pokemon"
            className="w-[10px]   duration-300 min-w-[60px]  rounded-lg h-[10%]  mx-auto  "
            src="https://pngimg.com/uploads/pokemon/pokemon_PNG146.png"
          />
          <hr className="m-2 shadow-xl w-1/2 h-1   mx-auto" />
        </div>
        <div className="bg-white shadow-2xl rounded-md md:h-auto w-[90%] ml-[5%] mt-[7%] md:mt-[4%] md:w-[40%] absolute m-4 mx-auto md:ml-[30%] p-1">
          <div className="text-center p-2 text-black font-medium">LOGIN</div>
          <hr className="p-1" />

          <div className="flex justify-center">
            <input
              type="email"
              placeholder="Email"
              autoComplete="on"
              onChange={(e) => setEmail(e.target.value)}
              value={Email}
              className="mb-2  p-2   text-sm text-center  outline-none   w-full"
            />
          </div>

          <div className="flex justify-center">
            <input
              type="password"
              placeholder="Password"
              autoComplete="on "
              onChange={(e) => setPassword(e.target.value)}
              value={Paswword}
              className="mb-2 py-2 bg-white text-center outline-none   w-full"
            />
          </div>

          <div className=" flex  justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="text-center  bg-emerald-600  hover:bg-red-800 hover:font-bold duration-100  text-white p-2 w-[50%] rounded-md mx-auto"
            >

              {isLoading ? "Loading..." : "Login"}
            </button>
          </div>
          {errorMessage && (
            <p className="text-center text-sm font-serif text-red-600 p-1 py-2">
              {errorMessage}
            </p>
          )}
          <Link to={"/"}>
            <h1 className="hover:text-emerald-600  font-semibold duration-100 ">
              Register
            </h1>
          </Link>
        </div>
      </div>
    </form>
  );
};

export default Login;
