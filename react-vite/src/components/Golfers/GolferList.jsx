import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGolfers } from "../../redux/golfers/golferThunk";
import GolferDetail from "./GolferDetail";
import "./GolferPage.css"; 

export default function GolferPage() {
  const dispatch = useDispatch();
  const { golfers, status} = useSelector((state) => state.golfers);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGolferId, setSelectedGolferId] = useState(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchGolfers());
    }
  }, [status, dispatch]);

  const filteredGolfers = golfers.filter((golfer) =>
    golfer.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectGolfer = (golferId) => {
    setSelectedGolferId(golferId);
  };

  return (
    <div className="golfer-page-container">
      {/* Golfer list */}
      <div className="golfer-list-container">
        <h1>Golfers</h1>
        <input
          type="text"
          placeholder="Search golfers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="golfer-search-input"
        />
        <ul className="golfer-list">
          {filteredGolfers.map((golfer) => (
            <li key={golfer.id}>
              <button
                onClick={() => handleSelectGolfer(golfer.id)}
                className={`golfer-name-button ${selectedGolferId === golfer.id ? "selected" : ""}`}
              >
                {golfer.fullname}
              </button>
            </li>
          ))}
          {filteredGolfers.length === 0 && <li>No golfers found</li>}
        </ul>
      </div>

      {/* Golfer detail */}
      <div className="golfer-detail-wrapper">
        {selectedGolferId ? (
          <GolferDetail golferId={selectedGolferId} />
        ) : (
          <p>Select a golfer to see details</p>
        )}
      </div>
    </div>
  );
}
