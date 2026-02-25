import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Iconbtn from '../../../HomePage/common/Iconbtn';
import { IoAddCircleOutline } from "react-icons/io5";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import NestedView from './NestedView';
import { setCourse, setEditCourse, setStep } from '../../../../../Slices/courseSlice';
import toast from 'react-hot-toast';
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPI';
// import { data } from 'react-router-dom';

const CourseBuilderForm = () => {
  const {register , handleSubmit , setValue , formState : {errors}} = useForm();
  const [editSectionName , setEditSectionName] = useState(null);
  const {course} = useSelector((state) => state.course);
  const sections = course?.courseContent ?? [];
  const dispatch = useDispatch();
  const {token} = useSelector( (state) => state.auth);
  const [loading , setLoading] = useState(false);


   const onSubmit = async (data)=>{
     setLoading(true);
    let result;
    if(editSectionName){
      // agr section Edit krne aaye toh edit vali api call hogi
      result = await updateSection(
        {
        sectionName : data.sectionName,
        sectionId : editSectionName,
        courseId : course._id,

        },token
      );
    }
    else{
      // ye tab chlega jb new section create krne aaye ho api call hogo createsection
      result = await createSection({
        sectionName : data.sectionName,
        courseId : course._id
      } , token)
    }
    // update values
    if(result){
      // update course value
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName" , "");
    }
    setLoading(false);
  }

  const cancelEdit = ()=>{
    setEditSectionName(null);
    setValue("sectionName" , "");
  }

  const gotoNext = ()=>{
    if(sections.length === 0){
      toast.error("Please add atleast one section")
      return;
    }
    if(sections.some((section)=> (section.subSection ?? []).length === 0)){
      toast.error("Please add atleast one lecture in each section")
      return;
    }
    // if everything is good then go to next step
    dispatch(setStep(3));
  }
  const goBack = ()=>{
    dispatch(setStep(1));
    dispatch(setEditCourse(Boolean(course?._id)));
  }

    const handlechangeSectionName = (sectionId , sectionName)=>{
      if(editSectionName === sectionId){
        cancelEdit();
        return;
      }
      setEditSectionName(sectionId);
      setValue("sectionName" , sectionName);

    }
 

  return (
     <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="sectionName">
            Section Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="sectionName"
            disabled={loading}
            placeholder="Add a section to build your course"
            {...register("sectionName", { required: true })}
            className="form-style w-full"
          />
          {errors.sectionName && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Section name is required
            </span>
          )}
        </div>
        <div className="flex items-end gap-x-4">
          <Iconbtn
            type="submit"
            disabled={loading}
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
          >
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </Iconbtn>
          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
      {sections.length > 0 && (
        <NestedView handlechangeSectionName={handlechangeSectionName} />
      )}
      {/* Next Prev Button */}
      <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
        >
          Back
        </button>
        <Iconbtn disabled={loading} text="Next" onclick={gotoNext}>
          <MdNavigateNext />
        </Iconbtn>
      </div>
    </div>
  )
}

export default CourseBuilderForm
