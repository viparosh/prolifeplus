import React, {useEffect , useState } from 'react'

const StaffCompositionModal = ({roleStaff, category, closeModal}) => {
    
    const [data,setData] = useState()
    const [dataPage,setDataPage] = useState([])
    const [pageNumber, setPageNumber] = useState(0)
    const [empty,setEmpty] = useState(true)

    useEffect(async() => {
      filter()
    },[])

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

    const filter = () => {
        var arr = [[]]
        var cnt = 0  
        
        const tmpLog = category.reverse()
        setData(tmpLog)
        
        let i = 0
        for (; i < tmpLog.length; i++) {
            if (i % 4 == 0 && i != 0) {
            arr[cnt + 1] = [tmpLog[i]]
            cnt++
            } else {
            arr[cnt].push(tmpLog[i])
            }
        }

        setDataPage(arr)
        
        if(i > 0) setEmpty(false)

        if (arr[pageNumber] == null) {
            setPageNumber(pageNumber - 1)
            setData(arr[pageNumber - 1])
        } else {
            setData(arr[pageNumber])
        }     
    }

    return (
    <div className="fixed top-0 left-0 z-30 flex h-screen w-screen items-center justify-center bg-black/50 bg-white">
      <div className="w-full overflow-y-auto w-3/5 rounded-md bg-white px-6 pb-6">
        <div className="w-full flex items-center justify-between my-4">
          <p className="font-bold">{roleStaff} list</p>
          <button className="border border-stone-400 rounded-md py-2 px-4" onClick={() => closeModal(false)}>Close</button>
        </div>
        {data && data.map((item, index) => (
            <div key={index} className="flex items-center mb-2 border border-slate-300 p-4">
                <img
                    src={item.profileLink}
                    className="rounded-md mr-5"
                    width="75px"
                    height="75px"
                />
                <div>
                    <p className="text-cyan-900 antialiased text-base font-semibold">{item.name}</p>
                    <p className="text-sm">Role: {item.role}</p>
                    <p className="text-sm">Username: {item.username}</p>
                </div>
            </div>
        ))}
        
        { empty ?
          <div className="bg-gray-100 text-center p-7">Nothing to see here</div>
          :
          <div className="mt-5 flex w-full flex-row items-center justify-between">
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
        }
        
      </div>
    </div>
  )
}

export default StaffCompositionModal
