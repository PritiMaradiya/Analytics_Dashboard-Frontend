import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
  Select, SelectItem 
} from "@material-tailwind/react";  
import { chartsConfig } from "@/configs";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowTrendingDownIcon
} from "@heroicons/react/24/solid";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";

export function Home() {
  
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showCustomRange, setShowCustomRange] = useState(false);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        let startTime = new Date();
        let endTime = new Date();
  
        switch (timeRange) {
          case "24h":
            startTime.setHours(startTime.getHours() - 24);
            endTime.setHours(23, 59, 59); // Set endTime to the end of the day
            break;
          case "7d":
            startTime.setDate(startTime.getDate() - 7);
            endTime.setHours(23, 59, 59); // Set endTime to the end of the day

            break;
          case "custom":
            if (startDate && endDate) {
              startTime = new Date(startDate);
              endTime = new Date(endDate);
              endTime.setHours(23, 59, 59); // Set endTime to the end of the day
                      } else {
              // Handle case where custom dates are not set
              console.error("Custom date range selected but dates not provided");
              return;
            }
            break;
          default:
            startTime.setHours(startTime.getHours() - 24);
            endTime.setHours(23, 59, 59); // Set endTime to the end of the day

        }
  
        startTime = startTime.toISOString();
        endTime = endTime.toISOString();
  
        const response = await fetch(`https://dashboard-backend-2u1r.onrender.com/api/analytics?startTime=${startTime}&endTime=${endTime}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };
  
    fetchAnalyticsData();
  }, [timeRange, startDate, endDate]); // Dependencies updated
  
  const websiteViewsChart = {
    type: "bar",
    height: 220,
    series: [
      {
        name: "User",
        data: analyticsData?.graphData.map(item => item.totalCalls),
      },
    ],
    options: {
      ...chartsConfig,
      colors: "#388e3c",
      plotOptions: {
        bar: {
          columnWidth: "16%",
          borderRadius: 5,
        },
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories:analyticsData?.graphData.map(item => item._id),
      },
    },
  };
const statisticsCardsData = [
    {
      color: "gray",
      icon: UserPlusIcon,
      title: "Total Unique User",
      value: analyticsData?.totalUniqueUsers ? analyticsData?.totalUniqueUsers : 0 ,
      footer: {
        color: "text-green-500",
        value: "+55%",
        label: "than last week",
      },
    },
  
    // {
    //   color: "gray",
    //   icon: UserPlusIcon,
    //   title: "New Clients",
    //   value: "3,462",
    //   footer: {
    //     color: "text-red-500",
    //     value: "-2%",
    //     label: "than yesterday",
    //   },
    // },
    {
      color: "gray",
      icon: ChartBarIcon,
      title: "Total API Call",
      value: analyticsData?.totalCalls ? analyticsData?.totalCalls  : 0 ,
      footer: {
        color: "text-green-500",
        value: "+5%",
        label: "than yesterday",
      },
    },
    {
      color: "gray",
      icon: ArrowTrendingDownIcon,
      title: "Total Failure Call",
      value: analyticsData?.totalFailures ? analyticsData?.totalFailures : 0,
      footer: {
        color: "text-green-500",
        value: "+3%",
        label: "than last month",
      },
    },
  ];

  const statisticsChartsData = [
    {
      color: "white",
      title: "User Analytics",
      // description: "Last Campaign Performance",
      footer: "campaign sent 2 days ago",
      chart: websiteViewsChart,
    }]
    const handleTimeRangeChange = (e) => {
      const selectedRange = e.target.value;
      setTimeRange(selectedRange);
      setShowCustomRange(selectedRange === 'custom');
    };
    
    
    
    return (
    <div className="mt-12">
      <div className="my-4">
      <select label="Time Range" value={timeRange} onChange={handleTimeRangeChange}>
  <option value="24h">Last 24 hours</option>
  <option value="7d">Last 7 days</option>
  <option value="custom">Custom time range</option>
</select>

{showCustomRange && (
  <div>
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
    />
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
    />
  </div>
)}

</div>

      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
          />
        ))}
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                
              </Typography>
            }
          />
        ))}
      </div>
      
    </div>
  );
}

export default Home;
