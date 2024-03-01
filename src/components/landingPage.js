import React from "react";
import { Link } from "react-router-dom";
import videoFile from "../assests/videos/pexels_videos_4577 (2160p).mp4";
import "./Button.css";

function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src={videoFile}
        autoPlay
        loop
        muted
      />
      <div className="text-center relative">
        <h1 className="text-5xl text-white font-bold mb-16">
          Welcome<br/> to the Queueing Model Simulator
        </h1>

        <div className="space-x-4 space-y-4">
          <div className="flex flex-wrap space-x-8 justify-center">
            <Link to="/mm1">
              <button className="glowing-btn">
                <span className="glowing-word">
                  MM1 Model
                </span>
              </button>
            </Link>
            <Link to="/mg1">
              <button className="glowing-btn">
                <span className="glowing-word">
                  MG1 Model
                </span>
              </button>
            </Link>
            <Link to="/gg1">
              <button className="glowing-btn">
                <span className="glowing-word">
                  GG1 Model
                </span>
              </button>
            </Link>
          </div>
          <div className="flex flex-wrap space-x-8  justify-center">
            <Link to="/mm2">
              <button className="glowing-btn">
                <span className="glowing-word">
                  MM2 Model
                </span>
              </button>
            </Link>
            <Link to="/mg2">
              <button className="glowing-btn">
                <span className="glowing-word">
                  MG2 Model
                </span>
              </button>
            </Link>
            <Link to="/gg2">
              <button className="glowing-btn">
                <span className="glowing-word">
                  GG2 Model
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
