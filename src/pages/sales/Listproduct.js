import React, { useEffect, useState } from "react";
import Table from "../../component/VTable";
import Layout from "../../component/Layout";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance.js";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ New states for pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products from API with page param
  async function getProducts(currentPage) {
    const res = await axiosInstance.get(`/product-list?page=${currentPage}`);
    console.log("Products loaded:", res.data);

    // Adjust according to backend response
    const data = res.data?.data || res.data || [];
    const lastPage = res.data?.lastPage || res.data?.meta?.last_page || 1;

    setTotalPages(lastPage);

    // Add serial number based on current page
    setProducts(
      data.map((p, idx) => ({
        srno: (currentPage - 1) * 10 + idx + 1, // ✅ Correct sr no for page
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description,
        image: p.image,
      }))
    );
  }

  // Load products on page change
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        await getProducts(page);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [page]); // Re-fetch when page changes

  //  Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const columns = [
    { title: "#", dataIndex: "srno", key: "srno" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (row) => {
        const url = typeof row === "string" ? row : row?.image;
        return (
          <div className="flex justify-center">
            <img
              src={url || "/assets/image/shirt.webp"}
              alt="product"
              width={50}
              height={50}
              className="rounded"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/assets/image/shirt.webp";
              }}
            />
          </div>
        );
      },
    },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (p) => `₹ ${p.price}`,
    },
  ];

  return (
    <Layout>
      <div className="bg-white p-4 mb-2 rounded-lg dark:border-gray-700 mt-14">
        <h3 className="!text-defaulttextcolor dark:!text-defaulttextcolor/70 dark:text-white text-left dark:hover:text-white text-[1.125rem] font-semibold">
          Product
        </h3>
      </div>
      <div className="bg-white">
        <div className="p-4 rounded-lg dark:border-gray-700">
          <div className="flex justify-end mb-3 p-2">
            <Link
              to="/Add-product"
              className="rounded-lg px-4 py-2 bg-green-700 text-green-100 hover:bg-green-800 duration-300"
            >
              Add Product
            </Link>
          </div>

          <Table
            cols={columns}
            data={products}
            isTableLoading={loading}
            page={page}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </Layout>
  );
}
