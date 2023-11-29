import { useState } from "react";
import { Input, Button } from '@material-tailwind/react';


export function HitApi() {
    const [userId, setUserId] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const apiUrl = 'https://dashboard-backend-2u1r.onrender.com/api/hello'; // Assuming this is the correct URL

    const handleButtonClick = () => {
      // Reset previous response and error
      setResponse(null);
      setError(null);
      setLoading(true);
  
      // Make the API request with the entered userId
      fetch(`${apiUrl}?userId=${userId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then((data) => {
          setResponse(data.message);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    };

    return(
        <>
           <div className="mt-8 space-y-4">
      <Input
        type="text"
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        size="regular"
      />
      <Button
        color="lightBlue"
        size="lg"
        onClick={handleButtonClick}
        ripple="light"
      >
        Hit API
      </Button>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : response ? (
          <p>{response}</p>
        ) : null}
      </div>
    </div>
  
        </>
    )
}

export default HitApi;