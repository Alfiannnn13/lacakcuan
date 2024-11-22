import { Banknote } from 'lucide-react'
import React from 'react'

function Logo() {
  return (
    <a href="/" className='flex items-center gap-2'>
        <Banknote className='stroke h-11 w-11 stroke-emerald-300 stroke-[1.5]'/>
        <p className='bg-gradient-to-r from-emerald-300 to-green-700 bg-clip-text text-4xl font-bold leading-tight tracking-tighter text-transparent'>
            LacakCuan
        </p>
    </a>
  )
}

export function LogoMobile() {
  return (
    <a href="/" className='flex items-center gap-2'>
        <p className='bg-gradient-to-r from-emerald-300 to-green-700 bg-clip-text text-4xl font-bold leading-tight tracking-tighter text-transparent'>
            LacakCuan
        </p>
    </a>
  )
}

export default Logo
