import React, { useEffect, useState } from "react";
import ReservationTable from "./reservationTable/ReservationTable";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import { previous, next } from "../utils/date-time";
import TableList from "./tableList/TableList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .then(listTables)
      .then(setTables)
      .catch(setReservationsError);
    return () => abortController.abort();
  }



  function handleToday() {
    history.push(`/dashboard`);
  }

  function handlePrevious() {
    const newDate = previous(date);
    history.push(`/dashboard?date=${newDate}`)
  }

  function handleNext() {
    history.push(`/dashboard?date=${next(date)}`)
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <div>
        <button className="btn btn-primary mr-1" onClick={handleToday}>
         today
        </button>
        <button className="btn btn-primary mr-1" onClick={handlePrevious}>
         previous
        </button>
        <button className="btn btn-primary mr-1" onClick={handleNext}>
         next
        </button>
        </div>
      <ErrorAlert error={reservationsError} />
      <ReservationTable
        reservations={reservations}
        setReservations={setReservations}
        setError={setReservationsError}
      />
      <div>
        <TableList tables={tables} loadDashboard={loadDashboard} />
      </div>
    </main>
  );
}

export default Dashboard;
