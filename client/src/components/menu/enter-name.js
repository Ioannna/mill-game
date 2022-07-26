import { useEffect, useState } from "react";

const EnterName = ({ socket }) => {
  const [playerName, setPlayerName] = useState("");
  const [hideInput, setHideInput] = useState(false)
  const [error, setError] = useState();

//   useEffect(() => {
//     socket.on("add-playerName-error", () => {
//       setError("Name is already used!");
//     });
//   });

  const handlePlayerNameChange = (e) => {
    setPlayerName(e.target.value);
    setError();
  };

  const addPlayerName = () => {
    if (playerName.length) {
      socket.emit("add-player-name", playerName);
      setHideInput(true)
    } else {
      setError("Player Name is required!");
    }
  };

    if (!hideInput) {
        return (
            <>
              <div className="d-flex mt20">
                <div className="text-input-container">
                  <input
                    type="text"
                    placeholder="Enter player name"
                    value={playerName}
                    onChange={handlePlayerNameChange}
                    className="text-input"
                  ></input>
                </div>
                <button onClick={addPlayerName}>Add</button>
              </div>
              {error ? <p className="error">{error}</p> : null}
            </>
          );
    } else {
        return (<div>{`Welcome, ${playerName}`}</div>)
    }


};

export default EnterName;
