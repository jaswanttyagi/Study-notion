import { useEffect, useState } from "react"
import { Chart, registerables } from "chart.js"
import { Doughnut } from "react-chartjs-2"

Chart.register(...registerables)

export default function InstructorChart({ courses }) {
  // State to keep track of the currently selected chart
  const [currChart, setCurrChart] = useState("students")
  const [colorShift, setColorShift] = useState(0)

  const palette = [
    "#FACC15",
    "#38BDF8",
    "#34D399",
    "#FB7185",
    "#A78BFA",
    "#F97316",
    "#22D3EE",
    "#EAB308",
  ]

  useEffect(() => {
    const id = setInterval(() => {
      setColorShift((prev) => prev + 1)
    }, 2000)

    return () => clearInterval(id)
  }, [])

  const chartColors = courses.map((_, i) => palette[(i + colorShift) % palette.length])

  // Data for the chart displaying student information
  const chartDataStudents = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled),
        backgroundColor: chartColors,
        borderColor: "#161D29",
        borderWidth: 2,
      },
    ],
  }

  // Data for the chart displaying income information
  const chartIncomeData = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated),
        backgroundColor: chartColors,
        borderColor: "#161D29",
        borderWidth: 2,
      },
    ],
  }

  // Options for the chart
  const options = {
    maintainAspectRatio: false,
    cutout: "62%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#F1F2FF",
          boxWidth: 12,
          boxHeight: 12,
          padding: 14,
          font: {
            size: 11,
          },
        },
      },
    },
  }

  return (
    <div className="relative flex flex-1 flex-col gap-y-4 overflow-hidden rounded-2xl border border-richblack-700 bg-gradient-to-br from-richblack-800 via-richblack-800 to-richblack-900 p-5 shadow-[0_22px_50px_rgba(0,0,0,0.35)] sm:p-6">
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-50/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-blue-200/10 blur-2xl" />

      <p className="relative text-lg font-bold text-richblack-5">Performance Visualizer</p>
      <div className="relative flex flex-wrap gap-3 font-semibold">
        {/* Button to switch to the "students" chart */}
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-lg border px-3 py-1.5 text-sm transition-all duration-200 ${
            currChart === "students"
              ? "border-yellow-50 bg-yellow-50 text-richblack-900"
              : "border-richblack-600 bg-richblack-700 text-richblack-25 hover:border-yellow-200"
          }`}
        >
          Students
        </button>
        {/* Button to switch to the "income" chart */}
        <button
          onClick={() => setCurrChart("income")}
          className={`rounded-lg border px-3 py-1.5 text-sm transition-all duration-200 ${
            currChart === "income"
              ? "border-yellow-50 bg-yellow-50 text-richblack-900"
              : "border-richblack-600 bg-richblack-700 text-richblack-25 hover:border-yellow-200"
          }`}
        >
          Income
        </button>
      </div>
      <div className="relative mx-auto mt-2 aspect-square h-full w-full max-w-[420px]">
        {/* Render the Pie chart based on the selected chart */}
        <Doughnut
          data={currChart === "students" ? chartDataStudents : chartIncomeData}
          options={options}
        />
      </div>
    </div>
  )
}
