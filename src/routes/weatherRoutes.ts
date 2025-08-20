import { Router } from "express";
import {
    getWeatherHandler,
    addWeatherHandler,
    updateWeatherHandler,
    deleteWeatherHandler,
    getCityWeatherHandler,
} from "../handler/taskHandler";

const router = Router();

router.get("/", getWeatherHandler);
router.post("/", addWeatherHandler);
router.put("/:id", updateWeatherHandler);
router.delete("/:id", deleteWeatherHandler);
router.get("/city/:cityName", getCityWeatherHandler);

export default router;
