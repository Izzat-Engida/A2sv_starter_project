import React from 'react'
import Analytics from '@/components/Analytics'
import { getServerSession } from 'next-auth'
function Analytic() {
  const session = getServerSession()
  console.log(session)
  return (
    <div>
      <Analytics/>
    </div>
  )
}
export default Analytic