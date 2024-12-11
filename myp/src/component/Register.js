import React from "react";
import app from "./Firebase";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
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
      setErrorMessage("");

      
      if (!Email.includes("@") || !Email.includes(".com")) {
        isValid = false;
        setErrorMessage("Invalid Email");
      }
      if (!Email) {
        isValid = false;
        setErrorMessage("email field empty");
      }

      if (Paswword.length < 8) {
        isValid = false;
        setErrorMessage("your paswword must be at least 8 characters");
      }
      if (!Paswword) {
        isValid = false;
        setErrorMessage("Password field empty");
      }

      if (isValid) {
        await createUserWithEmailAndPassword(auth, Email, Paswword);
        toast.success("Successfull Registration");
        setEmail("");
        setPassword("");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.code);
      console.error("Error creating user:", error);
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
          <hr className="m-2 shadow-xl w-1/2 mx-auto " />
        </div>
        <div className="bg-white shadow-2xl rounded-md md:h-auto w-[90%] ml-[5%] mt-[7%] md:mt-[4%] md:w-[40%] absolute m-4 mx-auto md:ml-[30%] p-2">
          <div className="text-center text-black p-2 font-medium">REGISTER</div>
          <hr className="p-1 " />
          <div className="flex justify-center">
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="on"
              value={Email}
              className="mb-2 py-2 text-sm text-center outline-none bg-white  w-full"
            />
          </div>

          <div className="flex justify-center">
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="on"
              value={Paswword}
              className="mb-2 py-2 bg-white text-center outline-none  w-full"
            />
          </div>

          <div className=" flex justify-center ">
            <button
              type="submit"
              disabled={isLoading}
              className="text-center  bg-emerald-600 hover:bg-red-800
 hover:font-bold duration-100 text-white p-2 w-[50%] rounded-md mx-auto"
            >
              {" "}
              {isLoading ? "Loading..." : "REGISTER"}
            </button>
          </div>
          {errorMessage && (
            <p className="text-center text-sm font-serif text-red-600 p-1 py-2">
              {errorMessage}
            </p>
          )}

          <Link to={"/login"}>
            <h1 className="hover:text-emerald-600 font-semibold duration-100">
              Login
            </h1>
          </Link>
        </div>
      </div>
    </form>
  );
};

export default Register;
