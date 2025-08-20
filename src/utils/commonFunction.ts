import fs from "fs";
import path from "path";
import { Weather } from "../models/weatherModels.js";

const dataFile = path.join(__dirname, "../../weather.json");

export const readData = (): Weather[] => {
    if (!fs.existsSync(dataFile)) {
        fs.writeFileSync(dataFile, JSON.stringify([]));
    }
    const data = fs.readFileSync(dataFile, "utf-8");
    return JSON.parse(data || "[]");
};

export const writeData = (data: Weather[]): void => {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};
