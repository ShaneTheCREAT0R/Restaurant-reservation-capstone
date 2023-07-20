import React, {useState} from 'react';
import { useHistory } from 'react-router';
import { createReservation } from '../utils/api';
import Form from './Form';


export default function Reservations() {
  const history = useHistory();
  const initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
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
        await createReservation(formData)
        history.push(`/dashboard`)
    }
//history.push(`/dashboard?date=${formData.reservation_date}`)
    return (
    <Form 
    initialformData={formData}
    handleFormChange={handleFormChange}
    handleSubmit={handleSubmit}
    />
  )
}
