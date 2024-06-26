/** 
  Author: Piera Blum
  Date: 26.06.2024
  Description: This is the Backend for the Calendar Page.
*/

const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// Route to retrieve all events
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to add a new event
router.post("/events", async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const newEvent = new Event({ title, description, date });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route for processing a event
router.put("/events/:eventId", async (req, res) => {
  const { eventId } = req.params;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, {
      new: true,
    });
    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to delete a event
router.delete("/events/:eventId", async (req, res) => {
  const { eventId } = req.params;
  try {
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
