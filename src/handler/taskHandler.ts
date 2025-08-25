import { Express } from "express";
import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { Weather } from "../models/weatherModels";
import { readData, writeData } from "../utils/commonFunction";
import { weatherSchema, updateWeatherSchema, dateQuerySchema } from "../schema/weatherSchema";


//Get All Weather Records
export const getWeatherHandler = (_req: Request, res: Response) => {
    const records = readData();
    res.json(records);
};

//Add Weather Record
export const addWeatherHandler = (req: Request, res: Response) => {

    const parseResult = weatherSchema.safeParse(req.body);

    if (!parseResult.success) {
        return res.status(400).json({ errors: parseResult.error.message });
    }


    const { city, temperature, condition } = parseResult.data;
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

    const parseResult = updateWeatherSchema.safeParse(req.body);

    if (!parseResult.success) {
        return res.status(400).json({ errors: parseResult.error.message });
    }

    const records = readData();
    const record = records.find((r) => r.id === id);

    const { temperature, condition } = parseResult.data;
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


    const praseRes = dateQuerySchema.safeParse(req.query);
    if (!praseRes.success) {
        return res.status(400).json({ errors: praseRes.error.message });
    }
    const { from, to } = praseRes.data;

    let records = readData().filter(
        (r) => r.city.toLowerCase() === cityName.toLowerCase()
    );

    if (from || to) {
        records = records.filter((r) => {
            const recordedAt = new Date(r.recordedAt).getTime();
            if (from) {
                const fromDate = new Date(from as string).getTime();
                if (isNaN(fromDate))
                    return false;
            }
            if (to) {
                const toDate = new Date(to as string).getTime();
                if (isNaN(toDate) || recordedAt > toDate)
                    return false;
            }
            return true;
        });
    }
    res.json(records);
};
