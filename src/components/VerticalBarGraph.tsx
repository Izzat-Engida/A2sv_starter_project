import React from 'react'
import { BarChart,Bar,Tooltip,Legend,ResponsiveContainer} from 'recharts'
function VerticalBarGraph() {
  return (
    <div>
    <h1 className='text-[20px] font-[600] leading-[2.8] align-middle'>Geographic Distribution</h1>
    <p className='text-[14px] font-[400]'>Shows the number of applicants from each country</p>
        <div>
      <ResponsiveContainer>
        <BarChart>

        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  )
}

export default VerticalBarGraph
