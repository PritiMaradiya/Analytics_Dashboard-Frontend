import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export function Tables() {
  const [currentPage, setCurrentPage] = useState(1);

  const [logs, setLogs] = useState([]);
  const [has_more, setHas_more] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async (page = 1) => {
      setLoading(true);
      try {
        const response = await fetch(`https://dashboard-backend-2u1r.onrender.com/api/logs?page=${page}&limit=10`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setLogs(data.logs);
        setHas_more(data?.hasMore)
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs(currentPage);
  }, [currentPage]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
   <Card>
  <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
    <Typography variant="h6" color="white">
      Log Data
    </Typography>
  </CardHeader>
  <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
    <table className="w-full min-w-[640px] table-auto">
      <thead>
        <tr>
          {["User ID", "Timestamp", "Status", "Error Message", "Request", "Response"].map((el) => (
            <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
              <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                {el}
              </Typography>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {logs.map((log, key) => (
          <tr key={key}>
            {/* Replace these with the actual log data fields */}
            <td className="py-3 px-5">{log.userId}</td>
            <td className="py-3 px-5">{new Date(log.timestamp).toLocaleString()}</td>
            <td className="py-3 px-5">{log.status}</td>
            <td className="py-3 px-5">{log.errorMessage || 'N/A'}</td>
            <td className="py-3 px-5">{JSON.stringify(log.requestDetails)}</td>
            <td className="py-3 px-5">{JSON.stringify(log.responseDetails)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </CardBody>
</Card>
<div className="text-center pagination-controls">
  <button
    className="m-5"
    onClick={() => setCurrentPage(currentPage - 1)}
    disabled={currentPage === 1}
  >
    Previous
  </button>
  <button
  className="m-5"
    onClick={() => setCurrentPage(currentPage + 1)}
    disabled={!has_more}
  >
    Next
  </button>
</div>

    
    </div>
  );
}

export default Tables;
