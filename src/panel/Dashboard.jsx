import React, { useEffect, useState } from "react";
import { Grid, Paper } from "@mui/material";
import { Pie, Line } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, LineElement, PointElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, LineElement, PointElement);

const Dashboard = () => {
  const [clientesCount, setClientesCount] = useState(0);
  const [proveedoresCount, setProveedoresCount] = useState(0);
  const [serviciosData, setServiciosData] = useState([]);
  const [ventasData, setVentasData] = useState([]);
  const [comprasData, setComprasData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const clientesResponse = await axios.get("https://a-1-bym0.onrender.com/clientes", config);
        setClientesCount(clientesResponse.data.length);

        const proveedoresResponse = await axios.get("https://a-1-bym0.onrender.com/proveedor", config);
        setProveedoresCount(proveedoresResponse.data.length);

        const serviciosResponse = await axios.get("https://a-1-bym0.onrender.com/servicios", config);
        setServiciosData(serviciosResponse.data);

        const ventasResponse = await axios.get("https://a-1-bym0.onrender.com/ventas", config);
        setVentasData(ventasResponse.data.map(venta => venta.cantidad));

        const comprasResponse = await axios.get("https://a-1-bym0.onrender.com/compras", config);
        setComprasData(comprasResponse.data.map(compra => compra.cantidad));
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  const pieData1 = {
    labels: ["Clientes", "Proveedores"],
    datasets: [
      {
        data: [clientesCount, proveedoresCount],
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const pieData2 = {
    labels: serviciosData.map(servicio => servicio.Nombre),
    datasets: [
      {
        data: serviciosData.map(servicio => servicio.Cantidad),
        backgroundColor: serviciosData.map(() => `hsl(${Math.random() * 360}, 70%, 50%)`),
      },
    ],
  };

  const lineData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        label: 'Ventas',
        data: ventasData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
      {
        label: 'Compras',
        data: comprasData,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: false,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.dataset.label + ': ' + context.parsed.y;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Meses',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad',
        },
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 20,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.label + ': ' + context.formattedValue;
          },
        },
      },
    },
  };

  return (
    <div>
      <h1>DASHBOARD</h1>
      <Grid container spacing={5} justifyContent="center"> 
        <Grid item xs={12} sm={6} md={3.5} style={{ display: 'flex', justifyContent: 'center' }}> 
          <Paper elevation={13} style={{ padding: 20, width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>Clientes y Proveedores</h2>
            <div style={{ width: '100%', height: '275px' }}>
              <Pie data={pieData1} options={{ ...pieOptions, maintainAspectRatio: false }} />
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3.5} style={{ display: 'flex', justifyContent: 'center' }}> 
          <Paper elevation={13} style={{ padding: 20, width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>Servicios</h2>
            <div style={{ width: '100%', height: '300px' }}>
              <Pie data={pieData2} options={{ ...pieOptions, maintainAspectRatio: false }} />
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: 26 }}>
            <h2>Compras y Ventas</h2>
            <div style={{ width: '100%', height: '550px' }}> 
              <Line data={lineData} options={lineOptions} />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
