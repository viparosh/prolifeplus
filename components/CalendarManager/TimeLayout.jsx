import React from 'react'
import { DeleteSvg } from '../Svg'
import moment from 'moment'
const TimeLayout = ({ data, actionButton, removeHandler, removeId }) => {
  return (
    <div className="flex items-center justify-between">
      <p>
        {moment(data.from).format('hh:mm A')} -{' '}
        {moment(data.to).format('hh:mm A')}
      </p>
      <p className="font-semibold text-secondaryText">{data.username}</p>
    </div>
  )
}

export default TimeLayout
