import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/axios";
import "../styles/createTrip.css";

function CreateTrip() {
  const [destination, setDestination] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [budgetTier, setBudgetTier] = useState("Medium");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [travelMonth, setTravelMonth] = useState("");

  const navigate = useNavigate();

  const handleGenerate = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/trips/generate",
        {
          destination,
          durationDays: Number(durationDays),
          budgetTier,
          interests: interests.split(",").map((item) => item.trim()),
          travelMonth,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(res.data);

      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      alert("Trip Generation Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-trip-page">
      <div className="create-trip-card">
        <div className="trip-header">
          <h1>✈️ Plan Your Next Adventure</h1>

          <p>Let AI build your perfect itinerary in seconds</p>
        </div>

        <div className="trip-form-group">
          <label>Destination</label>

          <input
            type="text"
            placeholder="Japan, Dubai, Paris..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        <div className="trip-form-group">
          <label>Duration (Days)</label>

          <input
            type="number"
            placeholder="5"
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
          />
        </div>

        <div className="trip-form-group">
          <label>Budget</label>

          <select
            value={budgetTier}
            onChange={(e) => setBudgetTier(e.target.value)}
          >
            <option value="Low">Budget Friendly</option>

            <option value="Medium">Medium</option>

            <option value="High">Luxury</option>
          </select>
        </div>

        <div className="trip-form-group">
          <label>Travel Month</label>

          <select
            value={travelMonth}
            onChange={(e) => setTravelMonth(e.target.value)}
          >
            <option value="">Select Month</option>

            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>

        <div className="trip-form-group">
          <label>Interests</label>

          <input
            type="text"
            placeholder="Food, Temples, Nature, Beaches..."
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
        </div>

        <button
          className="generate-btn"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating Your Trip..." : "Generate AI Trip"}
        </button>
      </div>
    </div>
  );
}

export default CreateTrip;
