import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Weather } from "../models/weatherModels";
import { readData, writeData } from "../utils/filehandler";

const router = Router();

// Add Weather Record
router.post("/", (req: Request, res: Response) => {
    const { city, temperature, condition } = req.body;
    if (!city || typeof temperature !== "number" || !condition) {
        return res.status(400).json({ error: "Invalid input" });
    }

    const records = readData();
    const newRecord: Weather = {
        id: uuidv4(),
        city,
        temperature,
        condition,
        recordedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    records.push(newRecord);
    writeData(records);

    res.status(201).json(newRecord);
});

// Update Weather Record
router.put("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const { temperature, condition } = req.body;

    const records = readData();
    const record = records.find(r => r.id === id);

    if (!record) return res.status(404).json({ error: "Record not found" });

    if (temperature !== undefined)
        record.temperature = temperature;
    if (condition !== undefined)
        record.condition = condition;
    record.updatedAt = new Date().toISOString();

    writeData(records);
    res.json(record);
});

//Delete Weather Record
router.delete("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    let records = readData();
    const initialLength = records.length;

    records = records.filter(r => r.id !== id);

    if (records.length === initialLength) {
        return res.status(404).json({ error: "Record not found" });
    }

    writeData(records);
    res.json({ message: "Record deleted" });
});

//Get All Weather Records
router.get("/", (_req: Request, res: Response) => {
    const records = readData();
    res.json(records);
});

//Get Records for a City (with optional date filter)
router.get("/city/:cityName", (req: Request, res: Response) => {
    const { cityName } = req.params;
    const { from, to } = req.query;

    let records = readData().filter(
        r => r.city.toLowerCase() === cityName.toLowerCase()
    );

    if (from || to) {
        records = records.filter(r => {
            const recordedAt = new Date(r.recordedAt).getTime();
            const fromTime = from ? new Date(from as string).getTime() : -Infinity;
            const toTime = to ? new Date(to as string).getTime() : Infinity;
            return recordedAt >= fromTime && recordedAt <= toTime;
        });
    }

    res.json(records);
});

export default router;
