import express from 'express';
import { Habit } from '../models/model.js';
import cors from 'cors';
const router = express.Router();

router.use(
    cors({
      origin: "localhost:3000",
      credentials: true,
    }),
  );

router.post('/habits', async (req, res) => {
    try {
        const habit = new Habit(req.body);
        await habit.save();
        res.status(201).json(habit);
    } catch (error) {
        res.status(400).json({ message: 'Error creating habit', error });
    }
});

router.get('/habits/:day', async (req, res) => {
    try {
        const day = req.params.day.toLowerCase();
        if (!['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].includes(day)) {
            return res.status(400).json({ message: 'Invalid day' });
        }
        const habits = await Habit.find({ [`repeatDays.${day}`]: true });
        res.json(habits);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching habits', error });
    }
});

router.put('/habits/:id', async (req, res) => {
    try {
        const habit = await Habit.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }
        res.json(habit);
    } catch (error) {
        res.status(400).json({ message: 'Error updating habit', error });
    }
});

router.delete('/habits/:id', async (req, res) => {
    try {
        const habit = await Habit.findByIdAndDelete(req.params.id);
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }
        res.json({ message: 'Habit deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting habit', error });
    }
});

export default router;
