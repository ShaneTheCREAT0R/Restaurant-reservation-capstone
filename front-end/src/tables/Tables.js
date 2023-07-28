import React, { useState } from 'react'
import TablesForm from './TablesForm'
import { useHistory } from "react-router";
import { createTable } from '../utils/api';
import ErrorAlert from "../layout/ErrorAlert";

export default function Tables() {
    const history = useHistory();
    const [tablesError, setTablesError] = useState(null);
    const initialFormData = {
      table_name: "",
      table_capacity: "",
    };
  
    const [formData, setFormData] = useState({ ...initialFormData });
    
      const handleFormChange = (e) => {
          setFormData({
              ...formData,
              [e.target.name]: e.target.value,
            });
      }
   

      const handleSubmit = async (e) => {
        e.preventDefault();
        const controller = new AbortController();
        try {
          formData.table_capacity = Number(formData.table_capacity);
          const response = await createTable(formData, controller.signal);
          if (response){
            history.push("/dashboard");
          }

        } catch (error){
          setTablesError([error])
        }
        return () => controller.abort();
    }

    return (
        <>
          <ErrorAlert error={tablesError} />
          <TablesForm 
          initialformData={formData}
          handleFormChange={handleFormChange}
          handleSubmit={handleSubmit}
          />
        </>
    )
}
