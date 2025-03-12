import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Github as LucideGithub } from "lucide-react";
import { FaWhatsapp, FaCode } from "react-icons/fa"; 

import {
  SiVercel,
  SiRender,
  SiMongodb,
  SiGmail,
  SiCloudinary,
  SiReact,
  SiTailwindcss,
  SiVite,
  SiNodedotjs,
  SiExpress,
  SiGit,
  SiGithub,
  SiGoogletranslate,
  SiGoogledrive,
} from "react-icons/si";

function TechStack() {
  const [websites] = useState([
    {
      name: "Current Website",
      url: "https://nbkyouth.vercel.app",
    },
    {
      name: "Old Website",
      url: "https://sites.google.com/view/nbkyouthgangavaram",
    },
  ]);

  const infrastructure = [
    { category: "Frontend Hosting", name: "Vercel", icon: <SiVercel className="h-12 w-12 text-black-600" />, description: "Frontend deployment and hosting platform" },
    { category: "Backend Hosting", name: "Render", icon: <SiRender className="h-12 w-12 text-black-600" />, description: "Backend server deployment" },
    { category: "Database", name: "MongoDB", icon: <SiMongodb className="h-12 w-12 text-green-600" />, description: "NoSQL database for data storage" },
    { category: "Email Service", name: "Gmail SMTP", icon: <SiGmail className="h-12 w-12 text-red-600" />, description: "OTP delivery and notifications" },
    { category: "Media Storage", name: "Cloudinary", icon: <SiCloudinary className="h-12 w-12 text-blue-600" />, description: "Cloud storage for images and audio" },
    { category: "Photos & Images", name: "Google Drive", icon: <SiGoogledrive className="h-12 w-12 text-green-500" />, description: "Cloud storage for photos & images" },
  ];

  const technologies = [
    {
      category: "Frontend",
      items: [
        { name: "React", icon: <SiReact className="h-8 w-8 mr-2 text-blue-500" /> },
        { name: "Tailwind CSS", icon: <SiTailwindcss className="h-8 w-8 mr-2 text-teal-500" /> },
        { name: "Vite", icon: <SiVite className="h-8 w-8 mr-2 text-purple-500" /> },
      ],
    },
    {
      category: "Backend",
      items: [
        { name: "Node.js", icon: <SiNodedotjs className="h-8 w-8 mr-2 text-green-500" /> },
        { name: "Express", icon: <SiExpress className="h-8 w-8 mr-2 text-gray-500" /> },
        { name: "MongoDB", icon: <SiMongodb className="h-8 w-8 mr-2 text-green-600" /> },
        { name: "JWT Authentication", icon: <FaCode className="h-8 w-8 mr-2 text-orange-500" /> },
      ],
    },
    {
      category: "Features & Tools",
      items: [
        { name: "Web Push Notifications", icon: <FaCode className="h-8 w-8 mr-2 text-gray-500" /> },
        { name: "Download App (PWA)", icon: <FaCode className="h-8 w-8 mr-2 text-gray-500" /> },
        { name: "Google Translate (Multi-language)", icon: <SiGoogletranslate className="h-8 w-8 mr-2 text-blue-500" /> },
        { name: "Git", icon: <SiGit className="h-8 w-8 mr-2 text-red-600" /> },
        { name: "GitHub", icon: <SiGithub className="h-8 w-8 mr-2 text-gray-800" /> },
        { name: "VS Code", icon: <FaCode className="h-8 w-8 mr-2 text-blue-500" /> },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-16">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">NBK YOUTH</h1>
          <div className="space-y-4">
            {websites.map((site) => (
              <a key={site.name} href={site.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-indigo-600">
                <ExternalLink className="h-4 w-4 mr-2" />
                {site.name}
                {site.status === "active" && (
                  <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
                )}
              </a>
            ))}
            <a href="https://github.com/Vineethkolli/NBK-Youth" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-indigo-600">
              <LucideGithub className="h-4 w-4 mr-2" />
              GitHub
            </a>
          </div>
        </div>
{/* Logo with Developer Name */}
<div className="md:w-1/2 text-center">
  <div className="relative inline-block">
    <img
      src="developerImage.png"
      alt=""
      className="mx-auto rounded-full border-4 border-indigo-500 shadow-lg transform transition duration-500 hover:scale-105"
    />
    {/* Animated dashed border overlay */}
    <div className="absolute inset-0 rounded-full border-4 border-dashed border-indigo-300 animate-pulse"></div>
  </div>
  <p className="mt-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-extrabold text-2xl">
    Kolli Vineeth - Developer
  </p>
</div>
        </div>

      {/* Infrastructure Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Infrastructure</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {infrastructure.map((item) => (
            <div key={item.name} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technologies Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Technologies</h2>
        <div className="space-y-12">
          {technologies.map((category) => (
            <div key={category.category}>
              <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {category.items.map((tech) => (
                  <div key={tech.name} className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    {tech.icon}
                    <span className="font-medium">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default TechStack;
