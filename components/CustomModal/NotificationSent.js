import React from 'react'

const NotificationSent = ({ setModal }) => {
  return (
    <div className="fixed top-0 left-0 z-30 flex h-screen w-screen items-center justify-center bg-black/50 bg-white">
      <div className="w-full max-w-selectedDate rounded-md bg-white p-4">
        <p className="font-bold text-lg">Alert</p>
        <p className="text-base text-center my-5">Notification has been sent to patients</p>
        <div className="flex flex-row-reverse w-full">
        	<button className="py-2 bg-primary px-6 text-white text-sm rounded-md" onClick={() => setModal(false)}>Confirm</button>
        </div>
      </div>
    </div>
  )
}

export default NotificationSent
