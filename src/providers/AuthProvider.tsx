'use client'
import { SessionProvider } from "next-auth/react"
import React from 'react'

function Provider({children}:{children:React.ReactNode}) {
  return (
    <div>
      {children}
    </div>
  )
}

export default Provider
