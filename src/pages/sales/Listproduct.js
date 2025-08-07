import React, { useEffect, useState } from "react";
import Table from "../../component/VTable";
import Layout from "../../component/Layout";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance.js";
export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  //   const data = [
  //     {
  //       srno: 1,
  //       name: "Shirts",
  //       description: "Lorem ipsum dolor sit amet",
  //       Price: "Rs.200/-",
  //     },
  //     {
  //       srno: 1,
  //       name: "T-Shirts",
  //       productimg: "abc@gmail.com",
  //       description: "Lorem ipsum dolor sit amet",
  //       Price: "Rs.200/-",
  //     },
  //     {
  //       srno: 1,
  //       name: "Neha",
  //       productimg: "abc@gmail.com",
  //       description: "Lorem ipsum dolor sit amet",
  //       Price: "Rs.200/-",
  //     },
  //   ];
  async function getProducts() {
    const res = await axiosInstance.get("/product-list");
    console.log("Products loaded:", res.data);
    return res.data.data || res.data;
  }
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProducts();
        setProducts(
          data.map((p, idx) => ({
            srno: idx + 1,
            id: p.id,
            name: p.name,
            price: p.price,
            description: p.description,

            image: p.image,
          }))
        );
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  const columns = [
    { title: "#", dataIndex: "srno", key: "srno" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (url) => (
        <div className="flex justify-center">
          <img
            src={url || "/assets/image/shirt.webp"}
            alt="product"
            width={50}
            height={50}
            className="rounded"
          />
        </div>
      ),
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
    <>
      <Layout>
        <div className="bg-white p-4 mb-2 rounded-lg  dark:border-gray-700 mt-14">
          <div>
            <h3 class="!text-defaulttextcolor dark:!text-defaulttextcolor/70 dark:text-white text-left dark:hover:text-white text-[1.125rem] font-semibold">
              Product
            </h3>
          </div>
        </div>
        <div className="bg-white">
          <div className="p-4 rounded-lg dark:border-gray-700 ">
            <div className="flex justify-end mb-3 p-2">
              <Link
                to="/Add-product"
                className="rounded-lg px-4 py-2 bg-green-700 text-green-100 hover:bg-green-800 duration-300"
                // onClick={getProducts}
              >
                Add Product
              </Link>
            </div>
            <Table cols={columns} data={products} isTableLoading={loading} />
          </div>
        </div>
      </Layout>
    </>
  );
}
