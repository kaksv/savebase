import React from "react"
import { Link } from "react-router-dom"
import { MdDashboard } from "react-icons/md"
import { IoArrowBackOutline } from "react-icons/io5"
import { IoArrowForwardOutline } from "react-icons/io5"
import { useQuery } from "@tanstack/react-query"
import { FaDonate } from "react-icons/fa"
import { RiFundsLine } from "react-icons/ri"
import { FaPeopleLine } from "react-icons/fa6"
import { IoIosHome } from "react-icons/io"
import { SiBlockchaindotcom } from "react-icons/si"
const Sidebar = () => {

  // const { data: userAddress } = useQuery({
  //   queryKey: ["userEthAddress"],
  // })
  // const { data: PrisonContract } = useQuery({
  //   queryKey: ["contractObject"],
  // })
  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <h2 className="text-4xl">
        <Link to="/">
          <SiBlockchaindotcom />
        </Link>
      </h2>
      {/* the tabs */}
      <div className="justify-center align-center mt-12">
        <div className="flex items-center p-2 gap-4 hover:bg-yellow-500">
          <IoIosHome className="mt-1" />

          <Link to="./">Home</Link>
        </div>
        <div className="flex items-center p-2 gap-4 hover:bg-yellow-500">
          <FaPeopleLine className="mt-1" />

          <Link to="./safes">Safes</Link>
        </div>

        <div className="flex items-center p-2 gap-4 hover:bg-yellow-500">
          <RiFundsLine />
          <Link to="./communities">Communities</Link>
        </div>
        <div className="flex items-center p-2 gap-4 hover:bg-yellow-500">
          <FaDonate />
          <Link to="./myprojects">Investments</Link>
        </div>
      </div>
    </div>
  )
}

export default Sidebar