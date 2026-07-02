import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
  const navigate = useNavigate() ;
    return (
        <>
<div className="hero min-h-screen  bg-emerald-300 text-white hero-overlay">
  <div className="hero-content text-center">
    <div className="max-w-md">
      <h1 className="text-5xl font-bold"> Welcome to the dashboard</h1>
      <p className="py-6"> 
      You can get all your private and secure information on this site and <br />
      this information is safe no one can access your information so you don't <br />
      need to be afraid that your information is the same or not your data is our safety <br />
      you don't need to think about that matter. <br />
      </p>
      <button className="btn btn-primary" onClick={()=>navigate("/")}>Get Started</button>
    </div>
  </div>
</div>  
        </>
    );
};

export default DashboardHome;