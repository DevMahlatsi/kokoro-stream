import type { MovieLayoutProps } from "../types/props";

export default function MovieLayout({children}: MovieLayoutProps){
  return(
    <>
    <div className='text-white-800 flex flex-wrap gap-2   justify-center'>
      {children}
    </div>
    </>
  )
}