import React from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/config";
import "./places-list.css";
import "./map.css";

const PlacesList = ({ places, onSelect }) => {
  const navigate = useNavigate();
  if (!places || places.length === 0) return null;

  // compute recommended top-3 by rating
  const rated = places.filter((p) => typeof p.rating === "number").slice();
  rated.sort((a, b) => b.rating - a.rating);
  const recommendedIds = new Set(rated.slice(0, 3).map((p) => p.place_id));

  return (
    <div className="places-list">
      <h5>Places</h5>
      <ul>
        {places.map((p) => (
          <li key={p.place_id} style={{ padding: "8px 0" }}>
            <div style={{ cursor: "pointer" }} onClick={() => onSelect && onSelect(p)}>
              <strong>{p.name}</strong>
              {recommendedIds.has(p.place_id) && (
                <span className="badge-recommended" style={{ marginLeft: 8 }}>Recommended</span>
              )}
              {p.rating && <span> — {p.rating} ⭐</span>}
              <div style={{ fontSize: 12 }}>{p.formatted_address}</div>
            </div>
            <div style={{ marginTop: 6 }}>
              <button
                className="btn btn-sm btn-primary"
                onClick={async () => {
                  // fetch guides for this place (by formatted_address/city)
                  const cityQuery = encodeURIComponent(p.formatted_address || p.vicinity || "");
                  let guides = [];
                  try {
                    const gres = await fetch(`${BASE_URL}/guides?city=${cityQuery}`);
                    if (gres.ok) {
                      const gjson = await gres.json();
                      guides = gjson.data || [];
                    }
                  } catch (e) {
                    // ignore
                  }

                  let selectedGuide = null;
                  if (guides.length > 0) {
                    // build prompt list
                    let list = "Available guides:\n";
                    guides.forEach((g, i) => {
                      list += `${i + 1}. ${g.name} — ${g.languages.join(", ")} — ${g.rating} ⭐ — ₹${g.pricePerDay}/day\n`;
                    });
                    list += "\nEnter guide number to select, or cancel to skip:";
                    const choice = prompt(list);
                    const idx = Number(choice) - 1;
                    if (!isNaN(idx) && idx >= 0 && idx < guides.length) {
                      selectedGuide = guides[idx];
                    }
                  }

                  const fullName = prompt("Your full name");
                  if (!fullName) return alert("Name required");
                  const phone = prompt("Phone number");
                  if (!phone) return alert("Phone required");
                  const guestSize = prompt("Number of guests", "1");
                  const bookAt = prompt("Booking date (YYYY-MM-DD)", new Date().toISOString().slice(0, 10));

                  try {
                    const body = {
                      tourName: p.name,
                      fullName,
                      phone,
                      guestSize: Number(guestSize) || 1,
                      bookAt,
                    };
                    if (selectedGuide) {
                      body.guide = { guideId: selectedGuide.id, name: selectedGuide.name, pricePerDay: selectedGuide.pricePerDay };
                    }

                    const res = await fetch(`${BASE_URL}/booking/public`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(body),
                    });
                    if (res.status === 401) {
                      alert("Please login to make a booking");
                      return navigate("/login");
                    }
                    const result = await res.json();
                    if (!res.ok) return alert(result.message || "Booking failed");
                    alert("Booking successful");
                  } catch (err) {
                    alert("Booking failed");
                  }
                }}
              >
                Book
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlacesList;
