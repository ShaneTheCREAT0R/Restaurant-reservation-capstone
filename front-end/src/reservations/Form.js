import React from 'react';
import { useHistory } from "react-router";

export default function Form({
    initialformData,
    handleFormChange,
    handleSubmit,
  }) {

    const history = useHistory();

    const handleCancel = () => {
        history.goBack();
    }

  return (
    // initialformData && 
    (
    <form onSubmit={handleSubmit} className="form-group">
        <fieldset>
            <legend>
                Guest Information
            </legend>
            <div>
                <input 
                type="text"
                name="first_name"
                className="form-control mb-1"
                id="first_name"
                placeholder={initialformData?.first_name || "First Name"}
                value={initialformData?.first_name}
                onChange={handleFormChange}
                required
                />
            </div>
            <div>
                <input 
                type="text"
                name="last_name"
                className="form-control mb-1"
                id="last_name"
                placeholder={initialformData?.last_name || "Last Name"}
                value={initialformData?.last_name}
                onChange={handleFormChange}
                required
                />
            </div>
            <div>
                <input 
                type="tel"
                name="mobile_number"
                className="form-control mb-1"
                id="mobile_number"
                placeholder={initialformData?.mobile_number || "Mobile Number"}
                value={initialformData?.mobile_number}
                onChange={handleFormChange}
                required
                />
            </div>
            <div>
                <input 
                type="number"
                name="people"
                className="form-control mb-1"
                id="people"
                placeholder={initialformData?.people || "Number of People"}
                value={initialformData?.people}
                onChange={handleFormChange}
                required
                min="1"
                />
            </div>
            <div>
                <input 
                type="date"
                name="reservation_date"
                className="form-control mb-1"
                id="reservation_date"
                placeholder={initialformData?.reservation_date || "YYYY-MM-DD"}
                value={initialformData?.reservation_date}
                onChange={handleFormChange}
                required
                />
            </div>
            <div className="d-flex justify-content-center">
                <input 
                type="time"
                name="reservation_time"
                className="form-control"
                id="reservation_time"
                placeholder={initialformData?.reservation_time || "HH:MM"}
                value={initialformData?.reservation_time}
                onChange={handleFormChange}
                required
                />
            </div>
        </fieldset>
        <div className="d-flex justify-content-center">
            <button className="m-2">
                Submit
            </button>
            <button className="m-2" onClick={handleCancel}> 
                Cancel 
            </button>
        </div>
    </form>
    )
  )
}
