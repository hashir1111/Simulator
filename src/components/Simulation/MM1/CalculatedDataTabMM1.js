import React from 'react';

const CalculatedDataTab = ({ calculatedData }) => {
  console.log(calculatedData)
  let totalwait = 0;
  let totalTurnaroundTime = 0
  let servicetime = 0
  calculatedData.calculatedData.map((data) => {
    totalwait += data.waitTime;
    totalTurnaroundTime += data.turnaroundTime
    servicetime += data.serviceTime
  });
  const AvgWaitTime = totalwait / calculatedData.calculatedData.length
  const AvgTurnAruund = totalTurnaroundTime / calculatedData.calculatedData.length
  const AvgService = servicetime / calculatedData.calculatedData.length


  // Separate the data based on priority
  const priority1Data = calculatedData.calculatedData.filter(data => data.priority === 1);
  const priority2Data = calculatedData.calculatedData.filter(data => data.priority === 2);
  const priority3Data = calculatedData.calculatedData.filter(data => data.priority === 3);

  // Calculate the total turnaround time for each priority group
  const calculateTotalTurnaroundTime = (data) => {
    return data.reduce((total, customer) => total + (customer.endTime - customer.arrivalTime), 0);
  };

  const totalTurnaroundTimePriority1 = calculateTotalTurnaroundTime(priority1Data);
  const totalTurnaroundTimePriority2 = calculateTotalTurnaroundTime(priority2Data);
  const totalTurnaroundTimePriority3 = calculateTotalTurnaroundTime(priority3Data);

  // Calculate the average turnaround time for each priority group
  const calculateAverageTurnaroundTime = (totalTurnaroundTime, data) => {
    return totalTurnaroundTime / data.length;
  };

  const averageTurnaroundTimePriority1 = calculateAverageTurnaroundTime(totalTurnaroundTimePriority1, priority1Data);
  const averageTurnaroundTimePriority2 = calculateAverageTurnaroundTime(totalTurnaroundTimePriority2, priority2Data);
  const averageTurnaroundTimePriority3 = calculateAverageTurnaroundTime(totalTurnaroundTimePriority3, priority3Data);

  console.log("Average Turnaround Time for Priority 1:", averageTurnaroundTimePriority1);
  console.log("Average Turnaround Time for Priority 2:", averageTurnaroundTimePriority2);
  console.log("Average Turnaround Time for Priority 3:", averageTurnaroundTimePriority3);


  return (
    <div className="overflow-auto">
      <h2 className="text-center text-3xl text-gray-300 font-bold mb-5">Calculated Data</h2>
      <div className="text-center mb-4">
        <h3 className="text-2xl text-gray-300 font-bold">Server 1</h3>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-xl">Customer</th>
            <th className="text-xl">Arrival Time</th>
            <th className="text-xl">Service Time</th>

            <th className="text-xl">Start Time</th>
            <th className="text-xl">End Time</th>
            <th className="text-xl">Wait Time</th>
            <th className="text-xl">Turnaround Time</th>
            <th className="text-xl">Priority</th>
          </tr>
        </thead>
        <tbody>
          {calculatedData.calculatedData.map((data) => (
            <tr key={data.customer}>
              <td className="text-center py-2 font-bold">{data.customer}</td>
              <td className="text-center py-2 font-bold">{data.arrivalTime}</td>
              <td className="text-center py-2 font-bold">{data.serviceTime}</td>

              <td className="text-center py-2 font-bold">{data.startTime}</td>
              <td className="text-center py-2 font-bold">{data.endTime}</td>
              <td className="text-center py-2 font-bold">{data.waitTime}</td>
              <td className="text-center py-2 font-bold">{data.turnaroundTime}</td>
              <td className="text-center py-2 font-bold">{data.priority}</td>

            </tr>

          ))}
          <tr>
            <td className="text-center py-2 font-bold">Averages</td>
            <td className="text-center py-2 font-bold"></td>
            <td className="text-center py-2 font-bold">{AvgService.toFixed(2)}</td>
            <td className="text-center py-2 font-bold"></td>
            <td className="text-center py-2 font-bold"></td>


            <td className="text-center py-2 font-bold">{AvgWaitTime.toFixed(2)}</td>
            <td className="text-center py-2 font-bold">{AvgTurnAruund.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-8">
        <h3 className="text-2xl text-gray-300 font-bold text-center">Server Idle Time and Utilization</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-xl">Server</th>
              <th className="text-xl">Idle Time</th>
              <th className="text-xl">Utilization Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 text-center font-bold">Server 1</td>
              <td className="py-2 text-center font-bold">{(calculatedData.serverIdle * 100)}%</td>
              <td className="py-2 text-center font-bold">{(calculatedData.serverUtilization * 100)}%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-8">
        <h3 className="text-2xl text-gray-300 font-bold text-center">Average Turn Around Time By Priority</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-xl">Averages</th>

              <th className="text-xl">Priority 1</th>
              <th className="text-xl">Priority 2</th>
              <th className="text-xl">Priority 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="text-xl">Server 1</th>

              <td className="py-2 text-center font-bold">{averageTurnaroundTimePriority1.toFixed(2)}%</td>
              <td className="py-2 text-center font-bold">{averageTurnaroundTimePriority2.toFixed(2)}%</td>
              <td className="py-2 text-center font-bold">{averageTurnaroundTimePriority3.toFixed(2)}%</td>

            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default CalculatedDataTab;
