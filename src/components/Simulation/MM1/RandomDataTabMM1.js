import React from 'react';
const RandomDataTab = ({ randomData }) => {
  
  const simulatedData = randomData;

  return (
    <div className="text-red-500">
      <h1 className="text-center text-3xl text-gray-300 font-bold mb-10">Random Data</h1>
      <table className="w-full text-black">
        <thead>
          <tr>
            <th className='text-xl'>Customer</th>
            <th className="text-xl">Probability</th>
            <th className="text-xl">Cummulative Probability</th>
            <th className='text-xl'>Interarrival Time</th>
            <th className='text-xl'>Arrival Time</th>
            <th  className='text-xl'>Service Time</th>
            <th  className='text-xl'>Z</th>
            <th  className='text-xl'>R</th>
            <th  className='text-xl'>C</th>
            <th  className='text-xl'>A</th>
            <th  className='text-xl'>Random Number</th>
            <th  className='text-xl'>Priority</th>
          </tr>
        </thead>
        <tbody>
          {simulatedData.map((data) => (
            <tr key={data.customer}>
              <td className='text-center pt-9 font-bold'>{data.customer}</td>

              <td className="text-center py-2 font-bold">{data.probability}</td>
              <td className="text-center py-2 font-bold">{data.cumulativeProbability}</td>
              <td className='text-center pt-9 font-bold'>{data.interarrivalTime}</td>
              <td className='text-center pt-9 font-bold'>{data.arrivalTime}</td>
              <td className='text-center pt-9 font-bold'>{data.serviceTime}</td>
              <td className='text-center pt-9 font-bold'>{data.Z}</td>
              <td className='text-center pt-9 font-bold'>{data.R}</td>
              <td className='text-center pt-9 font-bold'>{data.C}</td>
              <td className='text-center pt-9 font-bold'>{data.A}</td>
              <td className='text-center pt-9 font-bold'>{data.random_number}</td>
              <td className='text-center pt-9 font-bold'>{data.priority}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RandomDataTab;
