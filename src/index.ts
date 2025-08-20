import express from "express";
import weatherRoutes from "./routes/weatherRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mount router at `/api/weather`
app.use("/api/weather", weatherRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
