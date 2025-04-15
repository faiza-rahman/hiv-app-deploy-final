const Mood = require("./model");
const mongoose = require("mongoose");

// log or update mood for a day
exports.logMood = async (req, res) => {
    const { userId, date, mood, diaryEntry } = req.body;
    try {
        let moodEntry = await Mood.findOne({ userId, date });

        if (moodEntry) {
            moodEntry.mood = mood; // update mood
            moodEntry.diaryEntry = diaryEntry || moodEntry.diaryEntry; // update diary entry
        } else {
            moodEntry = new Mood({
                userId,
                date, // set date
                mood, // set mood
                diaryEntry: diaryEntry || "", // set diary entry if provided
                hasDiaryEntry: !!diaryEntry // set hasDiaryEntry based on diary entry
            });
        }

        await moodEntry.save(); // save the mood entry
        res.status(200).json(moodEntry); // return the saved mood entry
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getWeeklyMood = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Get the date 7 days ago (normalized to UTC midnight)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
      sevenDaysAgo.setUTCHours(0, 0, 0, 0);

      // Get today's date (normalized to UTC midnight)
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      // Calculate the next day after today (exclusive upper bound)
      const nextDay = new Date(today);
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);
      nextDay.setUTCHours(23, 59, 59, 999);

      console.log("sevenDaysAgo:", sevenDaysAgo.toISOString());
      console.log("nextDay:", nextDay.toISOString());
      
      // Query the database for mood logs in the past 7 days
      const moodLogs = await Mood.find({
        userId,
        date: { $gte: sevenDaysAgo, $lt: nextDay },
      }).sort({ date: 1 }); 

      console.log("Mood logs found:", moodLogs);

      // Check for 3 consecutive days of "Angry" or "VerySad"
      let consecutiveNegativeMoods = 0;
      let recommendation = null;

      for (let i = 0; i < moodLogs.length; i++) {
          const mood = moodLogs[i].mood;
          if (mood === "Angry" || mood === "VerySad") {
              consecutiveNegativeMoods++;
              if (consecutiveNegativeMoods >= 3) {
                  recommendation = "We recommend scheduling an appointment with your doctor.";
                  break;
              }
          } else {
              consecutiveNegativeMoods = 0; // Reset the counter if the mood is not negative
          }
      }
      
      res.json(moodLogs);
  } catch (error) {
      console.error("Error fetching weekly mood data:", error.message);
      res.status(500).json({ message: error.message });
  }
};
