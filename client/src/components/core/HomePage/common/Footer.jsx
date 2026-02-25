import React from "react";
import { Link } from "react-router-dom";

import Logo from "../../../../assest/Logo/Logo-Full-Light.png";
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = ["Articles", "Blog", "Chart Sheet", "Code challenges", "Docs", "Projects", "Videos", "Workspaces"];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];
const Subjects = [
  "AI",
  "Cloud Computing",
  "Code Foundations",
  "Computer Science",
  "Cybersecurity",
  "Data Analytics",
  "Data Science",
  "Data Visualization",
  "Developer Tools",
  "DevOps",
  "Game Development",
  "IT",
  "Machine Learning",
  "Math",
  "Mobile Development",
  "Web Design",
  "Web Development",
];
const Languages = ["Bash", "C++", "C#", "Go", "HTML & CSS", "Java", "JavaScript", "Kotlin", "PHP", "Python", "R", "Ruby", "SQL", "Swift"];
const CareerBuilding = ["Career paths", "Career services", "Interview prep", "Professional certification", "Full Catalog", "Beta Content"];

const Footer = () => {
  return (
    <footer className="bg-richblack-800">
      <div className="mx-auto w-11/12 max-w-maxContent py-14 text-richblack-400">
        <div className="grid gap-10 border-b border-richblack-700 pb-10 lg:grid-cols-2">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <img src={Logo} alt="StudyNotion Logo" className="mb-4 h-10 w-auto object-contain" />
              <h2 className="text-richblack-50 text-[16px] font-semibold">Company</h2>
              <div className="mt-3 flex flex-col gap-2 text-[14px]">
                {["About", "Careers", "Affiliates"].map((item) => (
                  <Link key={item} to={item.toLowerCase()} className="hover:text-richblack-50 transition-all duration-200">
                    {item}
                  </Link>
                ))}
              </div>
              <div className="mt-4 flex gap-3 text-lg">
                <FaFacebook />
                <FaGoogle />
                <FaTwitter />
                <FaYoutube />
              </div>
            </div>

            <div>
              <h2 className="text-richblack-50 text-[16px] font-semibold">Resources</h2>
              <div className="mt-3 flex flex-col gap-2 text-[14px]">
                {Resources.map((item) => (
                  <Link key={item} to={item.split(" ").join("-").toLowerCase()} className="hover:text-richblack-50 transition-all duration-200">
                    {item}
                  </Link>
                ))}
              </div>
              <h2 className="mt-6 text-richblack-50 text-[16px] font-semibold">Support</h2>
              <div className="mt-2 text-[14px]">
                <Link to="/help-center" className="hover:text-richblack-50 transition-all duration-200">
                  Help Center
                </Link>
              </div>
            </div>

            <div>
              <h2 className="text-richblack-50 text-[16px] font-semibold">Plans</h2>
              <div className="mt-3 flex flex-col gap-2 text-[14px]">
                {Plans.map((item) => (
                  <Link key={item} to={item.split(" ").join("-").toLowerCase()} className="hover:text-richblack-50 transition-all duration-200">
                    {item}
                  </Link>
                ))}
              </div>

              <h2 className="mt-6 text-richblack-50 text-[16px] font-semibold">Community</h2>
              <div className="mt-3 flex flex-col gap-2 text-[14px]">
                {Community.map((item) => (
                  <Link key={item} to={item.split(" ").join("-").toLowerCase()} className="hover:text-richblack-50 transition-all duration-200">
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h2 className="text-richblack-50 text-[16px] font-semibold">Subjects</h2>
              <div className="mt-3 flex flex-col gap-2 text-[14px]">
                {Subjects.map((item) => (
                  <Link key={item} to={`/${item.split(" ").join("-").toLowerCase()}`} className="hover:text-richblack-50 transition-all duration-200">
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-richblack-50 text-[16px] font-semibold">Languages</h2>
              <div className="mt-3 flex flex-col gap-2 text-[14px]">
                {Languages.map((item) => (
                  <Link key={item} to={`/${item.replace(/\s|&/g, "-").toLowerCase()}`} className="hover:text-richblack-50 transition-all duration-200">
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-richblack-50 text-[16px] font-semibold">Career Building</h2>
              <div className="mt-3 flex flex-col gap-2 text-[14px]">
                {CareerBuilding.map((item) => (
                  <Link key={item} to={`/${item.split(" ").join("-").toLowerCase()}`} className="hover:text-richblack-50 transition-all duration-200">
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 text-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center">
            {BottomFooter.map((item, index) => (
              <div
                key={item}
                className={`${index === BottomFooter.length - 1 ? "" : "border-r border-richblack-700"} px-3 first:pl-0`}
              >
                <Link to={item.split(" ").join("-").toLowerCase()} className="hover:text-richblack-50 transition-all duration-200">
                  {item}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-richblack-300">Made with love Jaswant © 2026 Studynotion</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
