import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast';
import { useDispatch , useSelector } from 'react-redux';
import { createSubSection, updateSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../Slices/courseSlice';
import Upload from '../Upload';
import IconBtn from '../../../HomePage/common/Iconbtn';
import { RxCross2 } from "react-icons/rx";

const SubSectionModal = ({
    modalData,
    setModalData,
    add = false,
    edit = false,
    view = false,
}) => {
    const  {
        register ,
        handleSubmit,
        setValue,
        getValues,
        formState : {errors},
    } = useForm();

     const { course } = useSelector((state) => state.course);
    const { token } = useSelector((state) => state.auth);
    const [loading , setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
    if (view || edit) {
      // console.log("modalData", modalData)
      setValue("lectureTitle", modalData.title)
      setValue("lectureDesc", modalData.description)
      setValue("lectureVideo", modalData.videoUrl)
    }
  }, [edit, modalData, setValue, view])

    // detect whether form is updated or not

    const isFormUpdated = ()=>{
        const currentValues = getValues();

        if(currentValues.lectureTitle !== modalData.title ||
           currentValues.lectureDesc !== modalData.description ||
           currentValues.lectureVideo !== modalData.videoUrl
        ){
            return true;
        }
        else{
            return false;
        }
    }

    const handleEditSubsection = async ()=>{
        const currentValues = getValues();
        const formData = new FormData();

        // in nested view when you are doing setEditSubsection then you are passing data(all data of subsection) and sectionId due to state management vo editSection me store ho ja rhi hai and then in last you are sedinng modalData = {editSubsection}  that why sectionId and all data is coming in modalData

        formData.append("sectionId" , modalData.sectionId);
        formData.append("subSectionId" , modalData._id);
        // edit case
        if(currentValues.lectureTitle !== modalData.title){
            // channge krne ke liye data toh again form me dalna hi hoga
            formData.append("title", currentValues.lectureTitle);
        }
        if(currentValues.lectureDesc !== modalData.description){
            // channge krne ke liye data toh again form me dalna hi hoga
            formData.append("description", currentValues.lectureDesc);
        }
        if(currentValues.lectureVideo !== modalData.videoUrl){
            // channge krne ke liye data toh again form me dalna hi hoga
            formData.append("video", currentValues.lectureVideo);
        }

        // calling the api of editsubsection / updateSubsection
        setLoading(true);
        const result = await updateSubSection(formData, token);

        if(result){
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
        }
        // close the modal
        setModalData(null);
        setLoading(false);

       
    }

    const onSubmit = async (data)=>{
        if(view){
            return;
        }
        if(edit){
            if(!isFormUpdated()){
                toast.error("No changes made in form")
            }
            else{
                // edit kr do
                handleEditSubsection();
            }
            return;
        }
        const formData = new FormData();
    // modalData me section ki id hai go in nestedview and check the setAddSubsection there use send the sectionId
     formData.append("sectionId", modalData)
    formData.append("title", data.lectureTitle)
    formData.append("description", data.lectureDesc)
    formData.append("videofile", data.lectureVideo)
    formData.append("timeduration", data.lectureDuration)
    setLoading(true)

    // API CALL of createSUbsection / addSubsection
        const result = await createSubSection(formData , token);

        if(result){
            // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse));
        }
        setLoading(false);
        setModalData(null);
    }
  

  return (
<div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-black/40 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        {/* Modal Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          {/* Lecture Video Upload */}
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />
          {/* Lecture Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              Lecture Title {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="form-style w-full"
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture title is required
              </span>
            )}
          </div>
          {/* Lecture Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Lecture Description{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture Description is required
              </span>
            )}
          </div>
          {/* Lecture Duration */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDuration">
              Lecture Duration {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureDuration"
              placeholder="e.g. 10:30"
              {...register("lectureDuration", { required: true })}
              className="form-style w-full"
            />
            {errors.lectureDuration && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture Duration is required
              </span>
            )}
          </div>
          {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={loading}
                text={loading ? "Loading.." : edit ? "Save Changes" : "Save"}
                type="submit"
              />
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default SubSectionModal
