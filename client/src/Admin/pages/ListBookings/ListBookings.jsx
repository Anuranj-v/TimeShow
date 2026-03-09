import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUsersTheatres = () => {

    const [users, setUsers] = useState([]);
    const [theatres, setTheatres] = useState([]);

    const loadData = () => {

        axios.get("http://127.0.0.1:8000/AdminUsersTheatres/")
            .then(res => {

                setUsers(res.data.users);
                setTheatres(res.data.theatres);

            });

    };

    useEffect(() => {

        loadData();

    }, []);


    // APPROVE THEATRE
    const approveTheatre = (id) => {

        axios.put(`http://127.0.0.1:8000/ApproveTheatre/${id}/`)
            .then(() => {

                alert("Theatre Approved");

                loadData();

            });

    };


    // REJECT THEATRE
    const rejectTheatre = (id) => {

        axios.put(`http://127.0.0.1:8000/RejectTheatre/${id}/`)
            .then(() => {

                alert("Theatre Rejected");

                loadData();

            });

    };


    return (

        <div>

            <h2>Users</h2>

            <table border="1">

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact</th>
                        <th>City</th>
                    </tr>
                </thead>

                <tbody>

                    {users.map((u, i) => (

                        <tr key={i}>
                            <td>{u.id}</td>
                            <td>{u.user_name}</td>
                            <td>{u.user_email}</td>
                            <td>{u.user_contact}</td>
                            <td>{u.city}</td>
                        </tr>

                    ))}

                </tbody>

            </table>


            <h2 style={{ marginTop: "40px" }}>Theatres</h2>

            <table border="1">

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact</th>
                        <th>City</th>
                        <th>Status</th>
                        {/* <th>Action</th> */}
                    </tr>
                </thead>

                <tbody>

                    {theatres.map((t, i) => (

                        <tr key={i}>

                            <td>{t.id}</td>
                            <td>{t.theater_name}</td>
                            <td>{t.theater_email}</td>
                            <td>{t.theater_contact}</td>
                            <td>{t.city}</td>

                            <td>

                                {t.theater_status === 0 && "Pending"}
                                {t.theater_status === 1 && "Approved"}
                                {t.theater_status === 2 && "Rejected"}

                            </td>

                            {/* <td>

                                {t.theater_status === 0 && (
                                    <>
                                        <button
                                            onClick={() => approveTheatre(t.id)}
                                        >
                                            Approve
                                        </button>

                                        <button
                                            onClick={() => rejectTheatre(t.id)}
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}

                            </td> */}

                        </tr>

                    ))}

                </tbody>

            </table >

        </div >

    );

};

export default AdminUsersTheatres;