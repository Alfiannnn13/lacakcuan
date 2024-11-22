import Navbar from '@/components/Navbar'
import React, { ReactNode } from 'react'

function layout({children}: {children: ReactNode}) {
  return (
    <div className='realtive flex h-screen w-full flex-col'>
        <Navbar/>
      <div className="w-full">{children}</div>
    </div>
  )
}

export default layout
