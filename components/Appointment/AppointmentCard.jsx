import React, { useEffect } from 'react'
import moment from 'moment'

const AppointmentCard = ({ schedules, setSelected }) => {
  return (
    <div className="sticky top-0 mx-4 flex w-full flex-col">
      <div className="w-full rounded-3xl bg-white p-4 drop-shadow-md">
        {schedules &&
          schedules?.schedule?.map(
            (
              {
                firstName,
                lastName,
                contact,
                time,
                consultation,
                address,
                concern,
                status,
                serviceType,
                cancellationCode,
                serverCancellationCode
              },
              index
            ) => (
              <div className="cursor-pointer p-4" key={index}>
                <div key={index} className="border-b-2 border-dashed">
                  <p className="pb-4 text-xl font-semibold text-primary">
                    {moment(time.from).format('h:mm A')} -
                    {moment(time.to).format(' h:mm A')}

                    <span className="text-red-600">
                    {(status == "cancelled") ? " ( Cancelled )": ""}
                    </span>
                  </p>
                  
                  <div className="flex lg:flex-row flex-col px-4 pb-6">
                    <div className="w-[34rem]">
                      <p className="text-[15px]">
                        <b>Name:</b> &nbsp; {firstName}, {lastName}
                      </p>
                      <p className="text-[15px]">
                        <b>Contact No.#</b>: &nbsp; 0{contact}
                      </p>
                      <p className="text-[15px]">
                        <b>Concern:</b> &nbsp;{concern}
                      </p>
                      <p className="text-[15px]">
                        <b>Address:</b> &nbsp; {address}
                      </p>
                      <p className="text-[15px]">
                        <b>Service Type:</b> &nbsp; {serviceType}
                      </p>
                    </div>
                    <div className="w-1/3">
                      <p className="text-[15px]">
                        <b>Consultation Type:</b> &nbsp; {consultation}
                      </p>
                      <p className="text-[15px]">
                        <b>Cancellation Code:</b> &nbsp; {cancellationCode}
                      </p>
                      <p className="text-[15px]">
                        <b>Staff Cancellation Code:</b> &nbsp; {serverCancellationCode}
                      </p>
                      <p className="text-[15px]">
                        <b>{(consultation == "obgyne") ? "OB-Gyne": "Midwife"}:</b> &nbsp; {time.username}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
      </div>
    </div>
  )
}

export default AppointmentCard
