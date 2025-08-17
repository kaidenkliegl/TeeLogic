import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGolfer, deleteGolfer} from "../../redux/golfers/golferThunk"

export default function GolferList({ onSelect }) {
  const dispatch = useDispatch();
  const { golfers, status, error } = useSelector((state) => state.golfers);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchGolfers());
    }
  }, [status, dispatch]);

  if (status === "loading") return <p>Loading golfers...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Golfers</h2>
      <ul>
        {golfers.map((golfer) => (
          <li key={golfer.id} >
            <button
              onClick={() => onSelect(golfer.id)}
            >
              {golfer.name}
            </button>
            <button
              onClick={() => dispatch(deleteGolfer(golfer.id))}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
