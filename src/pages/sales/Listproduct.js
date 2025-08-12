import React, { useEffect, useState, useCallback } from "react";
import Table from "../../component/VTable";
import Layout from "../../component/Layout";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance.js";
import { API } from "../../config/apiEndpoints";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // server pagination state
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // fetch wrapper
  const getProducts = useCallback(
    async (currentPage = 1, currentPerPage = perPage) => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token") || "";
        const res = await axiosInstance.get(API.PRODUCTS.LIST, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: Number(currentPage) || 1,
            perPage: Number(currentPerPage) || 10,
          },
        });

        const payload = res?.data ?? {};
        const items = payload?.data ?? payload ?? [];

        const serverPerPage = payload?.perPage;
        const current = payload?.currentPage;
        const last = payload?.lastPage ?? 1;
        const total = payload?.total ?? items.length;

        setPerPage(Number(serverPerPage) || Number(currentPerPage) || 10);
        setTotalPages(Number(last) || 1);
        setTotalRecords(Number(total) || 0);
        setPage(Number(current) || Number(currentPage) || 1);

        // Map items into rows expected by VTable
        setProducts(
          (items || []).map((p, idx) => ({
            srno:
              (Number(current) - 1) *
                (Number(serverPerPage) || Number(currentPerPage)) +
              idx +
              1,
            id: p.id,
            name: p.name,
            price: p.price,
            description: p.description,
            image: p.image,
            raw: p,
          }))
        );
      } catch (err) {
        console.error("Failed to load products", err);
        setProducts([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    },
    [perPage]
  );

  // initial load and refetch when page / perPage changes
  useEffect(() => {
    getProducts(page, perPage);
  }, [page, perPage, getProducts]);

  // handlers passed to VTable
  const handlePageChange = (newPage) => {
    const np = Number(newPage) || 1;
    if (np < 1) return;
    // guard: don't go beyond last (optional)
    if (totalPages && np > totalPages) return;
    setPage(np);
  };

  const handleRowsPerPageChange = (newPerPage) => {
    const np = Number(newPerPage) || 10;
    setPerPage(np);
    // when changing per-page, usually reset to first page
    setPage(1);
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
      render: (item) => {
        const priceVal =
          item?.price ?? (typeof item === "number" ? item : item);
        return `₹ ${priceVal ?? ""}`;
      },
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
            isTableLoading={isLoading}
            page={page}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            handleRowsPerPageChange={handleRowsPerPageChange}
          />

          <div className="text-xs text-gray-500 mt-2">
            Showing page {page} of {totalPages} — total {totalRecords} products
          </div>
        </div>
      </div>
    </Layout>
  );
}
