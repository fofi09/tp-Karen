import { LoadingButton } from "@mui/lab";
import { Box, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";

const API_WEATHER = `http://api.weatherapi.com/v1/current.json?key=d16194581ea74080af402635240706&lang=es&q=`;

export default function App() {
  const [city, setCity] = useState("");
  const [error, setError] = useState({
    error: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");

  const saveToDatabase = async () => {
    try {
      if (!weather) {
        throw new Error('No hay datos meteorológicos para guardar');
      }
  
      const response = await fetch('http://localhost:5000/saveWeatherData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: weather.city,
          temperature: weather.temperature
        }),
      });
  
      if (!response.ok) {
        throw new Error('No se pudo guardar en mongoDB');
      }
  
      setSaveMessage("Búsqueda guardada con éxito");
      setTimeout(() => {
        setSaveMessage("");
      }, 3000);

      console.log('Se guardo correctamente en mongoDB');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError({ error: false, message: "" });
    setLoading(true);

    try {
      if (!city.trim()) throw { message: "Debe ingresar una ciudad" };

      const res = await fetch(API_WEATHER + city);
      if (!res.ok) {
        throw { message: "No se pudo obtener el clima, intente nuevamente" };
      }
      const data = await res.json();

      if (data.error) {
        throw { message: data.error.message };
      }

      console.log(data);

      setWeather({
        city: data.location.name,
        country: data.location.country,
        temperature: data.current.temp_c,
        condition: data.current.condition.code,
        conditionText: data.current.condition.text,
        icon: data.current.condition.icon,
      });
    } catch (error) {
      console.log(error);
      setError({ error: true, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const clearWeather = () => {
    setWeather(null);
    setCity("");
  };

  return (
    <div className="background-color" style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "3px", background: "linear-gradient(to bottom right, #66CCFF, #3366CC)" }}>
      <Container
        maxWidth="sm"
        sx={{
          mt: 2,
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "20px",
          backgroundColor: "#f5f5f5",
          boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          align="center"
          gutterBottom
          sx={{
            color: "#fff",
            fontFamily: "georgia",
            fontWeight: 700,
            marginBottom: "20px",
            textShadow: "0px 0px 2px rgba(0,0,1,0.9)" // Shadow más oscuro
            // Resaltado en gris muy claro
          }}
        >
          API del Clima
        </Typography>

        <Box
          sx={{ display: "grid", gap: 2 }}
          component="form"
          autoComplete="off"
          onSubmit={onSubmit}
        >
         <TextField
  id="city"
  label="Ingrese una ciudad"
  variant="outlined"
  size="small"
  fullWidth
  value={city}
  onChange={(e) => setCity(e.target.value)}
  error={error.error}
  helperText={error.message}
  sx={{ borderRadius: "5px", color: "#00BCD4", borderColor: "#00BCD4" }} // Color azul para el texto y el borde
/>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
            loadingIndicator="Buscando..."
            sx={{
              backgroundColor: "#00BCD4", // Celeste cian
              color: "white",
              borderRadius: "5px",
              "&:hover": {
                backgroundColor: "#0097A7", // Lighter celeste cian on hover
              }
            }}
          >
            Buscar 
          </LoadingButton>
          
          <LoadingButton
            onClick={saveToDatabase} 
            variant="contained"
            sx={{
              backgroundColor: "#00BCD4", // Celeste cian
              color: "white",
              borderRadius: "5px",
              "&:hover": {
                backgroundColor: "#0097A7", // Lighter celeste cian on hover
              }
            }}
          >
         Guardar Registro
          </LoadingButton>
          {saveMessage && (
            <Typography
              variant="body1"
              align="center"
              color="primary"
              sx={{ marginTop: "10px" }}
            >
              {saveMessage}
            </Typography>
          )}
          {weather && (
            <LoadingButton
              onClick={clearWeather}
              variant="contained"
              sx={{
                backgroundColor: "#00BCD4", // Celeste cian
                color: "white",
                borderRadius: "5px",
                "&:hover": {
                  backgroundColor: "#0097A7", // Lighter celeste cian on hover
                }
              }}
            >
              Eliminar Búsqueda
            </LoadingButton>
          )}

        </Box>

        {weather && (
          <div
            className="cardContainer"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <div
              className="card"
              style={{
                backgroundColor: "#FFFFFF",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)",
                maxWidth: "300px",
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                align="center"
                gutterBottom
                sx={{ color: "#333" }}
              >
                {weather.city}, {weather.country}
              </Typography>
              <Typography
                variant="body1"
                align="center"
                gutterBottom
                sx={{ color: "#333" }}
              >
                {weather.conditionText}
              </Typography>
              <img
                alt={weather.conditionText}
                src={weather.icon}
                style={{ width: "100px", height: "75px", margin: "auto", display: "block" }}
              />
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                sx={{ color: "#333" }}
              >
                {weather.temperature} °C
              </Typography>
            </div>
          </div>
        )}

      </Container>
    </div>
  );
}
