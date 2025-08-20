import { Express } from "express";
import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { Weather } from "../models/weatherModels";
import { readData, writeData } from "../utils/commonFunction";

//Get All Weather Records
export const getWeatherHandler = (_req: Request, res: Response) => {
    const records = readData();
    res.json(records);
};

//Add Weather Record
export const addWeatherHandler = (req: Request, res: Response) => {
    const { city, temperature, condition } = req.body;
    if (!city || typeof temperature !== "number" || !condition) {
        return res.status(400).json({ error: "Invalid input" });
    }

    const records = readData();
    const newRecord: Weather = {
        id: nanoid(5),
        city,
        temperature,
        condition,
        recordedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    records.push(newRecord);
    writeData(records);

    res.status(201).json(newRecord);
};

//Update Weather Record
export const updateWeatherHandler = (req: Request, res: Response) => {
    const { id } = req.params;
    const { temperature, condition } = req.body;

    const records = readData();
    const record = records.find((r) => r.id === id);

    if (!record) return res.status(404).json({ error: "Record not found" });

    if (temperature !== undefined) record.temperature = temperature;
    if (condition !== undefined) record.condition = condition;
    record.updatedAt = new Date().toISOString();

    writeData(records);
    res.json(record);
};

//Delete Weather Record
export const deleteWeatherHandler = (req: Request, res: Response) => {
    const { id } = req.params;
    let records = readData();
    const initialLength = records.length;

    records = records.filter((r) => r.id !== id);

    if (records.length === initialLength) {
        return res.status(404).json({ error: "Record not found" });
    }

    writeData(records);
    res.json({ message: "Record deleted" });
};

//Get Records for a City
export const getCityWeatherHandler = (req: Request, res: Response) => {
    const { cityName } = req.params;
    const { from, to } = req.query;

    let records = readData().filter(
        (r) => r.city.toLowerCase() === cityName.toLowerCase()
    );

    if (from || to) {
        records = records.filter((r) => {
            const recordedAt = new Date(r.recordedAt).getTime();
            if (from && recordedAt < new Date(from as string).getTime()) {
                return false;
            }
            if (to && recordedAt > new Date(to as string).getTime()) {
                return false;
            }
            return true;
        });
    }
    res.json(records);
};
