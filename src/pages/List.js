import React, { useEffect, useState } from "react";
import Table from "../component/VTable";
import Layout from "../component/Layout";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import axiosInstance from "../api/axiosInstance.js";
export default function List() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user list on mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axiosInstance.get("/user-list");
        // Assuming the API returns { data: [ ...users ] }
        setUsers(res.data.data || res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
        setError("Could not load users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users…</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const columns = [
    {
      title: "#",
      dataIndex: "srno",
      key: "srno",
    },
    {
      title: " Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone No",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },

    {
      title: "Action",
      render: (item) => (
        <>
          <div className="flex gap-1 text-center justify-center">
            <Link to="#">
              <Trash2 color="#ff0000" size={16} />
            </Link>
          </div>
        </>
      ),
      key: "action",
      width: 90,
    },
  ];
  const data = [
    {
      srno: 1,
      name: "Neha",
      email: "abc@gmail.com",
      phoneno: "9898767656",
      gender: "Female",
    },
    {
      srno: 2,
      name: "Ira",
      email: "abc@gmail.com",
      phoneno: "9898767656",
      gender: "Female",
    },
  ];
  const processedUsers = users.map((user, idx) => ({
    ...user,
    srno: idx + 1,
  }));

  return (
    <>
      <Layout>
        <div className="bg-white p-4 mb-2 rounded-lg  dark:border-gray-700 mt-14">
          <div>
            <h3 class="!text-defaulttextcolor dark:!text-defaulttextcolor/70 dark:text-white text-left dark:hover:text-white text-[1.125rem] font-semibold">
              List
            </h3>
          </div>
        </div>
        <div className="bg-white">
          <div className="p-4 rounded-lg dark:border-gray-700 ">
            <div className="flex justify-end mb-3 p-2">
              <Link
                to="/Stepperform"
                className="rounded-lg px-4 py-2 bg-green-700 text-green-100 hover:bg-green-800 duration-300"
              >
                Add
              </Link>
            </div>
            <Table cols={columns} data={processedUsers} />
          </div>
        </div>
      </Layout>
    </>
  );
}
