import { useState, useEffect } from "react";
import "../styles.css"; // Import the CSS file

function CodeCascade() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [username, setUsername] = useState("");
  const [cipher, setCipher] = useState("");
  const [solution, setSolution] = useState("");
  const [message, setMessage] = useState("");
  const [solved, setSolved] = useState(false);
  const [emails, setEmails] = useState(["", "", ""]);
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number }[]>([]);
  const [activeTab, setActiveTab] = useState("blocks");

  useEffect(() => {
    fetchPuzzle();
  }, []);

  const fetchPuzzle = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/get_puzzle");
      const data = await response.json();
      setCipher(data.cipher);
      setSolved(false);
      setSolution("");
      setMessage("");
    } catch (error) {
      console.error("Error fetching puzzle:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/check_solution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solution }),
      });
      const data = await response.json();
      setMessage(data.message);

      if (data.correct) {
        setSolved(true);
        setScore(score + 2);
        updateLeaderboard();
      }
    } catch (error) {
      console.error("Error checking solution:", error);
    }
  };

  const updateLeaderboard = async () => {
    try {
      await fetch("http://127.0.0.1:5000/update_leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username || "Anonymous", score: score + 2 }),
      });
      fetchLeaderboard();
    } catch (error) {
      console.error("Error updating leaderboard:", error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/get_leaderboard");
      const data = await response.json();
      setLeaderboard(data.leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const handleEmailChange = (index: number, value: string) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = value;
    setEmails(updatedEmails);
  };

  const handleInvite = () => {
    if (emails.every(email => email.trim() !== "")) {
      alert("Invites sent successfully!");
      setEmails(["", "", ""]);
    } else {
      alert("Please enter all three email addresses.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      {showWelcome ? (
        <div className="welcome-screen">
          <h1>Welcome to Code Cascade</h1>
          <p><i>Crack the Code. Join the Branch. Climb the Leaderboard.</i></p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="input-box"
          />
          <button className="start-button" onClick={() => setShowWelcome(false)}>Start Game</button>
        </div>
      ) : (
        <>
          <h1>Code Cascade</h1>
          <p><i>Crack the Code. Join the Branch. Climb the Leaderboard.</i></p>
          
          <div className="tabs">
            <button className={activeTab === "blocks" ? "active-tab" : ""} onClick={() => setActiveTab("blocks")}>Your Blocks</button>
            <button className={activeTab === "leaderboard" ? "active-tab" : ""} onClick={() => setActiveTab("leaderboard")}>Leaderboard</button>
          </div>
          
          {activeTab === "blocks" && (
            <div className="puzzle-container">
              <p className="puzzle-text">Decode this: {cipher}</p>
              <input
                type="text"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="Enter your answer..."
                className="input-box"
              />
              <button onClick={handleSubmit} className="submit-button">Submit</button>
              <p className="message">{message}</p>
              {solved && (
                <div className="invite-container">
                  <h2>Invite Three Friends</h2>
                  {emails.map((email, index) => (
                    <input
                      key={index}
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      placeholder="Enter email address..."
                      className="input-box"
                    />
                  ))}
                  <button className="invite-button" onClick={handleInvite}>Send Invites</button>
                </div>
              )}
            </div>
          )}

          {activeTab === "leaderboard" && (
            <div className="leaderboard" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
              <h2>Leaderboard</h2>
              <ul style={{ listStyle: "none", padding: 0, textAlign: "center" }}>
                {leaderboard.sort((a, b) => b.score - a.score).map((player, index) => (
                  <li key={index} style={{ margin: "5px 0" }}>{player.name}: {player.score} points</li>
                ))}
              </ul>
              <button onClick={() => { setLeaderboard([]); localStorage.removeItem("leaderboard"); }} className="reset-button">Reset Leaderboard</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CodeCascade;