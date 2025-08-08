import React, { useState } from "react";
import Table from "../component/VTable";
import Layout from "../component/Layout";
import { Link, useLocation } from "react-router-dom";
import { Trash2 } from "lucide-react";
import axiosInstance from "../api/axiosInstance.js";
import { deleteUser } from "../api/apiActions.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Fetch users with backend pagination
const fetchUsers = async ({ queryKey }) => {
  const [_key, page] = queryKey;
  const res = await axiosInstance.get(`/user-list?page=${page}`);

  return {
    records: res.data?.data || [],
    totalPages: res.data?.lastPage || 1, // use lastPage directly
  };
};

export default function List() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const location = useLocation();
  const refreshFlag = location.state?.refresh || 0;

  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["users", page, refreshFlag],
    queryFn: fetchUsers,
    keepPreviousData: true,
    staleTime: 0,
    retry: 1,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteMutation.mutateAsync(userId);
      alert("User deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete user. Please try again.");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (data?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  if (isLoading) return <p>Loading users…</p>;
  if (error) return <p className="text-red-500">Could not load users</p>;

  const records = data?.records || [];
  const totalPages = data?.totalPages || 1;

  const processedUsers = records.map((user, idx) => ({
    ...user,
    srno: (page - 1) * rowsPerPage + idx + 1,
  }));

  const columns = [
    { title: "#", dataIndex: "srno", key: "srno" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone No", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    {
      title: "Action",
      render: (item) => (
        <div className="flex gap-1 justify-center">
          <button onClick={() => handleDelete(item.id)}>
            <Trash2 color="#ff0000" size={16} />
          </button>
        </div>
      ),
      key: "action",
      width: 90,
    },
  ];

  return (
    <Layout>
      <div className="bg-white p-4 mb-2 rounded-lg mt-14">
        <h3 className="text-left text-[1.125rem] font-semibold">List</h3>
      </div>

      <div className="bg-white p-4 rounded-lg">
        <div className="flex justify-end mb-3">
          <Link
            to="/Stepperform"
            className="rounded-lg px-4 py-2 bg-green-700 text-green-100 hover:bg-green-800 duration-300"
          >
            Add
          </Link>
        </div>

        <Table
          cols={columns}
          data={processedUsers}
          page={page}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          isTableLoading={isFetching}
        />
      </div>
    </Layout>
  );
}
