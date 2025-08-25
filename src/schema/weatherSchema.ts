import { z } from "zod";

// Schema for adding a weather record
export const weatherSchema = z.object({
    city: z.string()
        .min(1, "City is required")
        .refine((val) => val.trim().length > 0, {
            message: "City cannot be empty",
        }),

    temperature: z.number()
        .refine((val) => !isNaN(val), { message: "Temperature must be a valid number" })
        .refine((val) => val >= -50 && val <= 60, {
            message: "Temperature must be between -50 and 60 °C",
        }),

    condition: z.string()
        .min(1, "Condition is required")
        .refine((val) => val.trim().length > 0, {
            message: "Condition cannot be empty",
        }),
});

// Schema for updating a weather record
export const updateWeatherSchema = z.object({
    temperature: z.number().optional()
        .refine((val) => val === undefined || !isNaN(val), {
            message: "Temperature must be a valid number",
        }),
    condition: z.string().optional()
        .refine((val) => val === undefined || val.trim().length > 0, {
            message: "Condition cannot be empty",
        }),
});

export const dateQuerySchema = z.object({
    from: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
            message: "Invalid 'from' date format",
        }),
    to: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
            message: "Invalid 'to' date format",
        }),
});

// Types
export type WeatherInput = z.infer<typeof weatherSchema>;
export type UpdateWeatherInput = z.infer<typeof updateWeatherSchema>;
export type DateQueryInput = z.infer<typeof dateQuerySchema>;
