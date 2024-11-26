//import { logo } from "../assets";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
const Default = () => {
  return (
    <>
      <header className="w-full flex justify-between items-center bg-white sm:px-8 px-4 py 4 border-b border-b- [#e6ebf4]">
        {/* {<Link to="/">
          <img src={logo} alt="logo" className="w-28 object-cotain" />
        </Link>} */}

        <nav>
          <Link to="/" className="w-28 object-contain">
            Home
          </Link>
          <Link
            to="/create-post"
            className="font-iter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md"
          >
            Create
          </Link>
        </nav>
      </header>

      <main className= 'sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]'>
        <Outlet />
      </main>
      <footer></footer>
    </>
  );
};

export default Default;
