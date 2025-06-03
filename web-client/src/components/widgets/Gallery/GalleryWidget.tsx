import React from 'react'
import GallerySlot from './GallerySlot'

export default function GalleryWidget() {
  return (
    <div className='w-[600px] h-[600px] grid gap-2 grid-cols-3 grid-rows-3'>
      <GallerySlot path='/test_Restaurant.jpeg' x={1} y={1} height={2} width={2}/>
      <GallerySlot x={3} height={2}/>
      <GallerySlot x={1} y={3} width={3} />
    </div>
  )
}

/*
  Registration
  -------------
  Description
  address
  Business name
  Business category
  

  Post-registration
  -----------------
  Availability!!!
    --- Recurring (monthly, weekly)
    --- manual
  Services and prices
  Images
*/