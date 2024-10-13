
import React from 'react';
import useAuthentication from '../../Hooks/useAuthentication';
import Img from "../../homepage.png"
const HomePage = () => {
  const {LoginButton,address} = useAuthentication()
  return (
    <div className="bg-black text-white min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-6xl ">yoSave</h1>
      <div className="max-w-md w-full px-6 py-8 rounded-lg shadow-lg">
        <img src={Img} alt="imig" />
        <p className="text-lg mb-8">
        Empower yourself, your community and business with Personal and Group savings campaigns
        </p>
        <LoginButton/>
      </div>
    </div>
  );
};

export default HomePage;


















// import React, { useEffect } from 'react'
// import useAuthentication from '../Hooks/useAuthentication'
// import { useQuery } from '@tanstack/react-query';

// const Login = () => {

// const {connectCeloWallet,LoginButton,address,balance,getBalance,getUserAddress} = useAuthentication()

// useEffect(() => {

//     load()
// })


// const load=async()=>{
//     // getUserAddress(),
//     getBalance()

// }
// const { data: accountAddress } = useQuery({
//     queryKey: ['accountAddress'],
//   });
//   console.log("account address :",accountAddress)
//     return (
//         <div
//             style={{ minHeight: '90vh' }}
//             className="flex flex-col w-full border gap-2  rounded-md justify-center items-center"
//         >

//             <div>
//                 <h1 className='text-6xl '>

//                     CeloVest
//                 </h1>
//                 <span>Saving your way to the future</span>

//             </div>
//             <LoginButton/>
//             <span>Addess :{address?.toString()}</span>
//             <span>Balance :{balance}</span>
//             {/* d */}

//         </div>
//     )
// }

// export default Login