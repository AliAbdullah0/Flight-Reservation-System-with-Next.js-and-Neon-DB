"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'

const Explore = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides: { src: string; alt: string; text: string }[] = [
    {
      src: 'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?',
      alt: 'Explore AirWhite: Airport Terminal',
      text: 'Explore AirWhite: Discover New Destinations',
    },
    {
      src: 'https://images.pexels.com/photos/321159/pexels-photo-321159.jpeg?',
      alt: 'Explore AirWhite: Airplane in Flight',
      text: 'Book Your Next Adventure with AirWhite',
    },
  ]

  // Auto-slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section className='flex flex-col p-4 w-full'>
      <div className='h-[400px] w-full rounded-2xl p-4 bg-white/10 border border-white/20'>
        <div className='relative h-[360px] rounded-xl overflow-hidden'>
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                style={{ objectFit: 'cover' }}
                className='opacity-70'
              />
              <div className='absolute inset-0 flex items-center justify-center'>
                <h2 className='md:text-3xl text-2xl text-center font-bold text-white'>{slide.text}</h2>
              </div>
            </div>
          ))}
          <div className='absolute bottom-4 left-0 right-0 flex justify-center gap-2'>
            {slides.map((_, index) => (
              <button
                key={index}
                className={`h-3 w-3 rounded-full ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className='flex md:flex-row flex-col gap-4 mt-4 md:justify-evenly'>
        <Link href='/explore/locations' className='w-full md:w-1/2 block'>
          <div className='relative w-full h-[300px] bg-white/10 border-none rounded-2xl overflow-hidden'>
            <Image
              src='https://images.pexels.com/photos/3768652/pexels-photo-3768652.jpeg?'
              alt='Airport Runway'
              fill
              style={{ objectFit: 'cover' }}
              className='opacity-50'
            />
            <div className='absolute inset-0 flex items-center justify-center'>
              <span className='text-2xl font-bold text-white'>Airports</span>
            </div>
          </div>
        </Link>
        <Link href='/explore/airlines' className='w-full md:w-1/2 block'>
          <div className='relative w-full h-[300px] bg-white/10 border-none rounded-2xl overflow-hidden'>
            <Image
              src='/2.webp'
              alt='Airplane Exterior'
              fill
              style={{ objectFit: 'cover' }}
              className='opacity-50'
            />
            <div className='absolute inset-0 flex items-center justify-center'>
              <span className='text-2xl font-bold text-white'>Airlines</span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}

export default Explore