import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createReservation,
  updateReservation,
  deleteReservation,
  fetchReservations,
} from "../../redux/reservation/reservationsThunks";
import { fetchPricingRules } from "../../redux/pricing/pricingThunks";
import "./Form.css";

function ReservationForm({ reservation, pricingRulesTitle }) {
  const dispatch = useDispatch();
  const currentTeeTime = useSelector((state) => state.teetimes.current);
  const pricingRules = useSelector((state) => state.pricing.pricingRules) || [];
console.log(pricingRulesTitle)
  const [golferName, setGolferName] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [golferNumber, setGolferNumber] = useState("");
  const [golferEmail, setGolferEmail] = useState("");
  const [selectedPricing, setSelectedPricing] = useState("");

  useEffect(() => {
    if (reservation) {
      setGolferName(reservation.golfer?.fullname || "");
      setTotalPrice(reservation.total_price || "");
      setGolferNumber(reservation.golfer?.phone_number || "");
      setGolferEmail(reservation.golfer?.email || "");
      setSelectedPricing(reservation.pricing_rule_id || "");
    } else {
      clearForm();
    }
  }, [reservation]);

  useEffect(() => {
    dispatch(fetchPricingRules());
  }, [dispatch]);

  useEffect(() => {
    if (selectedPricing) {
      const rule = pricingRules.find(
        (r) => r.id.toString() === selectedPricing.toString()
      );
      if (rule) setTotalPrice(rule.rate);
    }
  }, [selectedPricing, pricingRules]);

  const clearForm = () => {
    setGolferName("");
    setTotalPrice("");
    setGolferNumber("");
    setGolferEmail("");
    setSelectedPricing("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!golferName.trim()) return alert("Enter golfer name");
    if (!totalPrice) return alert("Enter total price");

    const payload = {
      golfer: golferName.trim(),
      phone_number: golferNumber || null,
      email: golferEmail || null,
      total_price: Number(totalPrice),
      pricing_rule_id: selectedPricing || null,
    };

    if (reservation?.id) {
      // Update existing reservation
      await dispatch(
        updateReservation({ reservationId: reservation.id, data: payload })
      );
      console.log(reservation.id);
    } else {
      // Create new reservation
      await dispatch(
        createReservation({ tee_time_id: currentTeeTime?.id, ...payload })
      );
    }

    // Refresh reservations after either create or update
    if (currentTeeTime?.id) {
      await dispatch(fetchReservations({ teeTimeId: currentTeeTime.id }));
    }
  };

  const handleDelete = async () => {
    if (reservation?.id) {
      await dispatch(deleteReservation(reservation.id));
      if (currentTeeTime?.id) {
        await dispatch(fetchReservations({ teeTimeId: currentTeeTime.id }));
      }
    }
    clearForm();
  };

  return (
    <div className="reservation-form-container">
      <div className="delete-button-container">
        <button className="resv-delt" type="button" onClick={handleDelete}>
          X
        </button>
      </div>
      <h3>{reservation ? "Edit Reservation" : "New Reservation"}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Golfer Full Name:</label>
          <input
            type="text"
            value={golferName}
            onChange={(e) => setGolferName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Phone Number (optional):</label>
          <input
            type="tel"
            value={golferNumber}
            onChange={(e) => setGolferNumber(e.target.value)}
            placeholder="e.g. 555-123-4567"
          />
        </div>

        <div>
          <label>Email (optional):</label>
          <input
            type="email"
            value={golferEmail}
            onChange={(e) => setGolferEmail(e.target.value)}
            placeholder="e.g. name@example.com"
          />
        </div>

        <div>
          <label>Pricing Rule:</label>
          <select
            value={selectedPricing}
            onChange={(e) => setSelectedPricing(e.target.value)}
          >
            {pricingRulesTitle ? (
              // Show saved rule first
              <option value="">{pricingRulesTitle}</option>
            ) : (
              // Default placeholder
              <option value="">-- Select Pricing --</option>
            )}
            {pricingRules.map((rule) => (
              <option key={rule.id} value={rule.id}>
                {rule.title} - {rule.day_of_week} (${rule.rate})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Total Price: $</label>
          <input
            type="number"
            value={totalPrice}
            onChange={(e) => setTotalPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <button type="submit" className="resv-save">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
