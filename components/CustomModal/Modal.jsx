import React , { useEffect } from 'react'

const Modal = ({ text, children }) => {
  return (
    <div className="fixed top-0 left-0 z-30 flex h-screen w-screen items-center justify-center bg-black/50 bg-white">
      <div className="w-full max-w-selectedDate rounded-md bg-white p-4">
        <p className="mt-2 mb-3">{text}</p>
        {children}
      </div>
    </div>
  )
}

export default Modal
