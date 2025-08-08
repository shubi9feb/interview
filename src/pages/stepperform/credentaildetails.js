import React, { useState } from "react";
export default function Credentaildetails({ formData, setFormData }) {
  const cred = formData.credential || {};
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      credential: {
        ...prev.credential,
        [name]: value,
      },
    }));
  };

  return (
    <>
      <div className="flex   w-full p-2 ">
        <div className=" w-full">
          <h1 className="block text-left w-full text-gray-800 text-2xl font-bold mb-6">
            Credentails Details
          </h1>
          <form action="/" method="post">
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-medium text-gray-700 text-left"
                for="firstName"
              >
                Email
              </label>
              <input
                className={`w-full px-3 py-3 text-sm leading-tight text-gray-700 border rounded appearance-none focus:outline-none focus:shadow-outline ${
                  errors.email ? "border-red-500" : "border-gray-200"
                }`}
                id="firstName"
                type="email"
                placeholder="Email"
                name="email"
                value={cred.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div className="grid gap-2  md:grid-cols-2">
              <div className="mb-4 ">
                <label
                  className="block mb-2 text-sm font-medium text-left text-gray-700"
                  for="password"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={cred.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-3 text-sm leading-tight text-gray-700 border rounded appearance-none focus:outline-none focus:shadow-outline ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  }`}
                />{" "}
                {errors.password && (
                  <p className="text-red-600 text-xs mt-1">{errors.password}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-medium text-left text-gray-700 text-left"
                  for="c_password"
                >
                  Confirm Password
                </label>
                <input
                  id="c_password"
                  type="password"
                  placeholder="Password"
                  value={cred.passwordConfirmation}
                  name="passwordConfirmation"
                  onChange={handleChange}
                  className={`w-full px-3 py-3 text-sm leading-tight text-gray-700 border rounded appearance-none focus:outline-none focus:shadow-outline ${
                    errors.passwordConfirmation
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                />{" "}
                {errors.passwordConfirmation && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.passwordConfirmation}
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
