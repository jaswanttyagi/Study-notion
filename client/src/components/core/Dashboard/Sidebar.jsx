import React, { useState } from 'react'
import { logout } from "../../../services/operations/authAPI"
import { useDispatch, useSelector } from 'react-redux'
import { sidebarLinks } from '../../../data/dashboard-link'
import SidebarLink from "./SidebarLink"
import { VscSignOut } from 'react-icons/vsc'
import ConfirmationModal from '../HomePage/common/ConfirmationModal'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const { user, loading: profileLoading } = useSelector((state) => state.profile);
  const { loading: authLoading } = useSelector((state) => state.auth)
  const [confirmationModal , setConfirmationModal] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  if (profileLoading || authLoading) {
    return (
      <div className='spinner'>

      </div>
    )
  }
  return (
    <div>
      <div className='flex min-w-[222px] flex-col border-r-[1px] border-r-richblack-700   bg-richblack-800 py-10'
      style={{height : "-webkit-fill-available"}}
      >
        <div className="flex flex-col">
          {
            sidebarLinks.map((link) => {
              if (link.type && user?.accountType !== link.type) return null;
              // if same hai link ka type and account type then show the sidebar
              return(
              <SidebarLink link={link} key={link.id} iconName={link.icon} ></SidebarLink> 
              ) // sidebar link show only one tab 
            })
          }
        </div>
         <div className=" mt-6 mb-6 h-[1px] ml-[1rem] w-[205px] bg-richblack-700" />
        <div className="flex flex-col">
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
          />
          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="px-8 py-2 text-sm font-medium text-richblack-300"
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
          
      </div>
      {confirmationModal && (<ConfirmationModal modalData={confirmationModal}/> )}
    </div>
  )
}

export default Sidebar
