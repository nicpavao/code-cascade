import React, { useState } from "react";
import "../styles.css"; // Import the CSS file

function CodeCascade() {
  const [solution, setSolution] = useState("");
  const [message, setMessage] = useState("");
  const [solved, setSolved] = useState(false);
  const [emails, setEmails] = useState(["", "", ""]);

  const correctSolution = "THIS IS A PROCESSION"; // Correct answer

  const handleSubmit = () => {
    if (solution.trim().toUpperCase() === correctSolution) {
      setMessage("🎉 Correct! You cracked the code!");
      setSolved(true);
    } else {
      setMessage("❌ Incorrect. Try again!");
    }
  };

  const handleEmailChange = (index: number, value: string) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = value;
    setEmails(updatedEmails);
  };

  return (
    <div>
      <h1>Code Cascade</h1>
      <p><i>Crack the Code. Join the Branch. Climb the Leaderboard.</i></p>

      <div className="puzzle-container">
        <p className="puzzle-text">Decode this: VJKU KU C RTQEGUUKQP</p>
        <input
          type="text"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          placeholder="Enter your answer..."
          className="input-box"
        />
        <button onClick={handleSubmit} className="submit-button">
          Submit
        </button>
        <p className="message">{message}</p>
      </div>

      {solved && (
        <div className="invite-container">
          <h2>Invite Three Friends to Join Your Branch!</h2>
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
          <button className="invite-button">Send Invites</button>
          <p className="puzzle-text">Choose wisely - beware of the weakest link.</p>
        </div>
      )}
    </div>
  );
}

export default CodeCascade;
