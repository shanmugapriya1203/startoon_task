import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto'; 
import { BASE_URL } from './../api/apiService';

const UserCountChart = () => {
  const [userCounts, setUserCounts] = useState({});
  const chartRef = useRef(null);

  const fetchUserCounts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/userCounts`);
      if (response.ok) {
        const data = await response.json();
        setUserCounts(data);
      } else {
        console.error('Failed to fetch user counts:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user counts:', error);
    }
  };

  const renderChart = () => {
    const ctx = document.getElementById('userCountChart').getContext('2d');
    if (chartRef.current) {
      chartRef.current.destroy(); 
    }
    const labels = Object.keys(userCounts);
    const data = {
      labels: labels,
      datasets: [{
        label: 'User Count',
        data: Object.values(userCounts),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1
      }]
    };
    const config = {
      type: 'bar',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };
    chartRef.current = new Chart(ctx, config);
  };

  useEffect(() => {
    fetchUserCounts(); 
  }, []);

  useEffect(() => {
    if (Object.keys(userCounts).length > 0) {
      renderChart(); 
    }
  }, [userCounts]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-1/2 h-1/2">
        <h1 className="text-center text-3xl font-bold mb-4">User Login Counts</h1>
        <canvas id="userCountChart"></canvas>
        <div className="mt-4">
          {Object.keys(userCounts).map((key) => (
            <p key={key} className="text-center">{`${key}: ${userCounts[key]}`}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserCountChart;
