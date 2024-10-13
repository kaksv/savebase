import React, { useState } from 'react'
import { SafeChart } from '../Piechart'
import { dummySafeData, getFullDateFromSeconds, compareTimeInNanoseconds } from '../../Utils/functions'
import { ImUnlocked } from "react-icons/im";
import { GiLockedDoor } from "react-icons/gi";
import SafeAddFunds from '../Modals/SafeAddFunds';
import { useMutation, useQuery } from '@tanstack/react-query';
import useAuthentication from '../../../Hooks/useAuthentication';
import WithdrawFunds from '../Modals/WithdrawSafe';
import BigNumber from 'bignumber.js';
import ForcedWithdrawFunds from '../Modals/ForcedWithdraw';
import { ClipLoader } from 'react-spinners'

const Index = () => {
    const { data: mySafes } = useQuery({
        queryKey: ['mySafes'],
    });

    const { invalidateMySafes, invalidateAccountBalance } = useAuthentication()
    const [isLoading, setIsLoading] = useState(false)
    const [isUnlockLoading,setUnlockLoading] = useState(false)


    const { data: celoVestContract } = useQuery({
        queryKey: ['celoVestContract'],
    });


    const { data: accountAddress } = useQuery({
        queryKey: ['accountAddress'],
    });




    const { mutateAsync: HandleUnlockSafe } = useMutation({
        mutationFn: (data) => unlockSafe(data),
        onSuccess: async () => {
            await invalidateMySafes();
            await invalidateAccountBalance()
            setUnlockLoading(false);
        },
    });
const unlockSafe =async(index)=>{
    try {
        if (!accountAddress || !celoVestContract) return

        setUnlockLoading(true)
        const results = await celoVestContract.methods.unlockSafe(index)
            .send({ from: accountAddress })
            return results
    } catch (error) {
        console.log('error in topping up safe :', error)
    }
    setIsLoading(false)
}

    async function handleSubmit(data) {
        console.log("unloack sage :",data)

        try {
            if (!accountAddress || !celoVestContract) return

            // setUnlockLoading(true)
            // const results = await celoVestContract.methods.unlockSafe(data)
            //     .send({ from: accountAddress })
            // return results

        } catch (error) {
            console.log('error in topping up safe :', error)
        }
        setIsLoading(false)
    }

    const WithdrawMoadal = (data) => {
        console.log("sdjsisbi :", data)

        return (
            <div>hoo</div>
        )

    }



    return (
        <div
            style={{ minHeight: '90vh' }}
            className="flex relative w-full flex-col  gap-2 rounded-md justify-center items-center"
        >

            <div>Safes</div>


            <div className='flex w-full gap-8 justify-evenly items-center border p-4'>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 w-1/2 ">
                    {
                        mySafes && mySafes?.length > 0 && mySafes.map((safe, index) => {
                            return (
                                <div key={index} className="p-4 rounded-lg shadow-md flex flex-col justify-center items-center border">
                                    <h2

                                        className="text-lg font-bold cursor-pointer">{safe.safeName}</h2>
                                    <span className='text-sm'>{safe?.safeAmount / 1e18} cUSD</span>





                                    {!safe.isLocked ? (
                                        <>
                                            <div className='flex flex-col justify-center items-center'>
                                                <span className='text-xs'>Locked until</span>
                                                <span className='text-sm'>{safe.safeDuration && getFullDateFromSeconds(safe.safeDuration)}</span>
                                            </div>
                                            <div className="ml-2 flex gap-2">
                                                <SafeAddFunds safeId={index} />
                                                <ForcedWithdrawFunds safeId={index} />
                                            </div>
                                        </>

                                    ) :
                                        <div className='flex gap-2 justify-evenly w-full'>
                                            {
                                                isUnlockLoading ?
                                                    <div className="w-full flex justify-center items-center text-white">
                                                        <ClipLoader color="white" />
                                                    </div> :
                                                    <button
                                                        onClick={()=>HandleUnlockSafe(index)}
                                                        className="bg-blue-500 text-white p-2 rounded-md"
                                                    >
                                                        Unlock
                                                    </button>
                                            }
                                            <WithdrawFunds safeId={index} />
                                        </div>

                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Index