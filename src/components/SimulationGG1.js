import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import RandomDataTabGG1 from "./Simulation/GG1/RandomDataTabGG1";
import CalculatedDataTabGG1 from "./Simulation/GG1/CalculatedDataTabGG1";
import GraphicalViewTabGG1 from "./Simulation/GG1/GraphicalViewTabGG1";
import background from "../assests/pictures/xyz.jpg";

const SimulationGG1 = () => {
  const [activeTab, setActiveTab] = useState("random");
  const [randomData, setRandomData] = useState([]);
  const [calculatedData, setCalculatedData] = useState([]);
  const [arrivalMean, setArrivalMean] = useState(0);
  const [serviceDistribution, setServiceDistribution] = useState("");
  const [serviceMean, setServiceMean] = useState(0);
  const [arrivalDistribution, setArrivalDistribution] = useState("");
  const location = useLocation();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const arrivalMeanParam = parseFloat(params.get("arrivalMean"));
    const serviceMeanParam = parseFloat(params.get("serviceMean"));
    const selectedDistribution = params.get("serviceDistribution");
    const selectedArrivalDistribution = params.get("arrivalDistribution");
    const a = parseFloat(params.get("avalue"));
    const b = parseFloat(params.get("bvalue"));
    const A = parseFloat(params.get("Avalue"));
    const C = parseFloat(params.get("Cvalue"));
    const Z = parseFloat(params.get("Zvalue"));
    const M = parseFloat(params.get("Mvalue"));
    console.log(
      arrivalMeanParam + " " + serviceMeanParam + selectedArrivalDistribution + selectedArrivalDistribution
    );
    if (
      !isNaN(arrivalMeanParam) &&
      !isNaN(serviceMeanParam) &&
      selectedDistribution &&
      selectedArrivalDistribution
    ) {
      setArrivalMean(arrivalMeanParam);
      setServiceMean(serviceMeanParam);
      setServiceDistribution(selectedDistribution);
      setArrivalDistribution(selectedArrivalDistribution);

      const data = generateRandomData(
        arrivalMeanParam,
        serviceMeanParam,
        selectedArrivalDistribution,
        selectedDistribution,
        a,
        b,
        A,
        C,
        Z,
        M
      );
      setRandomData(data);

      const calculatedData = calculateCalculatedData(
        serviceMean,
        data,
        selectedDistribution,
        selectedArrivalDistribution
      );
      setCalculatedData(calculatedData);
    }
  }, [location.search]);

  const generateRandomData = (
    arrivalMean,
    serviceMean,
    arrivalDistribution,
    serviceDistribution,
    a, b, A, C, Z, M
  ) => {
    const data = [];
    let arrivalTime = 0;
    let cumulativeProbability = 0;
    let targetProbability = 1;
    let x = 0;
    // let A = 55;
    // let C = 9;
    // let Z = 10112166;
    // let M = 1994;
    // let a = 1;
    // let b = 3;

    while (cumulativeProbability <= targetProbability) {
      const interarrivalTime = Math.round(
        generateRandomTime(arrivalMean, arrivalDistribution)
      );
      const serviceTime = generateRandomServiceTime(
        serviceMean,
        serviceDistribution
      );

      arrivalTime += interarrivalTime;
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

  const generateRandomTime = (mean, distribution) => {
    let time;

    if (distribution === "gamma") {
      // Generate exponentially-distributed random time
      // Generate gamma-distributed random time
      const shape = 2; // Shape parameter for gamma distribution (example value)
      const scale = mean / shape; // Scale parameter for gamma distribution

      let value = 0;
      for (let i = 0; i < shape; i++) {
        value -= Math.log(Math.random());
      }
      time = Math.round(value * scale);
    } else if (distribution === "uniform") {
      // Generate uniformly-distributed random time
      time = Math.round(Math.random() * mean);
    } else if (distribution === "normal") {
      // Generate normally-distributed random time
      const standardDeviation = mean / 3; // Assuming 99.7% of values are within 3 standard deviations
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        sum += Math.random();
      }
      time = Math.round((sum - 6) * standardDeviation + mean);
    }

    return time;
  };

  const generateRandomServiceTime = (mean, distribution) => {
    let serviceTime;

    if (distribution === "gamma") {
      // Generate gamma-distributed service time
      const shape = 2; // Shape parameter for gamma distribution (example value)
      const scale = mean / shape; // Scale parameter for gamma distribution

      serviceTime = Math.round(generateGammaDistribution(shape, scale));
    } else if (distribution === "normal") {
      // Generate normally-distributed service time
      const standardDeviation = 1; // Standard deviation for normal distribution (example value)

      serviceTime = Math.round(
        generateNormalDistribution(mean, standardDeviation)
      );
    } else if (distribution === "uniform") {
      // Generate uniformly-distributed service time
      const min = mean - 0.5; // Minimum value for uniform distribution
      const max = mean + 0.5; // Maximum value for uniform distribution

      serviceTime = Math.round(generateUniformDistribution(min, max));
    }

    return serviceTime;
  };

  // Helper function to generate a random number from gamma distribution
  const generateGammaDistribution = (shape, scale) => {
    // Implementation of the gamma distribution using the Marsaglia and Tsang method
    let value = 0;

    // Marsaglia and Tsang method to generate gamma-distributed random number
    for (let i = 0; i < shape; i++) {
      value -= Math.log(Math.random());
    }

    value *= scale;

    return value;
  };

  const generateNormalDistribution = (mean, standardDeviation) => {
    // Implementation of the Box-Muller transform for generating normally-distributed random number
    let value;
    let u, v, s;

    do {
      u = Math.random() * 2 - 1;
      v = Math.random() * 2 - 1;
      s = u * u + v * v;
    } while (s >= 1 || s === 0);

    const multiplier = Math.sqrt((-2 * Math.log(s)) / s);
    value = mean + standardDeviation * u * multiplier;

    return value;
  };

  const generateUniformDistribution = (min, max) => {
    // Generate a random number within the specified range
    return min + Math.random() * (max - min);
  };

  const calculateCalculatedData = (serviceMean, data, serviceDistribution) => {
    console.log(serviceDistribution);
    const calculatedData = [];
    let currentTime = 0;
    let startTime = 0;
    let totalWaitTime = 0;
    let totalTurnaroundTime = 0;
    let serverIdleTime = 0;
    let serverUtilizationTime = 0;
    let expectedServiceTime;
    const stopped_customers = [];
    const skipped_customers = [];

    for (let i = 0; i < data.length; i++) {
      const { customer, interarrivalTime, arrivalTime, serviceTime } = data[i];
      const endTime = Math.max(arrivalTime, startTime) + serviceTime;
      const waitTime = Math.max(0, startTime - arrivalTime);
      const turnaroundTime = waitTime + serviceTime;

      calculatedData.push({
        customer,
        interarrivalTime,
        arrivalTime,
        serviceTime,
        startTime: Math.max(arrivalTime, startTime),
        endTime,
        waitTime,
        turnaroundTime,
        expectedServiceTime,
      });

      totalWaitTime += waitTime;
      totalTurnaroundTime += turnaroundTime;

      if (i > 0) {
        serverIdleTime += Math.max(0, startTime - arrivalTime);
      }

      serverUtilizationTime += serviceTime;

      startTime = endTime;
      if (serviceDistribution === "gamma") {
        // Calculate server utilization and idle time for gamma distribution
        const gammaShape = 2; // Example shape parameter for gamma distribution
        const gammaScale = serviceMean / gammaShape; // Example scale parameter for gamma distribution

        expectedServiceTime = gammaShape * gammaScale; // Example calculation of expected service time
      } else if (serviceDistribution === "normal") {
        // Calculate server utilization and idle time for normal distribution
        const normalStandardDeviation = 1; // Example standard deviation for normal distribution

        expectedServiceTime = serviceMean; // Example calculation of expected service time
      } else if (serviceDistribution === "uniform") {
        // Calculate server utilization and idle time for uniform distribution
        const uniformMin = serviceMean - 0.5; // Example minimum value for uniform distribution
        const uniformMax = serviceMean + 0.5; // Example maximum value for uniform distribution

        expectedServiceTime = (uniformMax - uniformMin) / 2; // Example calculation of expected service time
      }
    }

    const averageWaitTime = totalWaitTime / data.length;
    const averageTurnaroundTime = totalTurnaroundTime / data.length;

    const totalTime = startTime;
    let serverUtilization, serverIdle;

    if (serviceDistribution === "gamma") {
      // Calculate server utilization and idle time for gamma distribution
      const gammaShape = 2; // Example shape parameter for gamma distribution
      const gammaScale = serviceMean / gammaShape; // Example scale parameter for gamma distribution

      expectedServiceTime = gammaShape * gammaScale; // Example calculation of expected service time

      serverUtilization = serverUtilizationTime / totalTime;
      serverIdle = 1 - serverUtilization;
    } else if (serviceDistribution === "normal") {
      // Calculate server utilization and idle time for normal distribution
      const normalStandardDeviation = 1; // Example standard deviation for normal distribution

      expectedServiceTime = serviceMean; // Example calculation of expected service time

      console.log(expectedServiceTime);

      serverUtilization = serverUtilizationTime / totalTime;
      serverIdle = 1 - serverUtilization;
    } else if (serviceDistribution === "uniform") {
      // Calculate server utilization and idle time for uniform distribution
      const uniformMin = serviceMean - 0.5; // Example minimum value for uniform distribution
      const uniformMax = serviceMean + 0.5; // Example maximum value for uniform distribution

      expectedServiceTime = (uniformMax - uniformMin) / 2; // Example calculation of expected service time

      serverUtilization = serverUtilizationTime / totalTime;
      serverIdle = 1 - serverUtilization;
    }

    return {
      calculatedData,
      averageWaitTime,
      averageTurnaroundTime,
      serverUtilization,
      serverIdle,
      expectedServiceTime,
    };
  };

  return (
    <div
      className="flex flex-col items-center w-full"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        opacity: "0.9",
      }}
    >
      <div className="w-full max-w-3xl flex justify-center space-x-4 my-8">
        <button
          style={{ background: "gray" }}
          className={`tab-button bg-gray-50 border styled text-lg rounded-lg focus:ring-white focus:border-white block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white dark:focus:border-white ${activeTab === "random" ? "active" : ""
            }`}
          onClick={() => handleTabChange("random")}
        >
          Random Data
        </button>
        <button
          style={{ background: "gray" }}
          className={`tab-button bg-gray-50 border styled text-lg rounded-lg focus:ring-white focus:border-white block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white dark:focus:border-white ${activeTab === "calculated" ? "active" : ""
            }`}
          onClick={() => handleTabChange("calculated")}
        >
          Calculated Data
        </button>
        <button
          style={{ background: "gray" }}
          className={`tab-button bg-gray-50 border styled text-lg rounded-lg focus:ring-white focus:border-white block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white dark:focus:border-white ${activeTab === "graphical" ? "active" : ""
            }`}
          onClick={() => handleTabChange("graphical")}
        >
          Graphical View
        </button>
      </div>

      <div className="w-full">
        {activeTab === "random" && (
          <>
            <p className="text-center text-lg text-gray-300 underline">
              Using Service Distribution: {serviceDistribution}
            </p>
            <p className="text-center text-lg text-gray-300 underline">
              Using Arrival Distribution: {arrivalDistribution}
            </p>

            <RandomDataTabGG1 randomData={randomData} />
          </>
        )}
        {activeTab === "calculated" && (
          <>
            <p className="text-center text-lg text-gray-300 underline">
              Using Service Distribution: {serviceDistribution}
            </p>
            <p className="text-center text-lg text-gray-300 underline">
              Using Arrival Distribution: {arrivalDistribution}
            </p>
            <CalculatedDataTabGG1 calculatedData={calculatedData} />
          </>
        )}
        {activeTab === "graphical" && (
          <>
            <p className="text-center text-lg text-gray-300 underline">
              Using Service Distribution: {serviceDistribution}
            </p>
            <p className="text-center text-lg text-gray-300 underline">
              Using Arrival Distribution: {arrivalDistribution}
            </p>
            <GraphicalViewTabGG1 calculatedData={calculatedData} />
          </>
        )}
      </div>
    </div>
  );
};

export default SimulationGG1;
