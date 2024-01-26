import React, { useState, useEffect } from 'react';
import '../profile.css';

const Profile = () => {
    const [userData, setUserData] = useState({
        RealName: '',
        EmailAddress: '',
        BirthDate: '',
        Course:'',
        ProfileImg :'' ,
    });
    const [Geburtsdatum, setGeburtsdatum] = useState('');
    const [Kurs, setKurs] = useState('');

    useEffect(() => {
        // Daten vom Backend abrufen und setzen
        getuser();
    }, []);

    const handleEdit = async () => {
        try {
            const response = await fetch('https://845d97vw4k.execute-api.eu-central-1.amazonaws.com/updateUser', {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "user_id": localStorage.getItem("UserID"),
                    "BirthDate": userData.BirthDate,
                    "Course": userData.Course

                })
            });
        } catch (error) {
            console.error("Fehler beim Bearbeiten des Profils", error);
        }
    };
    const getuser = async () => {
        try {
            const user_id = localStorage.getItem("UserID");
            const url = 'https://845d97vw4k.execute-api.eu-central-1.amazonaws.com/getUser/'+ user_id
            const response = await fetch(url,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    });
            const userData = await response.json()
            setUserData(userData)
            console.log(userData)
        } catch (error) {
            console.error("Fehler beim Bearbeiten des Profils", error);
        }
    };

    const handleChange = (e) => {
        // Aktualisieren Sie den state, wenn Benutzer Änderungen vornimmt
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img src={userData.ProfileImg} alt="Profilbild" />
            </div>
            <div className="profile-details">
                <div>
                    <label>Nutzername: {userData.RealName}</label>
                    {/* <input
                        type="text"
                        name="username"
                        value={userData.RealName}
                        onChange={handleChange}
                    /> */}
                </div>
                
                <div>
                    <label>Mail: {userData.EmailAddress}</label>
                    {/* <input
                        type="email"
                        name="email"
                        value={userData.EmailAddress}
                        onChange={handleChange}
                    /> */}
                </div>
                <div>
                    <label>Kurs:</label>
                    <input
                        type="text"
                        name="course"
                        value={userData.Course}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Gebursts Datum:</label>
                    <input
                        type="text"
                        name="course"
                        value={userData.BirthDate}
                        onChange={handleChange}
                    />
                </div>
                <button onClick={handleEdit}>Profil bearbeiten</button>
            </div>
        </div>
    );
};

export default Profile;