import { useNavigate } from "react-router-dom";

export default function Logo(){
  const navigate = useNavigate();
  const handleNavClick = () => {
      navigate(`/`)};
  return(
    <>
    <div className="logo">
          <h1 onClick={handleNavClick} className='text-7xl font-bold text-purple-400 mb-10 p-0 hover:cursor-pointer'>
            KOKORO
          </h1>
    </div>
    </>
  )
}