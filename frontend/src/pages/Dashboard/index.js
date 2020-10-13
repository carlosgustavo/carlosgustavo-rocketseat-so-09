import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import socketio from "socket.io-client";
import logo from "../../assets/logo.svg";
import api from "../../services/api";

import "./styles.css";

export default function Dashboard() {
  const [spots, setSpots] = useState([]);
  const [requests, setRequests] = useState([]);
  const [note, setnote] = useState([]);
  const user_id = localStorage.getItem("user");

  const socket = useMemo(
    () =>
      socketio("http://localhost:3333", {
        query: { user_id },
      }),
    [user_id]
  );

  useEffect(() => {
    socket.on("booking_request", (data) => {
      setRequests([...requests, data]);
    });
  }, [requests, socket]);

  useEffect(() => {
    async function loadSpots() {
      const user_id = localStorage.getItem("user");
      const response = await api.get("/dashboard", {
        headers: { user_id },
      });

      setSpots(response.data);
    }

    loadSpots();
  }, []);

  async function handleAccept(id) {
    await api.post(`/bookings/${id}/approvals`);

    setRequests(requests.filter((request) => request._id !== id));
  }

  async function handleReject(id) {
    await api.post(`/bookings/${id}/rejections`);

    setRequests(requests.filter((request) => request._id !== id));
  }

  return (
    <div className="Dashboard-man">
      <Link to="/">
        <img src={logo} alt="Tindev" />
      </Link>
      <div className="content">
        <ul className="notifications">
          {requests.length ? () => setnote(note + 1) : ""}
          {requests.map((request) => (
            <div className={note ? "has-notifications" : ""}>
              <li key={request._id}>
                <p>
                  <strong>{request.user.email}</strong> está solicitando uma
                  reserva em <strong>{request.spot.company}</strong> para a
                  data: <strong>{request.date}</strong>
                </p>
                <button
                  className="accept"
                  onClick={() => handleAccept(request._id)}
                >
                  ACEITAR
                </button>
                <button
                  className="reject"
                  onClick={() => handleReject(request._id)}
                >
                  REJEITAR
                </button>
              </li>
            </div>
          ))}
        </ul>

        <ul className="spot-list">
          {spots.map((spot) => (
            <div className="content-main">
              <li key={spot._id}>
                <strong>{spot.company}</strong>
                <header
                  style={{ backgroundImage: `url(${spot.thumbnail_url})` }}
                />

                {
                  <ul className="techs">
                    {spot.techs.map((tec) => (
                      <li key={tec.id}>
                        <h3> {tec}</h3>
                      </li>
                    ))}
                  </ul>
                }

                <span>{spot.price ? `R$${spot.price}/dia` : "GRATUITO"}</span>
              </li>
            </div>
          ))}
        </ul>

        <Link to="/new">
          <button className="btn">Cadastrar novo spot</button>
        </Link>
      </div>
    </div>
  );
}
