

export default function Menu(){
  const MENU_ITEMS = [
  {id: 1, name: "Home", path: '/'},
  {id: 2, name: "Movies", path: 'movies'},
  {id: 3, name: "TV Shows", path:'*'},
  {id: 5, name: "Trending", path: '*'}
];

  return (
    <>
    <div className="menu border border-black p-3">
          <ul className="flex justify-center gap-1 text-purple-400 " >
          {MENU_ITEMS.map((item) => (
            <li className="hover:cursor-pointer hover:text-purple-700 hover:underline px-3" key={item.id}>{item.name}</li>
          ))}
        </ul>
    </div></>
  )
}