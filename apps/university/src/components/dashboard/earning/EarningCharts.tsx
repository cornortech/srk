// import { useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { Button } from "@nextui-org/button";
// import { Calendar, Clock, History } from "lucide-react";

// const dummyData = {
//   "7days": [
//     { name: "Mon", earnings: 500 },
//     { name: "Tue", earnings: 300 },
//     { name: "Wed", earnings: 600 },
//     { name: "Thu", earnings: 400 },
//     { name: "Fri", earnings: 700 },
//     { name: "Sat", earnings: 200 },
//     { name: "Sun", earnings: 800 },
//   ],
//   "30days": [
//     { name: "Week 1", earnings: 2000 },
//     { name: "Week 2", earnings: 2500 },
//     { name: "Week 3", earnings: 1800 },
//     { name: "Week 4", earnings: 3000 },
//   ],
//   allTime: [
//     { name: "Jan", earnings: 5000 },
//     { name: "Feb", earnings: 7000 },
//     { name: "Mar", earnings: 6000 },
//     { name: "Apr", earnings: 8000 },
//     { name: "May", earnings: 9000 },
//     { name: "Jun", earnings: 10000 },
//   ],
// };
// type TimeRangeKey = keyof typeof dummyData;

// export default function EarningsChart() {
//   const [timeRange, setTimeRange] = useState<TimeRangeKey>("7days");

//   return (
//     <div className="bg-bgSecondary text-textPrimary">
//       <div className="flex gap-2 mb-4 ">
//         <Button size="sm" onPress={() => setTimeRange("7days")}>
//           <Clock size={16} />
//           Last 7 Days
//         </Button>
//         <Button size="sm" onPress={() => setTimeRange("30days")}>
//           <Calendar size={16} />
//           Last 30 Days
//         </Button>
//         <Button size="sm" onPress={() => setTimeRange("allTime")}>
//           <History size={16} />
//           All Time
//         </Button>
//       </div>
//       <ResponsiveContainer
//         width="100%"
//         height={300}
//         className={"bg-bgSecondary"}
//       >
//         <LineChart data={dummyData[timeRange as "7days" | "30days" | "allTime"]}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey="earnings"
//             stroke="#8884d8"
//             activeDot={{ r: 8 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
// } from "recharts";

// // Dummy data for the chart
// const data = [
//   { date: "2023-01-01", earnings: 50 },
//   { date: "2023-01-02", earnings: 80 },
//   { date: "2023-01-03", earnings: 70 },
//   { date: "2023-01-04", earnings: 90 },
//   { date: "2023-01-05", earnings: 85 },
//   { date: "2023-01-06", earnings: 110 },
//   { date: "2023-01-07", earnings: 100 },
//   { date: "2023-01-03", earnings: 70 },
//   { date: "2023-01-04", earnings: 90 },
//   { date: "2023-01-05", earnings: 85 },
//   { date: "2023-01-06", earnings: 110 },
//   { date: "2023-01-07", earnings: 100 },
// ];

// export function EarningsChart() {
//   return (
//     <ResponsiveContainer width="100%" height={300}>
//       <BarChart data={data}>
//         <XAxis dataKey="date" />
//         <YAxis />
//         <Tooltip />
//         <CartesianGrid strokeDasharray="3 3" />
//         <Bar dataKey="earnings" fill="#7828c8" />
//       </BarChart>
//     </ResponsiveContainer>
//   );
// }

import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const candlestickData = [
  {
    x: new Date("2023-01-01").getTime(),
    y: [50, 90, 40, 80],
  },
  {
    x: new Date("2023-01-02").getTime(),
    y: [80, 100, 70, 90],
  },
  {
    x: new Date("2023-01-03").getTime(),
    y: [70, 95, 60, 85],
  },
  {
    x: new Date("2023-01-04").getTime(),
    y: [90, 110, 80, 100],
  },
  {
    x: new Date("2023-01-05").getTime(),
    y: [85, 105, 75, 95],
  },
  {
    x: new Date("2023-01-06").getTime(),
    y: [110, 130, 100, 120],
  },
  {
    x: new Date("2023-01-07").getTime(),
    y: [100, 120, 90, 110],
  },
];

export function EarningsChart() {
  const options: ApexOptions = {
    chart: {
      type: "candlestick", // ✅ Explicitly valid type
      height: 350,
      background: "transparent",
      foreColor: "#fff",
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#fff",
        },
      },
      axisBorder: {
        show: true,
        color: "#444",
      },
      axisTicks: {
        color: "#444",
      },
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
      labels: {
        style: {
          colors: "#fff",
        },
      },
    },
    grid: {
      borderColor: "#444",
      strokeDashArray: 4,
    },
    tooltip: {
      theme: "dark",
      x: {
        format: "dd MMM yyyy",
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#b68938",
          downward: "#EF403C",
        },
      },
    },
  };

  const series = [
    {
      data: candlestickData,
    },
  ];

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="candlestick" // ✅ Ensure this matches the chart type
        height={350}
      />
    </div>
  );
}
