import React from 'react'
import Navbar from './Navbar'
import Hero from './Hero'
import Summarizer from './Summarizer'
import HowItWorks from './HowItWorks'

function HomeLayout() {
  return (
    <div className='w-full'>
       <Navbar />
       <Hero />
       <Summarizer />
       <HowItWorks />
    </div>
  )
}

export default HomeLayout