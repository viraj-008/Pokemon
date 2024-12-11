
import Login from "./component/Login";
import Register from "./component/Register";
import PokemonsUi from "./component/PokemonsUi";
import AdoptedPokemonsUi from "./component/AdoptedPokemonsUi";
import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
function App() {
  return (
    <div className="max-w-[1440px] mx-auto ">

    <Router>

<Routes>
 <Route path="/home" element={<PokemonsUi />}/>
  <Route path="/" element={<Register/>}/>
  <Route path="/login" element={<Login/>}/>
  <Route path="/adopting" element={<AdoptedPokemonsUi/>}/>
</Routes>
</Router>

    </div>
  );
}

export default App;
