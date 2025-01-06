import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState([]);

  const doRequest = async (props = {}) => {
    try {
      setErrors([]); // Reset errors
      const response = await axios[method](url, { ...body, ...props }); // Axios request

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      console.error("Error in doRequest:", err);
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooooopss...Somethig went wrong</h4>
          <ul className="my-0">
            {err.response.data?.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
