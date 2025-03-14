import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
const UserDashboard = () => {
  const [appliedSchemes, setAppliedSchemes] = useState([]);
  const [blogs, setBlogs] = useState([]);

  const user = JSON.parse(localStorage.getItem("auth")) || {
    auth: false,
    id: "",
  };

  useEffect(() => {
    const fetchUser = async () => {
      const [blogsResponse, userResponse] = await Promise.all([
        axios.get("http://localhost:3000/blog"),
        axios.get(`http://localhost:3000/users/${user.email}`),
      ]);
      const filteredBlogs = blogsResponse.data.filter(
        (blog) => blog.author === user.email
      );
      setBlogs(filteredBlogs);
      setAppliedSchemes(userResponse.data.appliedSchemes);
    };
    fetchUser();
  }, [user.email]);

  const data = [
    { name: "Vegetables", profit: 20000 },
    { name: "Dairy items" , profit: 15000 },
    { name: "Grains", profit: 10000 },
    { name: "Fruits", profit: 5000 },
    { name: "Poultry", profit: 8000 },
  ];
  const dummyData = {
    pendingSchemes: 5,
    grantedSchemes: 10,
    totalAmountReceived: 500000,
    mostLikedBlog: "The Future of Agriculture",
    mostLikedBlogLikes: 120,
  };

  return (
    <div className=" h-[calc(100vh-90px)] rounded-lg p-8 mb-8 flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
      <div className="flex-1 p-2">
        {user && (
          <>
            <div className="bg-gray-100 p-6 rounded-lg flex items-center space-x-6 mb-6">
              <img
                src={user.img}
                alt="User"
                className="w-24 h-24 rounded-full object-cover border-4 border-green-600"
              />
              <div>
                <p className="text-2xl font-semibold text-green-700">
                  {user.name}
                </p>
                <p className="text-sm text-gray-600">
                  Profit:{user.profit} ₹ 50000
                </p>
                <p className="text-sm text-gray-600">Email: {user.email}</p>
                <p className="text-sm text-gray-600">Role: {user.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <p className="text-xl font-semibold text-green-700 mb-2">
                  Applied Schemes
                </p>
                <p className="text-lg text-gray-700">
                  <strong>Total Applied:</strong> {appliedSchemes.length}
                </p>
                <p className="text-lg text-gray-700">
                  <strong>Pending Schemes:</strong> {dummyData.pendingSchemes}
                </p>
                <p className="text-lg text-gray-700">
                  <strong>Granted Schemes:</strong> {dummyData.grantedSchemes}
                </p>
                <p className="text-lg text-gray-700">
                  <strong>Total Amount Received:</strong> ₹
                  {dummyData.totalAmountReceived}
                </p>
              </div>

              {/* Blogs Card */}
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <p className="text-xl font-semibold text-green-700 mb-2">
                  Blogs
                </p>
                <p className="text-lg text-gray-700">
                  <strong>Total Blogs Posted:</strong> {blogs.length}
                </p>
                <p className="text-lg text-gray-700">
                  <strong>Most Liked Blog:</strong> "{dummyData.mostLikedBlog}"
                </p>
                <p className="text-lg text-gray-700">
                  <strong>Likes:</strong> {dummyData.mostLikedBlogLikes}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bar Graph Section */}
      <div className="flex-1">
        <div className="bg-gray-100 p-4 rounded-lg shadow-inner h-[300px] lg:h-full overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 40, right: 30, left: 0, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ angle: -45, textAnchor: "end" }}
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="profit" fill="#82ca9d" />
              {/* Adding Title */}
              <text
                x="50%"
                y="20"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-lg font-semibold text-green-700"
              >
                Profit by Product
              </text>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
