import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import axios from "axios";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [, setJobProfiles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch uploaded PDFs (User Profiles)
        axios.get("http://localhost:5000/get_uploads")
            .then(response => {
                const filteredUsers = response.data.filter(user => user.role !== "Admin");
                setUsers(filteredUsers);
            })
            .catch(error => console.error("❌ Error fetching user profiles:", error));

        // Fetch Job Profiles
        axios.get("http://localhost:5000/get_jobs")
            .then(response => {
                setJobProfiles(response.data);
            })
            .catch(error => console.error("❌ Error fetching job profiles:", error));
    }, []);

    const handleAddJobProfile = (email) => {
        navigate(`/Notification?email=${encodeURIComponent(email)}`);
    };

    const handleDeleteUser = (email) => {
        axios.delete(`http://localhost:5000/delete_user/${email}`)
            .then(() => {
                setUsers(users.filter(user => user.email !== email));
            })
            .catch(error => console.error("❌ Error deleting user:", error));
    };

    return (
        <div className="flex flex-col p-4 gap-4 min-h-screen">
            {/* Navigation Buttons */}
            <div className="flex space-x-4 mb-4">
                <button 
                    onClick={() => navigate("/RankTable")}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    View Ranking Table
                </button>
                <button 
                    onClick={() => navigate("/Allowed")}
                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                    User Management
                </button>
            </div>

            <div className="flex-1">
                <Card>
                    <CardContent>
                        <h2 className="text-xl font-semibold mb-4">User Profiles</h2>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Uploaded PDF</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length > 0 ? (
                                    users.map((user, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                {user.cv_filename ? (
                                                    <a 
                                                        href={`http://localhost:5000/uploads/${user.cv_filename}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="text-blue-500"
                                                    >
                                                        View PDF
                                                    </a>
                                                ) : (
                                                    "No PDF"
                                                )}
                                            </TableCell>
                                            <TableCell className="flex space-x-4">
                                                <button 
                                                    onClick={() => handleAddJobProfile(user.email)}
                                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                >
                                                    View Job Profile
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteUser(user.email)}
                                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center">
                                            No user data available
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
