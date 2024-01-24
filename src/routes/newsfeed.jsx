import React, { useState, useEffect } from 'react';
import '../newsfeed.css';
import newsfeedItem from 'src/routes/components/newsfeedItem.jsx';

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
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://845d97vw4k.execute-api.eu-central-1.amazonaws.com/getAllPosts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        console.log(data);

        if (data.status === 'ok') {
          // Nutzerdaten im State aktualisieren
          setUserData(data); // Annahme: Das Backend gibt die Nutzerdaten als "userData" zurück
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
      <img src="https://cdn.discordapp.com/attachments/1195301143161606205/1195301598507827240/techst_logo_rz_white.png?ex=65b37e5c&is=65a1095c&hm=951cba6cabd865ab2f4e7c4fd8e295c18bb4f3b9a3474d434849184a84fcbd48&" alt="Logo" className="logo" />
      <div className="chat">
        <div className="messages">
          {messages.slice(-1000).map((message, index) => (
           <div className="message">
           <UserProfile username={message.username} />
           <p>{message.text}</p>
           {message.image && <img src={message.image} alt="Uploaded" />} {/* Display the uploaded image */}
           {message.timestamp && <p>Posted at: {new Date(message.timestamp).toLocaleTimeString()}</p>}
           <Reactions reactions={message.reactions || []} />
          </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            id="fileInput"
          />
          <label htmlFor="fileInput" className="upload-button">Upload Image</label>
          {/* <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          /> */}
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
