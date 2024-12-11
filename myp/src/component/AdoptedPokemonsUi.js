import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./Firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "./Firebase";

const AdoptingPokemons = () => {
  // current user eamil id
  const currentUserEmailId = auth.currentUser.email;

  // store adopting pokemons
  const [Adopted, setAdopted] = useState([]);


  // get pokemons from firebase
  useEffect(() => {
    const getAdoptedPokemonsData = async () => {
      const collectionRef = collection(db, "Adopted");
      const querySnapshot = await getDocs(collectionRef);
      const fetcheAdoptredPokemonsdData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        isDisabled: false,
        lastHealTime: null,
      }));
      const filterByUserAdoptedPokemons =
        fetcheAdoptredPokemonsdData.filter(
          (adoptedPokemons) => adoptedPokemons.adoptedby === currentUserEmailId
        );
      setAdopted(filterByUserAdoptedPokemons);
    };
    getAdoptedPokemonsData();
  }, []);
  // get pokemons from firebase end


  // decrese pokemons health
  useEffect(() => {
    const decreaseAdoptedPokemonsHealth = () => {
      setAdopted((prevAdoptedPokemonList) =>
        prevAdoptedPokemonList.map((adoptedPokemon) => ({
          ...adoptedPokemon,
          health: Math.max(adoptedPokemon.health - 1, 0),
        }))
      );
    };
    const intervalId = setInterval(decreaseAdoptedPokemonsHealth, 9000);
    return () => clearInterval(intervalId);
  }, []);
  // decrese pokemons health end


  // give health pokemons start
  const handleGiveHealth = async (pokemonId) => {
    const now = Date.now();
    const updatedPokemons = Adopted.map((adoptedPokemon) => {
      if (adoptedPokemon.id === pokemonId && adoptedPokemon.health < 100) {
        if (!adoptedPokemon.lastHealTime || now - adoptedPokemon.lastHealTime >= 10000) {
          toast.success("Successful feed: now you can feed again after 1 day");
          setTimeout(() => {
            setAdopted((prevAdoptedPokemonState) =>
              prevAdoptedPokemonState.map((adoptedPokemon) =>
                adoptedPokemon.id === pokemonId ? { ...adoptedPokemon, isDisabled: false } :adoptedPokemon
              )
            );
          }, 10000); // 10 seconds

          return {
            ...adoptedPokemon,
            health: adoptedPokemon.health + 1,
            isDisabled: true,
            lastHealTime: now,
          };
        } else {
          toast.error("You can only feed this Pokémon once every 1 day");
        }
      }
      return adoptedPokemon;
    });
    setAdopted(updatedPokemons);
  };
  // give health pokemons start end.



  // i was try to update firebase realtime data update=======================

  // const decrementHealth = async () => {
  //   const updatedPokemons = pokemons.map(async pokemon => {
  //     const newHealth = pokemon.health > 0 ? pokemon.health - 1 : 0;
  //     const pokemonRef = doc(db, 'pokemons', pokemon.id);
  //     await updateDoc(pokemonRef, { health: newHealth });
  //     return { ...pokemon, health: newHealth };
  //   });
  //   Promise.all(updatedPokemons).then(updatedData => setpokemons(updatedData));
  // };
  // const intervalId = setInterval(() => {
  //   // decrementHealth();
  // }, 8000);
  // ==========================/

  useEffect(() => {
    const timeoutIds = Adopted.map((AdoptedPokemon) =>
      setTimeout(() => {
        setAdopted((prevAdoptedPokemons) =>
          prevAdoptedPokemons.map((pokemons) =>
            pokemons.id === AdoptedPokemon.id ? { ...pokemons, isDisabled: false } : pokemons
          )
        );
      }, 10000)
    );

    return () => timeoutIds.forEach(clearTimeout);
  }, [Adopted]);

  return (
    <div className="bg-emerald-300 h-screen">
    <div>
      <img
        className="w-[20%] min-w-[120px]  rounded-lg h-[10%]  mx-auto "
        src="https://logodownload.org/wp-content/uploads/2017/08/pokemon-logo.png"
      />

      <div className="flex justify-around  ">
      <div className="mt-4  rounded-xl m-1  p-2">
        <h1 className="  text-blue-600 text-sm  md:text-[20px] font-bold">
        Adopted          &nbsp;
          <span className="text-yellow-500 ">
              Pokemons
            <img
              className="h-6  w-6 ml-1 "
              src="https://img.icons8.com/?size=100&id=45674&format=png&color=000000"
            />
          </span>
        </h1>
        </div>

<div  className="mt-4  p-2 ">
        <Link to={"/home"}>
          <h1 className="font-bold text-sm  text-yellow-500 flex justify-center hover:text-red-800 duration-300 items-center">
            Back to HOME
            <img
              className="h-3 hover:bg-slate-100 w-4 md:h-6 md:w-6 md:ml-2"
              src="https://img.icons8.com/?size=100&id=59809&format=png&color=000000"
            />
          </h1>
        </Link>
        </div>
      </div>
           {Adopted.length>0 ? <h3 className="text-sm  font-serif mt-2 p-2 opacity-75"><span className="text-red-800 font-bold opacity-100">Note:</span>
            The health of your Pokémons will decrease by 1 point daily and you can feed 
            only one point of health to a Pokémon in a day. </h3>:null}

            </div>
            <hr className="border-1 my-2"/>
      <div className=" grid grid-cols-2 m-1 bg-emerald-300 sm:grid-cols-3  lg:grid-cols-6   justify-self-center  ">

        {Adopted.length==0 ? <div className=" font-serif font-bold flex items-center flex-col text-slate-800  md:text-xl underline absolute  w-[98%] text-center  p-10 mt-20">
        <img className="h-24 w-16 " src="https://pngimg.com/uploads/pokemon/pokemon_PNG110.png"/>
        <h1  className="rounded-xl  " >You haven't adopted any Pokemon yet.</h1> </div>:Adopted.map((AdoptedPokemons, i) => {
          return (
            <div
              key={AdoptedPokemons.id}
              className="mx-auto mb-3 border-2 md:w-[200px] bg-emerald-800 duration-300   rounded-xl flex-wrap text-center text-yellow-400 font-bold "
            >
              <img
                className="rounded-lg h-[130px]  md:h-[110px] lg:h-[170px] mx-auto p-1 w-full"
                src={AdoptedPokemons.image}
                alt={AdoptedPokemons.name}
              />
  <div className="   text-md text-xs  mt-2 h-[90px]  p-2 ">
              <div className="flex justify-start  "><span className=" text-amber-300 w-[20%]">Name  </span>  <h3 className="text-white w-[80%] md:w-[60%] text-end  mx-auto"> - {AdoptedPokemons.name}</h3> </div>
              <hr/>
              <div className="flex  justify-start"> <span className=" text-amber-300 w-[20%]">TYPE  </span> <h3 className="text-[8px] md:text-[10px]  text-white  w-[80%] md:w-[70%] px-1 text-end mx-auto  ">- {AdoptedPokemons.type}</h3>   </div>
              <hr/>
              <div className="flex justify-start"> <span className="text-sm  text-amber-300 w-[20%]">HEALTH  </span> <h3 className=" w-[70%] md:w-[50%] text-red-400 text-end mx-auto">  - {AdoptedPokemons.health} </h3>  </div>
          <hr/>
              </div>

         <div>
              <button
                onClick={() => handleGiveHealth(AdoptedPokemons.id)}
                disabled={Adopted[i].isDisabled}
                className="bg-red-600 text-black shadow-lg border-2 m-1 md:w-[60%] rounded-full md:rounded-lg p-1 text-center"
              >
                {Adopted[i].isDisabled ? (
                  <h1 className="text-red-900 text-xs font-mono">
                    next feed after 1 day
                  </h1>
                ) : (
                  <h1 className="hover:text-yellow-400 duration-200 rounded-lg text-white">H+</h1>
                )}
              </button>

              </div>
              {Adopted.filter((adoptedpokemons) =>adoptedpokemons.adoptedby === currentUserEmailId) ? (
                <h1 className="text-xs p-2 text-white font-semibold ">               
                
                  {/* {currentUserEmailId} */}
                </h1>
              ) : null}
            </div>
          );
        })}
      </div>
     
    </div>
  );
};

export default AdoptingPokemons;
