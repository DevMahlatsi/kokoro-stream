import { useNavigate } from "react-router-dom";


export default function Menu(){
  const navigate = useNavigate();
  const MENU_ITEMS = [
  {id: 1, name: "Home", path: '/'},
  {id: 2, name: "Movies", path: '/movies'},
  {id: 3, name: "TV Shows", path:'/shows'},
  // {id: 5, name: "Trending", path: '*'}
];

  const handleNavClick = (path: String) => {
      navigate(`${path}`
      );
    };
  return (
    <>
    <div className="menu border border-black p-3">
          <ul className="flex justify-center gap-1 text-purple-400 " >
          {MENU_ITEMS.map((item) => (
            <li onClick={() => handleNavClick(item.path)} className="hover:cursor-pointer hover:text-purple-700 hover:underline px-3" key={item.id}>{item.name}</li>
          ))}
        </ul>
    </div>
    <br />
    </>
  )
}