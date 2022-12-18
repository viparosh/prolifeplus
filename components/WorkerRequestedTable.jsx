import React, { useState, useRef, useEffect } from 'react'
import moment from 'moment'

const WorkerRequestedTable = ({

  dataPage,
  setPageNumber,
  status,
  pageNumber,
  setData,
  data,
  update,
  header,
}) => {

  const clickNext = () => {
    if (pageNumber != dataPage.length - 1) {
      setData(dataPage[pageNumber + 1])
      setPageNumber(pageNumber + 1)
    }
  }

  const clickPrevious = () => {
    if (pageNumber != dataPage.length && pageNumber != 0) {
      setData(dataPage[pageNumber - 1])
      setPageNumber(pageNumber - 1)
    }
  }

  return (
    <>
      <table className="my-4 w-full border-collapse border border-slate-400">
        <thead>
          <tr>
            {header.map((item, index) => (
              <th key={index} className="border border-slate-300 p-4">
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data.map(({ _id, date, from, to, remarks }) => (
              <tr key={_id} className="text-center">
                <td className="border border-slate-300 p-4">
                  {moment(date).format('MMM DD, YYYY')}
                </td>
                <td className="border border-slate-300 p-4">
                  {moment(from).format('hh:mm a')}
                </td>
                <td className="border border-slate-300 p-4">
                  {moment(to).format('hh:mm a')}
                </td>
                {status == 'rejected' && (
                  <td className="border border-slate-300 p-4">{remarks}</td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={update ? 7 : 5}
                className="border border-slate-300 p-4 text-center"
              >
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mb-20 flex w-full flex-row items-center justify-between">
        <button
          onClick={clickPrevious}
          className="rounded-md border bg-gray-600 py-2 px-5 text-sm text-white"
        >
          Previous
        </button>
        <p>
          <b>{pageNumber + 1}</b>
        </p>
        <button
          onClick={clickNext}
          className="rounded-md border bg-gray-600 py-2 px-5 text-sm text-white"
        >
          Next
        </button>
      </div>
    </>
  )
}

export default WorkerRequestedTable
