import React, { useState } from "react";
import Layout from "../../component/Layout";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance.js";
export default function Addproduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
    previewUrl: null,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        previewUrl: URL.createObjectURL(file),
      }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Product name is required";
    if (!formData.description.trim())
      errs.description = "Description is required";
    if (!formData.price.trim() || isNaN(formData.price))
      errs.price = "Valid price is required";
    if (!formData.image) errs.image = "Product image is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("price", formData.price);
      payload.append("image", formData.image);
      payload.append("token", localStorage.getItem("token"));

      // THIS is the API call:
      const res = await axiosInstance.post("/add-product", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("ADD PRODUCT RESPONSE:", res.data);
      if (res.status === 200) {
        alert("Product added successfully");
        navigate("/Product");
      }
    } catch (err) {
      console.error("Add product error", err);
      alert("Failed to add product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Layout>
        <div className="bg-white p-4 mb-2 rounded-lg  dark:border-gray-700 mt-14">
          <div>
            <h3 class="!text-defaulttextcolor dark:!text-defaulttextcolor/70 dark:text-white text-left dark:hover:text-white text-[1.125rem] font-semibold">
              Add Product
            </h3>
          </div>
        </div>
        <div className="bg-white">
          <div className="p-4 rounded-lg dark:border-gray-700 ">
            <div className="">
              <div className="w-full ">
                <form action="/" method="post">
                  <div className="mb-4">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-700 text-left"
                      for="firstName"
                    >
                      Product Name
                    </label>
                    <input
                      className="w-full px-3 py-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="firstName"
                      type="text"
                      placeholder="Product Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm">{errors.name}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-700 text-left"
                      for="firstName"
                    >
                      Product Image
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        for="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          hidden
                          onChange={handleImageChange}
                          disabled={submitting}
                        />
                      </label>
                      {formData.previewUrl && (
                        <img
                          src={formData.previewUrl}
                          alt="preview"
                          className="ml-4 h-20 w-20 object-cover rounded"
                        />
                      )}
                    </div>{" "}
                    {errors.image && (
                      <p className="text-red-600 text-sm">{errors.image}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-700 text-left"
                      for="firstName"
                    >
                      Description
                    </label>
                    <textarea
                      placeholder="Description"
                      className="w-full px-3 py-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      disabled={submitting}
                    />
                    {errors.description && (
                      <p className="text-red-600 text-sm">
                        {errors.description}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-700 text-left"
                      for="firstName"
                    >
                      Price
                    </label>
                    <input
                      className="w-full px-3 py-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="price"
                      type="text"
                      placeholder="Price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      disabled={submitting}
                    />
                    {errors.price && (
                      <p className="text-red-600 text-sm">{errors.price}</p>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <Link
                      to="/Product"
                      type="button"
                      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                      disabled={submitting}
                    >
                      Back
                    </Link>
                    <button
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      disabled={submitting}
                      onClick={handleSubmit}
                    >
                      {submitting ? "Adding..." : "Submit"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
