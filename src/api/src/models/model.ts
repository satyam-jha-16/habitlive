import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    repeatDays: {
        mon: { type: Boolean, default: false },
        tue: { type: Boolean, default: false },
        wed: { type: Boolean, default: false },
        thu: { type: Boolean, default: false },
        fri: { type: Boolean, default: false },
        sat: { type: Boolean, default: false },
        sun: { type: Boolean, default: false },
    },
    isComplete: {
        type: Boolean,
        required: true,
        default: false,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

export const Habit = mongoose.model('Habit', habitSchema);
