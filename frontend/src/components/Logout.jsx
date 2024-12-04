import React from 'react'
import { RiLogoutCircleLine } from "react-icons/ri";
const Logout = () => {

  const handleLogout = ()=> {
    localStorage.removeItem('token'); 
    window.location.href = '/login';
  }
  return (
    <button className='px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md' onClick={handleLogout} ><RiLogoutCircleLine /></button>
  )
}

export default Logout