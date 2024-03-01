import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import RandomDataTab from "./Simulation/MM1/RandomDataTabMM1";
import CalculatedDataTab from "./Simulation/MM1/CalculatedDataTabMM1";
import GraphicalViewTab from "./Simulation/MM1/GraphicalViewTabMM1";
import background from "../assests/pictures/xyz.jpg";

const SimulationMM1 = () => {
  const [activeTab, setActiveTab] = useState("random");
  const [randomData, setRandomData] = useState([]);
  const [calculatedData, setCalculatedData] = useState([]);
  const [arrivalMean, setArrivalMean] = useState(0);
  const [serviceMean, setServiceMean] = useState(0);
  const location = useLocation();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const arrivalMeanParam = parseFloat(params.get("arrivalMean"));
    const serviceMeanParam = parseFloat(params.get("serviceMean"));
    const a = parseFloat(params.get("avalue"));
    const b = parseFloat(params.get("bvalue"));
    const A = parseFloat(params.get("Avalue"));
    const C = parseFloat(params.get("Cvalue"));
    const Z = parseFloat(params.get("Zvalue"));
    const M = parseFloat(params.get("Mvalue"));

    if (!isNaN(arrivalMeanParam) && !isNaN(serviceMeanParam)) {
      setArrivalMean(arrivalMeanParam);
      setServiceMean(serviceMeanParam);

      const data = generateRandomData(
        arrivalMeanParam,
        serviceMeanParam,
        a,
        b,
        A,
        C,
        Z,
        M
      );
      setRandomData(data);

      const calculatedData = calculateCalculatedData(data);
      setCalculatedData(calculatedData);
    }
  }, [location.search]);

  // const generateRandomData = (count, arrivalMean, serviceMean) => {
  //     const data = [];
  //     let arrivalTime = 0;

  //     for (let i = 1; i <= count; i++) {
  //       const interarrivalTime = Math.round(generateRandomTime(arrivalMean));
  //       const serviceTime = Math.round(generateRandomTime(serviceMean));

  //       arrivalTime += interarrivalTime;

  //       data.push({
  //         customer: i,
  //         interarrivalTime,
  //         arrivalTime: i === 1 ? 0 : arrivalTime,
  //         serviceTime: Math.max(1, Math.min(10, serviceTime)), // Ensure value is within 1 to 10 range
  //       });
  //     }

  //     return data;
  //   };

  const generateRandomData = (arrivalMean, serviceMean, a, b, A, C, Z, M) => {
    const data = [];
    let arrivalTime = 0;
    let cumulativeProbability = 0;
    let targetProbability = 1;
    let x = 0;

    while (cumulativeProbability <= targetProbability) {
      let interarrivalTime = 0;
      if (x != 0) {
        interarrivalTime = generateRandomTime(arrivalMean);
      }
      const serviceTime = generateRandomTime(serviceMean);
      let R = 0;
      R = (A * Z + C) % M;
      const rand_num = R / M;
      arrivalTime += interarrivalTime;
      const exitTime = arrivalTime + serviceTime;
      const waitTime = Math.max(0, arrivalTime - exitTime);
      const turnaroundTime = waitTime + serviceTime;
      const priority = ((b - a) * rand_num) + a;
      const probability =
        (Math.exp(-serviceMean) * Math.pow(serviceMean, x)) / factorial(x);

      // console.log("probabilty before: " + priority);
      let final_priority = 0;

      if (priority > 3) {
        final_priority = 3;
      } else {
        const decpart = priority - Math.floor(priority);
        if (decpart >= 0.5) {
          final_priority = Math.ceil(priority);
        } else {
          final_priority = Math.floor(priority);
        }
      }

      // console.log("probabilty after: " + final_priority);

      data.push({
        customer: x,

        interarrivalTime,
        arrivalTime: x === 1 ? 0 : arrivalTime,
        serviceTime: Math.max(1, Math.min(10, serviceTime)),
        random_number: rand_num,
        R: R,
        A: A,
        C: C,
        Z: Z,
        priority: final_priority,

        probability,
        cumulativeProbability,
      });

      Z = R;

      // Calculate the probability using M/M/1 formula

      cumulativeProbability += probability;
      // console.log(cumulativeProbability);

      x++;

      // Check if the CP has reached two significant figures (e.g., 0.99)
      if (cumulativeProbability >= targetProbability) {
        break; // Stop generating data
      }
    }

    return data;
  };

  // Calculate factorial function
  function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  const generateRandomTime = (mean) => {
    // Generate a random number between 0 and 1
    const randomNumber = Math.random();
    // Calculate the time based on the mean
    const time = Math.round(-Math.log(1 - randomNumber) * mean);
    return time;
  };
  const calculateCalculatedData = (data) => {
    const calculatedData = [];

    let currentTime = 0;
    let totalWaitTime = 0;
    let totalTurnaroundTime = 0;
    const stopped_customers = [];
    const skipped_customers = [];

    for (let i = 0; i < data.length; i++) {
      const { customer, arrivalTime, serviceTime, priority } = data[i];

      // console.log("stopped cust arr : " + stopped_customers + " skipped cust arr: " + skipped_customers + " current cust : " + i + "calculated data tab currently : " + calculatedData)
      // console.log(skipped_customers);
      let stop_loop = false;

      const task = {
        customer,
        arrivalTime,
        serviceTime,
        priority,
        startTime: 0, // Initialize start time to 0
        endTime: 0, // Initialize end time to 0
        remainingServiceTime: serviceTime,
      };

      if (i === 0) {
        // First customer gets special treatment
        task.startTime = task.arrivalTime; // Start time is the arrival time
        task.endTime = task.startTime + task.serviceTime; // End time is the start time plus service time
      } else {
        if (task.arrivalTime > currentTime) {
          task.startTime = task.arrivalTime;
          task.endTime = task.startTime + task.serviceTime;
        } else {
          task.startTime = currentTime;
          task.endTime = task.startTime + task.serviceTime;
        }
      }

      for (let j = i + 1; j < data.length; j++) {
        const nextCustomer = data[j];

        if (
          nextCustomer.priority < task.priority &&
          nextCustomer.arrivalTime < task.endTime
        ) {
          // A higher-priority customer arrived before the current task completes
          // Update start time and end time for the current task

          // task.startTime = nextCustomer.arrivalTime;
          // task.endTime = task.startTime + task.remainingServiceTime;

          // // Update the wait time for the current task
          // const waitTime = task.startTime - task.arrivalTime;
          // totalWaitTime += waitTime;
          stop_loop = true;

          if (task.startTime === nextCustomer.arrivalTime) {
            skipped_customers.push({
              customer: task.customer,
              arrivalTime: task.arrivalTime,
              serviceTime: task.serviceTime,
              startTime: task.startTime,
              endTime: task.endTime,
              priority: task.priority,
            });
          } else {
            let utilization_time = nextCustomer.arrivalTime - task.startTime;
            let remaining_time = task.serviceTime - utilization_time;
            stopped_customers.push({
              customer: task.customer,
              arrivalTime: task.arrivalTime,
              serviceTime: task.serviceTime,
              startTime: task.startTime,
              waitTime: task.startTime - task.arrivalTime,
              endTime: task.endTime,
              util_time: utilization_time,
              remaining_time: remaining_time,
              priority: task.priority,
              turnaroundTime: task.endTime - task.arrivalTime,
            });
          }

          currentTime = nextCustomer.arrivalTime;

          // Break out of the loop to process higher-priority customers first
          break;
        }
      }

      if (!stop_loop) {
        // Update turnaround time for the current task

        if (
          skipped_customers.length !== 0 &&
          task.priority >= skipped_customers[0].priority
        ) {
          while (skipped_customers.length !== 0) {
            const currentCustomer = skipped_customers[0];

            if (task.priority >= currentCustomer.priority) {
              const customer = currentCustomer.customer;
              const arrivalTime = currentCustomer.arrivalTime;
              const serviceTime = currentCustomer.serviceTime;

              calculatedData.push({
                customer,
                arrivalTime,
                serviceTime,
                startTime: currentTime,
                endTime: currentTime + serviceTime,
                waitTime: currentTime - arrivalTime,
                priority: currentCustomer.priority,
              });

              const endTime = currentCustomer.endTime || 0;
              currentTime += endTime;
            }
            skipped_customers.shift(); // Remove the processed customer from the array
          }
          task.startTime = currentTime + serviceTime;
          task.endTime = task.startTime + task.serviceTime;
        } else if (
          stopped_customers.length !== 0 &&
          task.priority >= stopped_customers[0].priority
        ) {
          let remaining_time;
          let turnaroundTime;
          let util_time;
          while (stopped_customers.length !== 0) {
            const currentCustomer = stopped_customers[0];

            if (task.priority >= currentCustomer.priority) {
              const customer = currentCustomer.customer;
              const arrivalTime = currentCustomer.arrivalTime;
              const serviceTime = currentCustomer.serviceTime;
              const startTime = currentCustomer.startTime;
              const endTime1 = currentCustomer.endTime;
              const waitTime = currentCustomer.waitTime;
              remaining_time = currentCustomer.remaining_time;
              util_time = currentCustomer.util_time;
              turnaroundTime =
                currentCustomer.endTime - currentCustomer.arrivalTime;

              calculatedData.push({
                customer,
                arrivalTime,
                serviceTime,
                startTime,
                turnaroundTime,
                endTime: currentTime + remaining_time,
                waitTime,
                turnaroundTime,
                util_time,
                priority: currentCustomer.priority,
                remaining_time,
              });

              const endTime = currentCustomer.endTime || 0;
              currentTime += endTime;
            }
            stopped_customers.shift(); // Remove the processed customer from the array
          }
          task.startTime = currentTime + remaining_time;
          task.endTime = task.startTime + task.serviceTime;
        }

        const turnaroundTime = task.endTime - task.arrivalTime;
        totalTurnaroundTime += turnaroundTime;

        // Push the results to calculatedData
        calculatedData.push({
          customer: task.customer,
          arrivalTime: task.arrivalTime,
          serviceTime: task.serviceTime,
          startTime: task.startTime,
          endTime: task.endTime,
          waitTime: task.startTime - task.arrivalTime,
          turnaroundTime,
          priority: task.priority,
        });

        // Update current time
        currentTime = task.endTime;
      }
    }

    // Calculate other metrics
    const averageWaitTime = totalWaitTime / data.length;
    const averageTurnaroundTime = totalTurnaroundTime / data.length;
    const totalTime = currentTime;
    calculatedData.sort((a, b) => a.customer - b.customer);

    return {
      calculatedData,
      averageWaitTime,
      averageTurnaroundTime,
      totalTime,
      
    };
  };

  return (
    <div
      className="flex flex-col items-center w-full h-full"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        opacity: "0.9",
      }}
    >
      <div className="w-full max-w-3xl flex justify-center space-x-4 my-8">
        {/* <button
          style={{ background: "gray" }}
          className={`tab-button bg-gray-50 styled border  text-lg rounded-lg focus:ring-white focus:border-white block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white dark:focus:border-white ${
            activeTab === "random" ? "active" : ""
          }`}
          onClick={() => handleTabChange("random")}
        >
          Random Data
        </button> */}
        <button
          style={{ background: "gray" }}
          className={`tab-button bg-gray-50 styled border  text-lg rounded-lg focus:ring-white focus:border-white block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white dark:focus:border-white ${
            activeTab === "calculated" ? "active" : ""
          }`}
          onClick={() => handleTabChange("calculated")}
        >
          Calculated Data
        </button>
        <button
          style={{ background: "gray" }}
          className={`tab-button  bg-gray-50 styled border  text-lg rounded-lg focus:ring-white focus:border-white block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white dark:focus:border-white ${
            activeTab === "graphical" ? "active" : ""
          }`}
          onClick={() => handleTabChange("graphical")}
        >
          Graphical View
        </button>
      </div>

      <div className="w-full ">
        {/* {activeTab === "random" && <RandomDataTab randomData={randomData} />} */}
        {activeTab === "calculated" && (
          <CalculatedDataTab calculatedData={calculatedData} />
        )}
        {activeTab === "graphical" && (
          <GraphicalViewTab calculatedData={calculatedData} />
        )}
      </div>
    </div>
  );
};

export default SimulationMM1;
