import React from 'react';
import { useHistory } from "react-router";

export default function TablesForm({
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
                Create a Table
            </legend>
            <div>
                <input 
                type="text"
                name="table_name"
                className="form-control"
                id="table_name"
                placeholder={initialformData?.table_name || "Table Name"}
                value={initialformData?.table_name}
                onChange={handleFormChange}
                minLength={2}
                required
                />
            </div>
            <div>
                <input 
                type="number"
                name="capacity"
                className="form-control"
                id="people"
                placeholder={initialformData?.capacity || "Table Capacity"}
                value={initialformData?.capacity}
                onChange={handleFormChange}
                required
                min="1"
                />
            </div>
        </fieldset>
        <div>
            <button>
                Submit
            </button>
        </div>
        <div>
            <button onClick={handleCancel}> 
                Cancel 
            </button>
        </div>
    </form>
    )
  )
}
