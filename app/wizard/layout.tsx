import React, { ReactNode } from 'react'

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-col h-screen w-screen justify-center items-center">
      {children}
    </div>
  )
}

export default Layout
