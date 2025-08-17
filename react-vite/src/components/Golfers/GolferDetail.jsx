import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchGolfer } from "../../redux/golfers/golferThunk"

export default function GolferDetail({ golferId }) {
  const dispatch = useDispatch();
  const { currentGolfer } = useSelector((state) => state.golfers);

  useEffect(() => {
    if (golferId) {
      dispatch(fetchGolfer(golferId));
    }
  }, [golferId, dispatch]);

  if (!golferId) return <p>Select a golfer to view details.</p>;
  if (!currentGolfer) return <p>Loading golfer...</p>;

  return (
    <div>
      <h2>{currentGolfer.name}</h2>
      <p><strong>Email:</strong> {currentGolfer.email}</p>
      <p><strong>Course:</strong> {currentGolfer.course?.name}</p>
    </div>
  );
}
