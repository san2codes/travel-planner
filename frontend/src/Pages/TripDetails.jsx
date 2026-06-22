import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../Api/axios";
import "../styles/tripDetails.css";
function TripDetails() {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);

  useEffect(() => {
    fetchTrip();
  }, []);

  const fetchTrip = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/trips/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTrip(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!trip) {
    return <h2>Loading...</h2>;
  }

  const handleRegenerate = async (dayNumber) => {
    const userRequest = prompt(
      `How would you like to change Day ${dayNumber}?`,
    );

    if (!userRequest) return;

    try {
      const token = localStorage.getItem("token");

      const res = await api.put(
        `/trips/${id}/regenerate-day`,
        {
          dayNumber,
          userRequest,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTrip(res.data);

      alert("Day Updated");
    } catch (error) {
      console.log(error);

      alert("Failed");
    }
  };

  const handlePackingToggle = async (itemId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.put(
        `/trips/${id}/packing/${itemId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTrip(res.data);
    } catch (error) {
      console.log(error);

      alert("Failed to update packing item");
    }
  };

  const handleAddActivity = async (dayNumber) => {
    const title = prompt("Activity Title");

    if (!title) return;

    const description = prompt("Activity Description");

    const estimatedCost = prompt("Estimated Cost");

    const timeOfDay = prompt("Time Of Day (Morning/Afternoon/Evening)");

    try {
      const token = localStorage.getItem("token");

      const res = await api.post(
        `/trips/${id}/day/${dayNumber}/activity`,
        {
          title,
          description,
          estimatedCost: Number(estimatedCost),
          timeOfDay,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTrip(res.data);

      alert("Activity Added");
    } catch (error) {
      console.log(error);

      alert("Failed to add activity");
    }
  };

  const handleDeleteActivity = async (dayNumber, activityId) => {
    const confirmDelete = window.confirm("Delete this activity?");

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await api.delete(
        `/trips/${id}/day/${dayNumber}/activity/${activityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTrip(res.data);
    } catch (error) {
      console.log(error);

      alert("Failed to delete activity");
    }
  };

  const handleEditActivity = async (dayNumber, activity) => {
    const title = prompt("Activity Title", activity.title);

    if (!title) return;

    const description = prompt("Description", activity.description);

    const estimatedCost = prompt("Estimated Cost", activity.estimatedCost);

    const timeOfDay = prompt("Time Of Day", activity.timeOfDay);

    try {
      const token = localStorage.getItem("token");

      const res = await api.put(
        `/trips/${id}/day/${dayNumber}/activity/${activity._id}`,
        {
          title,
          description,
          estimatedCost: Number(estimatedCost),
          timeOfDay,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTrip(res.data);

      alert("Activity Updated");
    } catch (error) {
      console.log(error);

      alert("Failed to update activity");
    }
  };

  return (
    <div className="trip-details-page">
      <div className="trip-header">
        <h1>🌍 {trip.destination}</h1>

        <div className="trip-meta">
          <span>📅 {trip.durationDays} Days</span>
          <span>💰 {trip.budgetTier} Budget</span>
        </div>
      </div>

      <section className="section-card">
        <h2>🗺️ Itinerary</h2>

        {trip.itinerary.map((day) => (
          <div key={day.dayNumber} className="day-card">
            <div className="day-header">
              <h3>Day {day.dayNumber}</h3>

              <div className="day-actions">
                <button
                  className="primary-btn"
                  onClick={() => handleRegenerate(day.dayNumber)}
                >
                  Regenerate
                </button>

                <button
                  className="secondary-btn"
                  onClick={() => handleAddActivity(day.dayNumber)}
                >
                  Add Activity
                </button>
              </div>
            </div>

            {day.activities.map((activity) => (
              <div key={activity._id} className="activity-card">
                <div className="activity-header">
                  <h4>{activity.title}</h4>

                  <div>
                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEditActivity(day.dayNumber, activity)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDeleteActivity(day.dayNumber, activity._id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p>{activity.description}</p>

                <div className="activity-footer">
                  <span>⏰ {activity.timeOfDay}</span>

                  <span>💵 ${activity.estimatedCost}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>

      <section className="section-card">
        <h2>🏨 Recommended Hotels</h2>

        <div className="hotel-grid">
          {trip.hotels.map((hotel) => (
            <div key={hotel._id} className="hotel-card">
              <h3>{hotel.name}</h3>

              <p>Tier: {hotel.tier}</p>

              <p>Rating: {hotel.rating}</p>

              <p>
                ${hotel.estimatedCostPerNight}
                /night
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <h2>💰 Budget Breakdown</h2>

        <div className="budget-grid">
          <div className="budget-card">
            Transport
            <h3>${trip.estimatedBudget.transport}</h3>
          </div>

          <div className="budget-card">
            Hotel
            <h3>${trip.estimatedBudget.accommodation}</h3>
          </div>

          <div className="budget-card">
            Food
            <h3>${trip.estimatedBudget.food}</h3>
          </div>

          <div className="budget-card">
            Activities
            <h3>${trip.estimatedBudget.activities}</h3>
          </div>
        </div>

        <div className="total-budget">
          Total Budget: ${trip.estimatedBudget.total}
        </div>
      </section>

      <section className="section-card">
        <h2>🎒 Packing Checklist</h2>

        <div className="packing-list">
          {trip.packingList.map((item) => (
            <label key={item._id} className="packing-item">
              <input
                type="checkbox"
                checked={item.isPacked}
                onChange={() => handlePackingToggle(item._id)}
              />

              <span>{item.item}</span>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}

export default TripDetails;
