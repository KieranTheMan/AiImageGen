import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { logo } from "../assets"

const Default = () => {
  
 

  return (
    <>
      <header className="w-full flex justify-between items-cente bg-gradient-to-r from-sky-500 to-indigo-500 sm:px-8 px-4 py 4 border-b border-b-[#e6ebf4]">
        <Link to="/">
          <img src={logo} alt="logo" className="w-28 object-cotain" />
        </Link>
          
        <nav className=" flex gap-1 mt-10 h-10 drop-shadow-xl">
          
          <Link
            to="/create-post"
            className="font-iter font-medium bg-[#373df0] text-white px-4 py-2 rounded-md"
          >
            Create
          </Link>
          <Link
            to="/"
            className="font-iter font-medium bg-[#8B38D7] text-white px-4 py-2 rounded-md"
          >
            Showcase
          </Link>
        </nav>
      </header>

      <main className= 'sm:p-8 px-4 py-8 w-full bg-slate-800   min-h-[calc(100vh-73px)]'>
        <Outlet />
       
      </main>
      <footer></footer>
    </>
  );
};

export default Default;
