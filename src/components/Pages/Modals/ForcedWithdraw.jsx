import React, { useEffect, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { ClipLoader } from 'react-spinners'
import { IoMdClose } from 'react-icons/io'
import { useMutation, useQuery } from '@tanstack/react-query'
import { IoAddCircle } from "react-icons/io5";
import { dummySafeData } from '../../Utils/functions'
import useAuthentication from '../../../Hooks/useAuthentication'
import { CeloVestContractAddress } from '../../Utils/Constants'
import BigNumber from 'bignumber.js'

function ForcedWithdrawFunds({ safeId }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { invalidateMySafes, invalidateAccountBalance } = useAuthentication()
    const { data: celoVestContract } = useQuery({
        queryKey: ['celoVestContract'],
    });


    const { data: accountAddress } = useQuery({
        queryKey: ['accountAddress'],
    });

    const { data: cUSDContract } = useQuery({
        queryKey: ['cUSDContract'],
    });



    const { data: mySafes } = useQuery({
        queryKey: ['mySafes'],
    });

    //   useEffect(()=>{
    //     if(!mySafes) return

    //     const results = dummySafeData.filter((safe,index)=>index ===safeId)
    //     console.log("res :",results,mySafes)
    //     setSafe(results)

    //   },[safeId])


    const { mutateAsync: HandleTopUpSafe } = useMutation({
        mutationFn: (data) => handleSubmit(data),
        onSuccess: async () => {
            await invalidateMySafes();
            await invalidateAccountBalance()
            setIsLoading(false);
        },
    });





    async function handleSubmit(data) {

        try {

            if (!accountAddress || !celoVestContract) return

            setIsLoading(true)

            //format the topup amount
            const _amount = new BigNumber(data.topUpAmount)
                .shiftedBy(18)
                .toString()

            // //approve the contract to deduct the amount
            // const result = await cUSDContract.methods
            // .approve(CeloVestContractAddress, _amount)
            // .send({ from: accountAddress })

            //call the top up amoubt from the contractt

            const results = await celoVestContract.methods.forceWithdrawFromSafe(safeId, _amount)
                .send({ from: accountAddress })
            return results

        } catch (error) {
            console.log('error in topping up safe :', error)
        }
        setIsLoading(false)
    }
    return (
        <div className=" flex flex-col justify-center items-center w-full ">
            <div
                onClick={() => setIsOpen(true)}
                type="submit"
                className=""
            >
                <IoAddCircle />
            </div>
            {isOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto ">
                    <div className="flex items-center justify-center min-h-screen">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-80 transition-opacity"
                            aria-hidden="true"
                        ></div>
                        <div
                            style={{ backgroundColor: '#11131f' }}
                            className="rounded-lg overflow-hidden relative shadow-xl flex flex-col justify-center items-center transform transition-all sm:max-w-md sm:w-full"
                        >
                            <div className="mt-2 flex w-full justify-end mr-6 text-white">
                                <IoMdClose
                                    size={25}
                                    className="hover:cursor-pointer"
                                    onClick={() => setIsOpen(false)}
                                />
                            </div>
                            <div className="flex flex-col gap-4 p-2 w-full justify-center items-center py-4">
                                <h2 className="text-red-600">Forced WIthdraw</h2>
                                <span className='border p-2 text-red-900'>By forcing a safe open, you will lose 20% of the amount as apenalty</span>
                                <Formik
                                    initialValues={{
                                        topUpAmount: 0,
                                    }}
                                    onSubmit={(values) => {
                                        HandleTopUpSafe(values)

                                    }}
                                >
                                    {({ values, handleChange, errors, touched }) => (
                                        <Form className="flex flex-col gap-1">

                                            <Field
                                                id="topUpAmount"
                                                name="topUpAmount"
                                                type="number"
                                                placeholder="enter withdraw amount"
                                                onChange={handleChange}
                                                value={values.topUpAmount}
                                                className="border rounded-md p-2"
                                            />


                                            {isLoading ? (
                                                <div className="w-full flex justify-center items-center text-white">
                                                    <ClipLoader color="white" />
                                                </div>
                                            ) : (
                                                <button
                                                    type="submit"
                                                    className=" text-white bg-red-500 p-2 rounded-md"
                                                >
                                                    Withdraw
                                                </button>
                                            )}
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ForcedWithdrawFunds