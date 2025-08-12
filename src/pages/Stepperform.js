// src/pages/Stepperform.jsx
import React, { useState } from "react";
import Personaldetails from "./stepperform/personaldetails";
import Countrydetails from "./stepperform/countrydetails";
import Skillsdetails from "./stepperform/skillsdetails";
import Credentaildetails from "./stepperform/credentaildetails";
import { Stepper, Step, StepLabel, Button, Typography } from "@mui/material";
import Layout from "../component/Layout";
import { Link, useNavigate } from "react-router-dom";

import axiosInstance from "../api/axiosInstance"; // your configured axios instance
import { API } from "../config/apiEndpoints"; // centralized endpoints
import { useQueryClient } from "@tanstack/react-query";

const steps = [
  "Personal Information",
  "Details",
  "Skills Details",
  "Credentail Details",
];

export default function Stepperform() {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // <-- NEW: combined form state (minimal structure matching your components)
  const [formData, setFormData] = useState({
    personal: {
      photo: null,
      photoPreview: "",
      name: "",
      gender: "",
      phoneNumber: "",
    },
    credential: {
      email: "",
      password: "",
      passwordConfirmation: "",
      role: "user",
    },
    skills: [], // e.g. ['react','php']
    country: { countryId: "", stateId: "" },
  });

  // Build FormData to match your backend / Postman fields
  const buildPayload = () => {
    const personal = formData.personal || {};
    const credential = formData.credential || {};
    const country = formData.country || {};
    const skillsArr = Array.isArray(formData.skills) ? formData.skills : [];

    const payload = new FormData();
    payload.append("name", personal.name?.trim() ?? "");
    payload.append("email", credential.email?.trim() ?? "");
    payload.append("phoneNumber", personal.phoneNumber?.toString() ?? "");
    payload.append("role", credential.role ?? "user");
    payload.append("password", credential.password ?? "");
    payload.append(
      "password_confirmation",
      credential.passwordConfirmation ?? credential.password ?? ""
    );
    payload.append("gender", personal.gender ?? "");
    payload.append("skills", skillsArr.join(","));
    payload.append("countryId", country.countryId ?? "");
    payload.append("stateId", country.stateId ?? "");
    if (personal.photo instanceof File) payload.append("photo", personal.photo);

    // some endpoints expect token in body as well as Authorization header — safe to append
    const token = localStorage.getItem("token");
    if (token) payload.append("token", token);

    return payload;
  };

  const handleSubmit = async () => {
    // simple client-side checks (you can expand)
    const name = formData.personal?.name?.trim();
    const email = formData.credential?.email?.trim();
    if (!name || !email) {
      alert("Please fill required fields (name & email).");
      return;
    }

    setIsSubmitting(true);
    const payload = buildPayload();

    try {
      // Use your axiosInstance and centralized endpoint
      const res = await axiosInstance.post(API.AUTH.REGISTER, payload);
      const data = res?.data ?? {};

      if (data?.success) {
        alert(data.message || "User added successfully");
        // refresh users list (if you're using react-query)
        queryClient.invalidateQueries({ queryKey: ["users"] });
        navigate("/List");
      } else {
        // backend might return validation messages in data.errors or data.message
        const msg =
          (data?.message &&
            (typeof data.message === "string"
              ? data.message
              : JSON.stringify(data.message))) ||
          "Failed to add user";
        alert(msg);
      }
    } catch (err) {
      console.error("Submit Error:", err);
      if (err?.response?.data) {
        const d = err.response.data;
        let messages = [];
        if (d?.errors && typeof d.errors === "object")
          messages = Object.values(d.errors).flat();
        else if (Array.isArray(d?.message)) messages = d.message;
        else if (d?.message) messages = [d.message];
        else messages = [err.message || "Submission failed"];
        alert(messages.join("\n"));
      } else {
        alert(err.message || "Network error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    // if last step -> submit
    if (activeStep === steps.length - 1) {
      handleSubmit();
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  // PASS formData + setFormData down so children can update parent state
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Personaldetails formData={formData} setFormData={setFormData} />
        );
      case 1:
        return <Countrydetails formData={formData} setFormData={setFormData} />;
      case 2:
        return <Skillsdetails formData={formData} setFormData={setFormData} />;
      case 3:
        return (
          <Credentaildetails formData={formData} setFormData={setFormData} />
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Layout>
      <div className="bg-white p-4 mb-2 rounded-lg  dark:border-gray-700 mt-14">
        <div>
          <h3 className="!text-defaulttextcolor dark:!text-defaulttextcolor/70 dark:text-white text-left dark:hover:text-white text-[1.125rem] font-semibold">
            Stepper Form
          </h3>
        </div>
      </div>

      <div className="bg-white">
        <div className="p-4 rounded-lg dark:border-gray-700 mb-2">
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
      </div>

      <div className="bg-white">
        <div className="p-4 rounded-lg dark:border-gray-700">
          {activeStep === steps.length ? (
            <div className="flex justify-center  w-full mt-5">
              <div className=" p-8 m-4">
                <Typography variant="h5" className="mt-10 mb-10 pb-10">
                  Thank you for submitting the form!
                </Typography>
                <Link
                  to="/List"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                >
                  View List
                </Link>
              </div>
            </div>
          ) : (
            <>
              <Typography variant="h5">{getStepContent(activeStep)}</Typography>
              <div className="flex justify-center">
                <div className="flex justify-between w-full mt-4">
                  <Button
                    className="bg-back "
                    disabled={activeStep === 0}
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    disabled={isSubmitting}
                  >
                    {activeStep === steps.length - 1
                      ? isSubmitting
                        ? "Submitting..."
                        : "Submit"
                      : "Next"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
