import { useState } from "react";

export default function Menue(){
  const [menu, setMenu]= useState([
      {id: 1, name: "Home"},
      {id: 2, name: "Movies"},
      {id: 3, name: "TV Shows"},
      {id: 4, name: "Genres"},
      {id: 5, name: "Trending"}
  ]);
  return (
    <>
    <div className="menu">
          <ul className="flex justify-center gap-1 text-purple-400 " >
          {menu.map((item) => (
            <li className="hover:cursor-pointer hover:text-purple-700 hover:underline p-1" key={item.id}>{item.name}</li>
          ))}
        </ul>
    </div></>
  )
}