import React, { useEffect, useRef } from 'react';
import './GraphicalViewTabMM1.css';
import { Bar, LineChart, Line, Pie, BarChart, PieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar as StackedBar, Area } from 'recharts';

const GraphicalViewTab = ({ calculatedData }) => {

  const secondStartTimes = {};

// Iterate through the calculatedData array to calculate and store second start times
calculatedData.calculatedData.forEach(item => {
  const { customer, startTime, endTime, remaining_time ,util_time} = item;

  

  if (remaining_time > 0) {
    // Calculate the new start time based on the formula
    const newStartTime = endTime - remaining_time;

   
    
    // Store the second start time in the map, using the customer name as the key
    if (!secondStartTimes[customer]) {
      secondStartTimes[customer] = newStartTime;
    }

    item.endTime = startTime + util_time;
  }
});

// Duplicate entries for customers with a second start time
calculatedData.calculatedData.forEach((item, index) => {
  const { customer } = item;
  if (secondStartTimes[customer]) {
    const duplicateItem = { ...item };
    duplicateItem.startTime = secondStartTimes[customer];
    duplicateItem.endTime = duplicateItem.startTime + duplicateItem.remaining_time;
    calculatedData.calculatedData.push(duplicateItem);
  }
});

// Sort the calculatedData array by start times
calculatedData.calculatedData.sort((a, b) => a.startTime - b.startTime);

console.log(calculatedData.calculatedData)



  const ganttChartRef = useRef(null); 
  const customerWaitTimeData = calculatedData.calculatedData.map((data) => ({
    customer: data.customer,
    waitTime: data.waitTime,
  }));
  const priorityColors = {
  1: "bg-red-500",
  2: "bg-blue-500",
  3: "bg-green-500",
};

  const customerArrivalTimeData = calculatedData.calculatedData.map((data) => ({
    customer: data.customer,
    arrivalTime: data.arrivalTime,
  }));

  const customerDistributionData = calculatedData.calculatedData.map((data) => ({
    customer: data.customer,
  }));

  const stackedBarChartData = calculatedData.calculatedData.map((data) => ({
    customer: data.customer,
    serviceTime: data.serviceTime,
    waitTime: data.waitTime,
  }));

  const serverUtilizationData =
    
    {utilization: calculatedData.serverUtilization,
    idleTime: calculatedData.serverIdle};

    console.log(serverUtilizationData)
  return (
    <div >
      <h3 className="text-3xl  text-center text-gray-300 font-bold mb-10">Graphical View</h3>
      <h4 className="text-2xl  text-center text-gray-300 font-bold mb-4">Gantt Chart</h4>
      <h3 className='text-xl text-gray-300 font-bold'>Server 1</h3>
      <div className="gantt-chart" ref={ganttChartRef}>

        {calculatedData.calculatedData.map((data, index) => (
          
         <div
         className={`gantt-chart-bar ${data.priority === 1 ? "bg-red-500" : data.priority === 2 ? "bg-blue-500" : "bg-green-500"}`}
         key={data.customer}
       >
        
            <div className="gantt-chart-label">
              <div className="start-time">{data.startTime}</div>
              <div className='text-xl font-bold text-white'>{data.priority}</div>
              <div className="end-time">{data.endTime}</div>
            </div>
            <div className="customer-name">Customer {data.customer}</div>
          </div>
          

        ))}
      </div>
      <div className='flex flex-row space-x-10  justify-center'>

        {/* Bar Chart - Customer vs. Wait Time */}
        <div className="graph-container">
        <h4 className="text-2xl  text-center text-gray-300 font-bold my-4">Bar Chart</h4>
          <h4 className='text-gray-300'>Customer vs. Wait Time</h4>
          <BarChart width={500} height={300} data={customerWaitTimeData}>
            <XAxis dataKey="customer" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Bar dataKey="waitTime" fill="#8884d8" />
          </BarChart>

        </div>
        {/* Line Chart - Customer vs. Arrival Time */}
        <div className="graph-container">
        <h4 className="text-2xl  text-center text-gray-300 font-bold my-4">Line Chart</h4>
          <h4 className='text-gray-300'>Customer vs. Arrival Time</h4>
          <LineChart width={500} height={300} data={customerArrivalTimeData}>
            <XAxis dataKey="customer" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="arrivalTime" stroke="#8884d8" />
          </LineChart>
        </div>
      </div>

      {/* Pie Chart - Customer Distribution */}
      <div className='flex flex-row space-x-10  justify-center'>


        {/* Stacked Bar Chart - Customer vs. Service Time and Wait Time */}
        <div className="graph-container">
        <h4 className="text-2xl  text-center text-gray-300 font-bold my-4">Stacked Bar Chart</h4>
          <h4 className='text-gray-300'>Customer vs. Service Time and Wait Time</h4>
          <BarChart width={500} height={300} data={stackedBarChartData}>
            <XAxis dataKey="customer" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <StackedBar dataKey="serviceTime" stackId="a" fill="#8884d8" />
            <StackedBar dataKey="waitTime" stackId="a" fill="#82ca9d" />
          </BarChart>
        </div>

        {/* Pie Chart - Server Utilization and Server Idle Time */}
<div className="graph-container">
  <h4 className="text-2xl text-center text-gray-300 font-bold my-4">Pie Chart</h4>
  <h4 className='text-gray-300'>Server Utilization and Server Idle Time</h4>
  <PieChart width={500} height={300}>
    <Pie
      data={[
        { name: 'Utilization', value: serverUtilizationData.utilization },
        { name: 'Idle Time', value: serverUtilizationData.idleTime },
      ]}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={80}
      label
    >
      <Cell key="utilization" fill="#82ca9d" />
      <Cell key="idleTime" fill="#ff0000" />
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</div>

      </div>

    </div>

  );
};

export default GraphicalViewTab;
