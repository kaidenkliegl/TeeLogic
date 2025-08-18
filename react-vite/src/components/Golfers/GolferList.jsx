import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGolfers, deleteGolfer } from "../../redux/golfers/golferThunk";
import { useNavigate } from "react-router-dom";

export default function GolferList({ onSelect }) {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { golfers, status, error } = useSelector((state) => state.golfers);

  useEffect(() => {
    console.log(status);
    if (status === "idle") {
      dispatch(fetchGolfers());
    }
  }, [status, dispatch]);
  console.log(golfers);

  if (status === "loading") return <p>Loading golfers...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Golfers</h2>
      <ul>
        {golfers.map((golfer) => (
          <button onClick={() => navigate(`/golfer/${golfer.id}`)}>
            <li key={golfer.id}>
              <h1>{golfer.fullname}</h1>
              {/* <button
              onClick={() => dispatch(deleteGolfer(golfer.id))}
            >
              Delete
            </button> */}
            </li>
          </button>
        ))}
      </ul>
    </div>
  );
}
