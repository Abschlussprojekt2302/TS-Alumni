import React, { useState, useEffect } from 'react';
import '../newsfeed.css';

const UserProfile = ({ username }) => (
  <div className="user-profile">
    <img src="default-profile-picture.jpg" alt={`${username}'s profile`} />
    <p>{username}</p>
  </div>
);

const Reactions = ({ reactions }) => (
  <div className="reactions">
    {reactions.map((reaction, index) => (
      <span key={index}>{reaction.emoji} by {reaction.username}</span>
    ))}
  </div>
);

const NewsFeed = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [userData, setUserData] = useState({}); // State für Nutzerdaten hinzugefügt

  useEffect(() => {
    // Hier fügst du den Code ein, um die Nutzerdaten vom Backend abzurufen
    // Verwende dazu z.B. Fetch oder Axios
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://845d97vw4k.execute-api.eu-central-1.amazonaws.com/getAllPosts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionData: {},
          }),
        });

        const data = await response.json();

        if (data.status === 'ok') {
          // Nutzerdaten im State aktualisieren
          setUserData(data.userData); // Annahme: Das Backend gibt die Nutzerdaten als "userData" zurück
        } else {
          console.error('Fehler beim Abrufen der Nutzerdaten');
        }
      } catch (error) {
        console.error('Fehler beim Netzwerkaufruf', error);
      }
    };

    fetchUserData();
  }, []); // Leere Abhängigkeitsliste bedeutet, dass dieser Effekt nur einmal nach der Montage aufgerufen wird

  const handleSendMessage = () => {
    if ((newMessage.trim() !== '' || uploadedImage) && username.trim() !== '') {
      // Hier kannst du die Nutzerdaten in deine Nachricht integrieren
      const newPost = {
        text: newMessage,
        username: username,
        timestamp: Date.now(),
        image: uploadedImage,
        // Nutzerdaten integrieren (Beispiel)
        userId: userData.userId,
        userFullName: userData.fullName,
      };
      setMessages([...messages, newPost]);
      setNewMessage('');
      setUploadedImage(null);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="app">
      {/* ... (Dein restlicher Code) */}
    </div>
  );
};

export default NewsFeed;
