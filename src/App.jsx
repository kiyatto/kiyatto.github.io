import { useState, useEffect } from 'react';
import kat from './assets/kat.svg';
import email_background from './assets/email_background.svg';

function App() {
  const [showEmail, setShowEmail] = useState(false);
  useEffect(() => {
    if (!showEmail) return;
    const handler = () => setShowEmail(false);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [showEmail]);

  return (
    <div className='w-full min-h-screen flex flex-col sm:flex-row items-center gap-[75px] px-12 py-16 sm:px-24 sm:py-32 font-gantari'>
      <div className='w-1/2 flex flex-col justify-center items-center sm:items-start text-center sm:text-left gap-[50px] py-10'>
        <img src={kat} alt="an illustration of kat" className='w-56' />
        <div className='flex flex-col gap-[25px] pb-6'>
          <h1 className='text-2xl'>kat ong</h1>
          <h2 className='text-base'>computer science, linguistics, & informatics @ university of washington</h2>
        </div>
        <div className='flex flex-row gap-8 text-sm font-light'>
          <a href='https://www.linkedin.com/in/katreeya-ong' target='_blank' rel='noreferrer'>linkedin</a>
          <div className='relative'>
            <p className='cursor-pointer' onClick={(e) => { e.stopPropagation(); setShowEmail(!showEmail); }}>email</p>
            {showEmail && (
              <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2'>
                <div className='relative flex items-center justify-center'>
                  <img src={email_background} className='absolute inset-0 w-full h-full' alt="" />
                  <span className='relative text-xs px-8 py-4 whitespace-nowrap font-medium'>katong [at] uw [dot] edu</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='w-1/2 flex flex-col justify-center text-center sm:text-left gap-10 text-sm font-light leading-relaxed'>
        <p>
          Hi, I'm Kat! I was born and raised just outside of Seattle, WA, where I'm currently studying for my undergrad degree(s).
          Broadly, I'm interested in computer science theory, computational linguistics, and sociolinguistics, but like I've been doing for my entire life, I am still figuring out what I like to do.
        </p>
        <p>
          In my practically non-existent free time, I like to read, cook while barely avoiding setting the kitchen on fire, and paint ghastly self portraits of myself. The latest book I read was 
          <span className='italic'> Martyr! </span>
           by Kaveh Akbar, which I highly recommend. I am currently making my way through Milan Kundera's 
           <span className='italic'> The Unbearable Lightness of Being </span>
            and racking up way too many hours on Cyberpunk 2077.
        </p>
      </div>
    </div>
  )
}

export default App
