import React from 'react'
import { Button } from './button'

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className='flex flex-col items-center justify-center space-y-2 text-center'>
        <h1 className='text-7xl text-indigo-600 font-bold'>404</h1>
        <p className='text-xl font-bold'>Page Not Found</p>
        <p className='text-gray-600'>Sorry, we couldn't find the page you're looking for.</p>
        <Button className='bg-indigo-600'>Go Home</Button>
      </div>
    </div>
  )
}

export default NotFound
