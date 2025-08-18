import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchGolfer } from "../../redux/golfers/golferThunk";
import { useParams } from "react-router-dom";


export default function GolferDetail() {
  const dispatch = useDispatch();
  const { id } = useParams(); 
  const { currentGolfer, status, error } = useSelector((state) => state.golfers);

  useEffect(() => {
    if (id) {
      dispatch(fetchGolfer(Number(id)));
    }
  }, [id, dispatch]);

  if (status === "loading") return <p>Loading golfer...</p>;
  if (status === "failed") return <p>Error: {error}</p>;
  if (!currentGolfer) return <p>No golfer found.</p>;

  return (
    <div>
      <h2>{currentGolfer.fullname}</h2>
      <p><strong>Email:</strong> {currentGolfer.email}</p>
      <p><strong>Course:</strong> {currentGolfer.course?.name}</p>
    </div>
  );
}
