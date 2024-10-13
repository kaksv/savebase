import { useQuery } from '@tanstack/react-query';
import React from 'react'
import Blockies from 'react-blockies';
import { shortenString } from '../Utils/functions';

const Navbar = () => {
    const { data: accountAddress } = useQuery({
        queryKey: ['accountAddress'],
      });
      const { data: userBalance } = useQuery({
        queryKey: ['userBalance'],
      });
  return (
    <>
    <nav className='flex w-full justify-between p-4'>
        <div className='flex justify-center items-center'>
            
        </div>
        <div className='flex flex-col justify-center items-center'>
            <div className='flex gap-1 justify-center items-center'>

            <span>{shortenString(accountAddress)}</span>
            <Blockies
    seed={accountAddress} 
    size={10}
    scale={3} 
    color="blue" 
    bgColor="brown"
    className='rounded-xl'
    />
    </div>
    <div className='text-sm'>
        {userBalance} cUSD
    </div>


        </div>


    </nav>
    
    </>
    
  )
}

export default Navbar