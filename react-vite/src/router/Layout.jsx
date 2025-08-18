import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import DatePicker from "../components/Calender/Calender";
import { setDate } from "../redux/calender/dateSlice";

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <ModalProvider>
        <Navigation />
        <DatePicker onDateSelect={(date) => dispatch(setDate(date))} />
        {isLoaded && <Outlet />}
        <Modal />
      </ModalProvider>
    </>
  );
}
