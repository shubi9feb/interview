import React, { useState } from "react";
export default function Skillsdetails({ formData, setFormData }) {
  const skills = formData.skills || [];

  // Local state for the “new skill” input
  const [newSkill, setNewSkill] = useState("");

  // Add the new skill to the array
  const handleAdd = () => {
    if (!newSkill.trim()) return;
    setFormData((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), newSkill.trim()],
    }));
    setNewSkill("");
  };

  // Remove skill at index
  const handleRemove = (idx) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== idx),
    }));
  };

  // Edit a skill in place
  const handleSkillChange = (idx, value) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.map((s, i) => (i === idx ? value : s)),
    }));
  };

  return (
    <>
      <div className="flex   w-full p-2 ">
        <div className=" w-full">
          <h1 className="block text-left w-full text-gray-800 text-2xl font-bold mb-6">
            Skills Details
          </h1>
          <form action="/" method="post">
            {skills.map((skill, idx) => (
              <div key={idx} className="flex space-x-4 mb-3">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillChange(idx, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="flex space-x-4 mb-6">
              <input
                type="text"
                placeholder="Add Skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded"
              />
              <button
                type="button"
                onClick={handleAdd}
                className="text-white bg-blue-700 text-left flex hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Add Skill
              </button>
            </div>
            {/* <div className="mb-4">
              <label
                className="block mb-2 text-sm font-medium text-gray-700 text-left"
                for="firstName"
              >
                Skills
              </label>
              <div className="flex space-x-6 mb-4">
                <input
                  type="text"
                  placeholder="Add Skills"
                  className="w-full px-3 py-3 text-sm leading-tight text-gray-700 border border-gray-200 rounded appearance-none focus:outline-none focus:shadow-outline"
                />
                <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                  Remove
                </button>
              </div>
              <div className="flex space-x-6 mb-4">
                <input
                  type="text"
                  placeholder="Add Skills"
                  className="w-full px-3 py-3 text-sm leading-tight text-gray-700 border border-gray-200 rounded appearance-none focus:outline-none focus:shadow-outline"
                />
                <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                  Remove
                </button>
              </div>
              <button
                type="button"
                className="text-white bg-blue-700 text-left flex hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Add Skills
              </button>
            </div> */}
          </form>
        </div>
      </div>
    </>
  );
}
