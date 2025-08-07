import React, { useEffect, useState } from "react";
import Select from "react-select";
import axiosInstance from "../../api/axiosInstance.js";
export default function Countrydetails({
  formData,
  setFormData,
  nextStep,
  prevStep,
}) {
  //   const country = [
  //     { value: "1", label: "India" },
  //     { value: "2", label: "Afghanistan." },
  //     { value: "3", label: "Albania" },
  //   ];
  //   const state = [
  //     { value: "1", label: "maharashtra" },
  //     { value: "2", label: "Gujarat" },
  //     { value: "3", label: "Kerala" },
  //   ];

  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const { countryId, stateId } = formData.country || {};

  // Fetch countries on mount
  useEffect(() => {
    async function loadCountries() {
      try {
        const res = await axiosInstance.get("/country-list");
        // assume res.data.data is an array of { id, name }
        console.log("Countries loaded:", res.data);
        setCountryOptions(
          res.data.data.map((c) => ({ value: c.id, label: c.name }))
        );
      } catch (err) {
        console.error("Failed to load countries", err);
      }
    }
    loadCountries();
  }, []);

  // Fetch states whenever countryId changes
  useEffect(() => {
    if (!countryId) {
      setStateOptions([]);
      return;
    }
    async function loadStates() {
      try {
        const res = await axiosInstance.get(
          `/state-list?country_id=${countryId}`
        );
        setStateOptions(
          res.data.data.map((s) => ({ value: s.id, label: s.name }))
        );
      } catch (err) {
        console.error("Failed to load states", err);
      }
    }
    loadStates();
  }, [countryId]);

  // Handlers
  const handleCountryChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      country: {
        ...prev.country,
        countryId: selected?.value || "",
        stateId: "", // reset state when country changes
      },
    }));
  };

  const handleStateChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      country: {
        ...prev.country,
        stateId: selected?.value || "",
      },
    }));
  };

  return (
    <>
      <div className="flex   w-full p-2 ">
        <div className=" w-full">
          <h1 className="block text-left w-full text-gray-800 text-2xl font-bold mb-6">
            Details
          </h1>
          <form action="/" method="post">
            <div className=" grid gap-2 md:grid-cols-2">
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-medium text-gray-700 text-left"
                  for="firstName"
                >
                  Select Country
                </label>
                <Select
                  className="basic-single text-left text-sm text-gray-700  rounded border border-gray-200"
                  classNamePrefix="select"
                  options={countryOptions}
                  onChange={handleCountryChange}
                  value={
                    countryOptions.find((c) => c.value === countryId) || null
                  }
                  placeholder="Select Country"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-medium  text-gray-700 text-left"
                  for="firstName"
                >
                  Select State
                </label>
                <Select
                  className="basic-single text-left text-sm rounded text-gray-700 border border-gray-200"
                  classNamePrefix="select"
                  options={stateOptions}
                  onChange={handleStateChange}
                  value={stateOptions.find((s) => s.value === stateId) || null}
                  placeholder="Select State"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
