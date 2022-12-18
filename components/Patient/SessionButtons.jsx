import React from 'react'

const SessionButtons = ({ save, setEditMode, editMode }) => {
  return (
    <>
      {editMode && (
        <div className="sticky bottom-0 right-0 flex items-center justify-end gap-2 bg-white p-4">
          <button
            className="rounded-md bg-slate-100 px-4 py-3"
            onClick={() => setEditMode(!editMode)}
          >
            Cancel Edit
          </button>
          <button
            onClick={save}
            className="rounded-md bg-primary px-4 py-3 text-white"
          >
            Save Changes
          </button>
        </div>
      )}
    </>
  )
}

export default SessionButtons
