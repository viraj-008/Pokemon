import React from "react";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "./Firebase";
import { auth } from "./Firebase";
import { Link,useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import debounce from 'lodash/debounce';
import { useRef } from "react";

const Pokemonui = () => {
  // current user id
  const userEmaiId = auth.currentUser.email;
  
  // fetch all pokemon data from firestore
  const [Pokemons, setPokemons] = useState([]);

  // adopted pokemon for match
  const [AdoptedPokemons, SetAdoptedPokemons] = useState([]);

  const buttonRef = useRef(null);

  useEffect(() => {
    const getPokemonData = async () => {
      const collectionRef = collection(db, "pokemons");
      const querySnapshot = await getDocs(collectionRef);
      
      const fetchePokemonsdData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      setPokemons(fetchePokemonsdData);
    };
    // setLoding(false)
    getPokemonData();
  }, []);
  // end faetch function


  useEffect(() => {
    const getAdoptPokemonsdata = async () => {
      const collectionRef = collection(db, "Adopted");
      const querySnapshot = await getDocs(collectionRef);
      const fetchedAdoptedPokemonsData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      SetAdoptedPokemons(fetchedAdoptedPokemonsData);
    };
    getAdoptPokemonsdata ();
  }, [AdoptedPokemons]);
  
  // adopting pokemons function ////////

  let isAdoptingInProgress = false;
  
  const HandleAdoptingPokemons = async (pokemons) => {
    const pokemonExists = AdoptedPokemons.some(
      (existingPokemons) => existingPokemons.name === pokemons.name
    );
    
      const debouncedHandleAdoption = debounce(HandleAdoptingPokemons, 500, {
        leading: true,
        trailing: false,
      });

    if (!pokemonExists) {

      if (!isAdoptingInProgress) {
        isAdoptingInProgress = true;
        buttonRef.current.disabled = true;

        try {
      const docRef = await addDoc(collection(db, "Adopted"), {
        id: pokemons.id,
        name: pokemons.name,
        type: pokemons.type,
        health: pokemons.health,
        image: pokemons.pic,
        adoptedby: userEmaiId,
      });
      isAdoptingInProgress = false;
      toast.success("Adoption successful");
    } catch (error) {
      console.error("Error adopting Pokémon:", error);
      toast.error("An error occurred during adoption");
    } finally {
      isAdoptingInProgress = false; 
    }
  } else {
    toast.warning("Adoption in progress. Please wait.");
  }
} else {
  toast.error("This Pokémon is already adopted");
}
};
  // adopting pokemons function end   ///////////////////

 

  // logout function

  const navigate =useNavigate()
  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('User signed out successfully!');
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

// logout function end

  return (
    <div>

      <div className="bg-emerald-400 min-w-5 text-red-600  font-bold text-2xl text-center p-2">
      <div className="flex justify-end  text-white text-sm p-1 md:p-4 ">
      <button onClick={handleLogout}  className="bg-emerald-900  z-2 px-1 text-[10px] md:text-[15px]
       hover:bg-red-800 md:p-2 rounded-md  duration-300">Logout</button>
       </div>
        <img alt="pokemon"
          className="w-[20%] z-1 -mt-6 hover:scale-x-125 duration-300 min-w-[120px]  rounded-lg h-[10%]  mx-auto  p-1 "
          src="https://logodownload.org/wp-content/uploads/2017/08/pokemon-logo.png"
        />

        <span className="text-blue-700 px-3 font-extrabold rounded-lg mt-3">Task </span>
        <br />
        <div className=" md:flex  h-auto   flex-col  md:justify-around items-center  ">
          <div className="text-sm w-[220px] mx-auto  bg-yellow-500 rounded-md p-1 flex justify-center items-center ">
            <img alt="pokemon"
              className="h-4 w-4 md:h-4  md:w-4"
              src="https://img.icons8.com/?size=100&id=23265&format=png&color=000000"
            />

            <span className="text-black hover:text-white duration-200 ">{userEmaiId}</span>
          </div>

        <div>
          <Link to={"/adopting"}>
            <span className="md: text-[50%] bg-emerald-500 hover:text-red-600 duration-200  px-2 text-blue-900 rounded-md p-1  ">
            Go to  Adopted pokemons page
            </span>
          </Link>
       </div>
       

        </div>
      </div>

      <hr/>

      <div className="grid grid-cols-2   md:grid-cols-4  justify-self-center   bg-emerald-500 ">
        {  Pokemons.map((pokemons) => {
          return (
            <div
              key={pokemons.id}
              className="m-4  hover:scale-105 duration-300  shadow-lg rounded-md flex-wrap  inline-table text-center text-black font-bold bg-emerald-700"
            >
             <img
                className=" rounded-md h-[130px]  md:h-[150px] lg:h-[250px]  w-full"
                src={pokemons.pic}
                alt={pokemons.name}
              />

              <div className="   text-md text-xs  mt-2 h-[90px] shadow-lg p-2 ">
              <div className="flex justify-start  "><span className=" text-amber-300 w-[20%]  ">Name  </span>  <h3 className="text-white w-[76%] md:w-[60%] text-end  mx-auto"> - {pokemons.name}</h3> </div>
              <hr/>
              <div className="flex  justify-start"> <span className=" text-amber-300 w-[20%] ">TYPE  </span> <h3 className="text-[8px] md:text-[10px]  text-white  w-[80%] md:w-[70%] px-1 text-end  mx-auto ">- {pokemons.type}</h3>   </div>
              <hr/>
              <div className="flex justify-start"> <span className="text-sm  text-amber-300 w-[20%]  ">HEALTH  </span> <h3 className=" w-[70%] md:w-[50%] text-end  mx-auto text-red-400 "> +{pokemons.health} </h3>  </div>
          <hr/>
              </div>

              <div className="  h-[50px]  ">

              <button
              ref={buttonRef}
                onClick={() => HandleAdoptingPokemons(pokemons)}
                className="text-black my-2 cursor-pointer font-mono h-[55%]  rounded-md border-2  bg-amber-500
                 hover:bg-red-800 hover:text-white
                duration-200 w-[82%] mx-auto m-1"
              >
                {AdoptedPokemons.some(
                  (adoptedPokemons) => adoptedPokemons.id === pokemons.id
                ) ? (
                  <h1 className="bg-slate-200  flex justify-center items-center text-gray-400">
                    Adopoted
                    <img
                      className="h-4 w-4 ml-1 hover:bg-red-600 rounded-lg  " alt="pokeon"
                      src="https://img.icons8.com/?size=100&id=45674&format=png&color=000000"
                    />
                  </h1>
                ) : (
                  <h1>Adopt</h1>
                )}
              </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Pokemonui;
