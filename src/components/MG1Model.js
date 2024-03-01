import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import videoFile from "../assests/videos/pexels_videos_4577 (2160p).mp4";

const MG1Model = () => {
  const [arrivalMean, setArrivalMean] = useState(0);
  const [serviceDistribution, setServiceDistribution] = useState("");
  const [serviceMean, setServiceMean] = useState(0);
  const [avalue, setavalue] = useState(1);
  const [bvalue, setbvalue] = useState(3);
  const [Avalue, setAvalue] = useState(55);
  const [Cvalue, setCvalue] = useState(9);
  const [Zvalue, setZvalue] = useState(10112166);
  const [Mvalue, setMvalue] = useState(1994);

  const handleSimulate = () => {
    // Pass arrivalMean, serviceDistribution, and serviceMean as query parameters in the link
    const searchParams = new URLSearchParams({
      arrivalMean,
      serviceDistribution,
      serviceMean,
      avalue,
      bvalue,
      Avalue,
      Cvalue,
      Zvalue,
      Mvalue
    });

    // Generate the link URL with query parameters
    const linkURL = `/simulationmg1?${searchParams.toString()}`;

    // Navigate to the simulation page using the link
    window.location.href = linkURL;
  };

  return (
    <div className="relative flex justify-center items-center">
      <video
        src={videoFile} // Replace with the path to your animation video file
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover z-10"
      ></video>
      <div className="relative z-20 w-1/2 rounded-xl shadow-xl p-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl text-center text-white font-bold">
            MG1 Model Simulation
          </h2>
          <p className="text-sm text-center text-white italic">
            Enter arrival mean, select the service distribution, and provide the
            service mean to simulate the MG1 model:
          </p>
        </div>
        <div className="mb-8 text-center">
          <label
            className="block mb-2 text-xl font-bold text-center text-white"
            htmlFor="arrivalMeanInput"
          >
            Arrival Mean:
          </label>
          <input
            style={{
              background: "transparent",
              color: "whitesmoke",
              fontWeight: "bolder",
            }}
            id="arrivalMeanInput"
            type="number"
            className="w-1/2 p-2 border text-center  rounded-xl border-white"
            value={arrivalMean}
            onChange={(e) => setArrivalMean(e.target.value)}
          />
        </div>
        <div className="mb-8 text-center">
          <label
            className="block mb-2 text-xl font-bold text-center text-white"
            htmlFor="serviceDistributionSelect"
          >
            Service Distribution:
          </label>
          <select
            style={{
              background: "transparent",
              color: "whitesmoke",
              fontWeight: "bolder",
            }}
            id="serviceDistributionSelect"
            className="w-1/2 p-2 border text-center  rounded-xl border-white"
            value={serviceDistribution}
            onChange={(e) => setServiceDistribution(e.target.value)}
          >
            <option className="text-black" value="">Select a distribution</option>
            <option className="text-black" value="gamma">Gamma Distribution</option>
            <option className="text-black" value="normal">Normal Distribution</option>
            <option className="text-black" value="uniform">Uniform Distribution</option>
          </select>
        </div>
        <div className="mb-8 text-center">
          <label
            className="block mb-2 text-xl font-bold text-center text-white"
            htmlFor="serviceMeanInput"
          >
            Service Mean:
          </label>
          <input
            style={{
              background: "transparent",
              color: "whitesmoke",
              fontWeight: "bolder",
            }}
            id="serviceMeanInput"
            type="number"
            className="w-1/2 p-2 border text-center  rounded-xl border-white"
            value={serviceMean}
            onChange={(e) => setServiceMean(e.target.value)}
          />
        </div>
        <div className="mb-8 text-center">
          <label
            className="block mb-2 text-xl font-bold text-center text-white"
            htmlFor="serviceMeanInput"
          >
            Enter Lower Limit:
          </label>
          <input
            style={{
              background: "transparent",
              color: "whitesmoke",
              fontWeight: "bolder",
            }}
            id="avalueInput"
            type="number"
            className="w-1/2 p-2 border text-center  rounded-xl border-white "
            value={avalue}
            onChange={(e) => setavalue(e.target.value)}
          />
        </div>
        <div className="mb-8 text-center">
          <label
            className="block mb-2 text-xl font-bold text-center text-white"
            htmlFor="serviceMeanInput"
          >
            Enter Upper Limit:
          </label>
          <input
            style={{
              background: "transparent",
              color: "whitesmoke",
              fontWeight: "bolder",
            }}
            id="bvalueInput"
            type="number"
            className="w-1/2 p-2 border text-center  rounded-xl border-white "
            value={bvalue}
            onChange={(e) => setbvalue(e.target.value)}
          />
        </div>
        <div className="mb-8 text-center">
          <label
            className="block mb-2 text-xl font-bold text-center text-white"
            htmlFor="serviceMeanInput"
          >
            Enter Value of A:
          </label>
          <input
            style={{
              background: "transparent",
              color: "whitesmoke",
              fontWeight: "bolder",
            }}
            id="AvalueInput"
            type="number"
            className="w-1/2 p-2 border text-center  rounded-xl border-white "
            value={Avalue}
            onChange={(e) => setAvalue(e.target.value)}
          />
        </div>
        <div className="mb-8 text-center">
          <label
            className="block mb-2 text-xl font-bold text-center text-white"
            htmlFor="serviceMeanInput"
          >
            Enter Value of C:
          </label>
          <input
            style={{
              background: "transparent",
              color: "whitesmoke",
              fontWeight: "bolder",
            }}
            id="CvalueInput"
            type="number"
            className="w-1/2 p-2 border text-center  rounded-xl border-white "
            value={Cvalue}
            onChange={(e) => setCvalue(e.target.value)}
          />
        </div>
        <div className="mb-8 text-center">
          <label
            className="block mb-2 text-xl font-bold text-center text-white"
            htmlFor="serviceMeanInput"
          >
            Enter Value of Z:
          </label>
          <input
            style={{
              background: "transparent",
              color: "whitesmoke",
              fontWeight: "bolder",
            }}
            id="ZvalueInput"
            type="number"
            className="w-1/2 p-2 border text-center  rounded-xl border-white "
            value={Zvalue}
            onChange={(e) => setZvalue(e.target.value)}
          />
        </div>
        <div className="mb-8 text-center">
          <label
            className="block mb-2 text-xl font-bold text-center text-white"
            htmlFor="serviceMeanInput"
          >
            Enter Value of M:
          </label>
          <input
            style={{
              background: "transparent",
              color: "whitesmoke",
              fontWeight: "bolder",
            }}
            id="MvalueInput"
            type="number"
            className="w-1/2 p-2 border text-center  rounded-xl border-white "
            value={Mvalue}
            onChange={(e) => setMvalue(e.target.value)}
          />
        </div>

        <div className="mb-8 text-center">
          <Link
            to="/simulationmg1"
            onClick={handleSimulate}
            className="w-96 bg-gray-400 hover:bg-gray-600 text-white  font-bold py-2 px-4 rounded "
          >
            Simulate
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MG1Model;
