<template>
    <v-container>
        <v-app-bar app color="f5f5f5" elevation=0>
            <div class="d-flex align-left justify-left">
                <v-img
                    contain
                    height="200"
                    width="200"
                    src="@/assets/logo.png"
                />
            </div>
        </v-app-bar>
        <h1>Welcome Back, {{ userName }}!</h1>
        <br>

        <v-row>
            <v-col cols="7">
                <div class="text-h6 mb-2 d-flex "><span class="flex-grow-1">My Medications</span> 
                </div>
        <v-row>
  <v-col
    v-for="(medication, index) in medications"
    :key="index"
    cols="12"
  >
  <v-card
      class="rounded-xl pa-3"
      elevation="4"
      :class="{'card-red': selectedMedications.includes(medication.name)}"
    >
      <v-row align="center">
        <v-col cols="auto">
          <v-checkbox
            v-model="selectedMedications"
            :value="medication.name"
            label=""
          ></v-checkbox>
        </v-col>
        <v-col>
          <div class="font-weight-bold subtitle-1">{{ medication.name }}</div>

          <v-chip
            class="mt-2"
            :color="selectedMedications.includes(medication.name) ? 'white' : '#D26E63'"
            :text-color="selectedMedications.includes(medication.name) ? 'black' : 'white'"
          >
            {{ getDoseSummary(medication.dose) }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
  <!-- Edit Medication Dialog -->
  <v-dialog v-model="editDialog" max-width="500px">
    <v-card>
      <v-card-title class="pt-5 pl-6 edit-medication-title">Edit Medication</v-card-title>
      <v-card-text>
        <v-form ref="editForm">
          <v-text-field
            v-model="editMedication.name"
            label="Medication Name"
            required
          ></v-text-field>
          <v-text-field
            v-model="editMedication.dosage"
            label="Dosage"
            required
          ></v-text-field>
          <v-text-field
            v-model="editMedication.quantity"
            label="Quantity"
            required
          ></v-text-field>
          <v-text-field
            v-model="editMedication.timeOfDay"
            label="Time of Day"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="grey" text @click="closeEditDialog">Cancel</v-btn>
        <v-btn color="#D26E63" text @click="saveMedication">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-row>   
                </v-col>
            <v-col cols="1">
            </v-col>
            <v-col cols="4">
                <div class="text-h6 mb-2 ">
      <span class="flex-grow-1">My Symptoms</span>
      <v-btn
        elevation="0"
        rounded
        class="mx-auto"
        @click="openSymptomsDialogForNewDate"
      >
        <v-icon size="25" right>
          mdi-plus-circle-outline
        </v-icon>
      </v-btn>
    </div>
    <v-card color="#E8B7B1" class="rounded-xl">
      <v-container>
        <v-row>
          <v-col
            v-for="(date, index) in Object.keys(savedSymptoms)"
            :key="index"
            cols="12"
          > 
          
            <v-btn
              color="white"
              elevation="2"
              rounded
              block
              outlined
              class="d-flex justify-space-between align-center no-uppercase"
              @click="openSymptomsDialogForDate(date)"
            >
              <span>{{ date }}</span>
              <template v-slot:append>
              <v-icon class="ml-auto bold-icon" right>
                mdi-chevron-right
              </v-icon>
            </template>
            </v-btn>

          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <!-- Symptoms Dialog -->
    <v-dialog v-model="symptomsDialog" max-width="500px">
      <v-card>
        <v-card-title class="pt-5 pl-6 symptom-tracker-title" color="#E8B7B1">Symptom Tracker</v-card-title>
        <v-card-text>
          <v-form ref="symptomsForm">
            <v-text-field
              v-model="symptomsData.date"
              label="Date"
              readonly
            ></v-text-field>
            <div class="mt-4">
              <h4 class="mb-4">Select Symptoms:</h4>
              <v-checkbox
                v-for="(symptom, index) in symptomsList"
                :key="index"
                v-model="symptomsData.selectedSymptoms"
                :value="symptom"
                :label="symptom"
                density="compact"
              ></v-checkbox>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey" text @click="closeSymptomsDialog">Cancel</v-btn>
          <v-btn color="#D26E63" text @click="saveSymptoms">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
            </v-col>
        </v-row>

    <div class="text-h6 mb-2 mt-15 "><span class="flex-grow-1">How Are You Feeling Today?</span></div>
 

    <v-table class="mood-table">
  <thead>
    <tr>
      <th v-for="day in week" :key="day" class="text-center header-cell">{{ day }}</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td v-for="(day, index) in week" :key="index" class="text-center mood-cell">
        <div class="mood-content">
          <!-- Check if a mood entry exists for the current day -->
          <template v-if="weeklyMood[index]">
            <!-- Display the mood icon -->
            <v-icon :color="weeklyMood[index].color" size="40" class="mood-icon">
              {{ weeklyMood[index].icon }}
            </v-icon>
            <!-- Display the "View Diary" button if a diary entry exists -->
            <v-btn
              class="diary-btn"
              elevation="0"
              v-if="weeklyMood[index].diaryEntry"
              text
              @click="openMoodDialogWithData(weeklyMood[index])"
            >
              View Diary
            </v-btn>
          </template>
          <template v-else>
            <!-- Display the plus icon for empty entries -->
            <v-btn
              icon
              variant="outlined"
              class="mt-5"
              @click="openMoodDialog(day)"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
        </div>
      </td>
    </tr>
  </tbody>
</v-table>

    <!-- Mood Dialog -->
    <v-dialog v-model="moodDialog" max-width="500px">
  <v-card>
    <v-card-title class="pt-5 pl-6 edit-medication-title">Mood Entry</v-card-title>
    <v-card-text>
      <v-form ref="moodForm">
        <!-- Prefilled Date -->
        <v-text-field
          v-model="moodData.date"
          label="Date"
          readonly
        ></v-text-field>

        <!-- Mood Selector -->
        <h4>Mood of the Day:</h4> <br>
        <v-row justify="center" align="center" dense>
          <v-col
            v-for="(option, index) in moodOptions"
            :key="index"
            cols="auto"
            class="text-center"
          >
            <v-btn
              :color="moodData.mood === option.label ? option.color : 'white'"
              class="mood-option-btn"
              @click="moodData.mood = option.label"
              elevation="0"
              rounded
            >
              <v-icon :color="moodData.mood === option.label ? 'white' : option.color" size="36">
                {{ option.icon }}
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <br>
        <!-- Diary Entry -->
        <h4>Diary Entry:</h4><br>
        <v-textarea
          v-model="moodData.diaryEntry"
          label=""
          rows="5"
          outlined
        ></v-textarea>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="grey" text @click="closeMoodDialog">Cancel</v-btn>
      <v-btn
        color="#D26E63"
        text
        @click="saveMoodEntry"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>


    
        <div class="text-h6 mt-15 d-flex justify-space-between align-center">
            <span class="flex-grow-1">Resources For You</span>
        </div>
            <v-container class="info-section">
    <v-row justify="center">
      <v-col v-for="(item, index) in infoCards" :key="index" cols="12" sm="4">
        <v-card class="info-card" elevation="4" @click="navigateTo(item.link)">
          <v-card-text class="text-center">
            <v-icon class="info-icon" size="60">{{ item.icon }}</v-icon>
          </v-card-text>
          <v-card-actions class="justify-center">
            <span class="info-text">{{ item.text }}</span>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

    </v-container>
</template>

<!-- Uncomment the following lines to enable the recommendation dialog -->
<!-- <v-dialog v-model="recommendationDialog" max-width="500px">
  <v-card>
    <v-card-title class="headline">Recommendation</v-card-title>
    <v-card-text>
      {{ recommendationMessage }}
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" text @click="recommendationDialog = false">OK</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog> -->

<!-- <script>
import axios from "axios"
  export default {
    data: () => ({
        instructorName: '',
        selectedEvent: {},
        selectedElement: null,
        selectedOpen: false,
        instructorScheduleArray: [],
        events: [],
        isApproved: "",
        isAnimatingDots: false,
        generalpreferencesarray: [],
        availabilitiesArray: [],
        displayDots: '',
        dotCount: 0,
        maxDots: 4,
        itemsPerPage: 10,
        headers: [
          {
            text: 'Course Code',
            align: 'start',
            sortable: false,
            value: 'class_number',
          },
          { text: 'Course Number', value: 'course_number' },
          { text: 'Course Name', value: 'title' },
          { text: 'Section', value: 'section' },
          { text: 'Location', value: 'location' },
          { text: 'Days', value: 'days' },
          { text: 'Time', value: 'times_12h' },
        ],
        available_classes: [],
    }),

    mounted() {
        // Check if instructorName exists in localStorage, if not use default value
        this.instructorName = localStorage.getItem("instructorName") || this.$route.params.instructorName;
        console.log("LOCAL STORAGE:", localStorage.getItem("instructorName"));
        
        this.getCoursesArray();
        this.getAvailableCourses();
        this.animatePendingApproval();
        this.getInstructorPreferences();
        this.getInstructorAvailabilities();
        this.getInstructorScheduleStatus(); 
    },

    methods: {
        goToAvailableCourses() {
            this.$router.push({ name: 'AvailableCourses', params: { instructorName: this.instructorName } });
        },
        goToPastSchedules() {
            this.$router.push({ name: 'PastSchedules', params: { instructorName: this.instructorName } });
        },
        goToPreferences() {
            this.$router.push({ name: 'Preferences', params: { instructorName: this.instructorName} });
        },
        showPopup({ nativeEvent, event }) {
            const open = () => {
                this.selectedEvent = event;
                this.selectedElement = nativeEvent.target;
                requestAnimationFrame(() =>
                    requestAnimationFrame(() => (this.selectedOpen = true))
                );
            };
            if (this.selectedOpen) {
                this.selectedOpen = false;
                requestAnimationFrame(() => open());
            } else {
                open();
            }
            nativeEvent.stopPropagation();
        },


        async animatePendingApproval() {
            this.isAnimatingDots = true;
            while (this.isAnimatingDots) {
                await this.delay(500); // Adjust timing as needed
                this.displayDots += '.';
                this.dotCount++;

                if (this.dotCount === this.maxDots) {
                this.displayDots = '';
                this.dotCount = 0;
                }
            }
        },

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        async getInstructorPreferences(){
            const instructor_name = this.instructorName;
            console.log("instructor NAME:", instructor_name);
            try {
                const response = await axios.get(`http://localhost:3000/instructorpreferences/${instructor_name}`);
                this.generalpreferencesarray = response.data[0].general_preferences;
    
                console.log("instructor preferences:", response.data[0].general_preferences);
            } catch (error) {
                console.error('Error:', error.message);
            }
        },

        async getInstructorAvailabilities(){
            const instructor_name = this.instructorName;
            try {
                const response = await axios.get(`http://localhost:3000/instructorpreferences/${instructor_name}`);
                this.availabilitiesArray = response.data[0].availabilities;
                console.log('instructor avail:', response.data[0].availabilities);
            } catch (error) {
                console.error('Error:', error.message);
            }
        },

        displayTimes(times) {
            return times.join(', ');
        },

        async getAvailableCourses() {
            let availability = "false";
            try {
            const response = await axios.get(`http://localhost:3000/currentcourses/${availability}`);
            console.log(response)
            this.available_classes = response.data;
            } 
            catch (error) {
            console.error(error);
            }
            console.log("available courses array:", this.available_classes);
        },

        async getCoursesArray(){
            const instructor_name = this.instructorName;
            try {
                const response = await axios.get(`http://localhost:3000/instructorschedules/${instructor_name}/courses`);
                this.instructorScheduleArray = response.data;
            } 
            catch (error) {
                console.error(error.message);
            }

            this.events = this.parseCoursesToEvents(this.instructorScheduleArray);
        },

        parseCoursesToEvents(courses) {
            const localEvents = [];

            courses.forEach(course => {
                const days = course.days.map(day => day.slice(0, 3));

            console.log("Days: ", days)

                days.forEach(day => {
                    const[startString, endString] = this.getEventDateTime(day, course.times);
                const event = {
                    name: course.course_prefix.toUpperCase() + ' ' + course.course_number + ' ' + course.title,
                    start: startString,
                    end: endString,
                    color: '#FFB86F',
                    details: 'Section: ' + course.section + '<br>Location: ' + course.location,
                };
             
                localEvents.push(event);
                });
            });
            return localEvents;
        },

        getEventDateTime(day, time) {
            const [start, end] = time.split('-');
            const [startHour, startMinute] = start.trim().split(':').map(String);
            const [endHour, endMinute] = end.trim().split(':').map(String);
            const currentDate = new Date();
            const currentDay = currentDate.getDay();
            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            let dayIndex = daysOfWeek.indexOf(day);

            const daysToAdd = dayIndex - currentDay;
            console.log("daysToAdd: ", daysToAdd);
            const date = new Date(currentDate);
            date.setDate(date.getDate() + daysToAdd);

            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const dayOfMonth = date.getDate().toString().padStart(2, '0');

            // Format time to 'HH:mm'
            const startTime = `${year}-${month}-${dayOfMonth} ${startHour}:${startMinute}`;
            const endTime = `${year}-${month}-${dayOfMonth} ${endHour}:${endMinute}`;

            return [startTime, endTime];
        },

        async getInstructorScheduleStatus(){
            const instructor_name = this.instructorName;
            try {
                const response = await axios.get(`http://localhost:3000/instructorschedules/${instructor_name}/approved_schedule`);
                this.isApproved = response.data;
                console.log("Approved or not:", this.isApproved);
            } 
            catch (error) {
                console.error(error.message);
            }
        },

        async deleteSchedule(){
            //console.log("delete schedule");
            const instructor_name = this.instructorName;
            try {
                const response = await axios.delete(`http://localhost:3000/instructorschedules/${instructor_name}/deleteSchedule`);
                this.events = [];
                console.log("deleteSchedule:", response.data);
                this.getInstructorScheduleStatus();
            } 
            catch (error) {
                console.error(error.message);
            }
        }

    }
  }
</script> -->
<script>
import { getSymptomLogs, saveSymptomLog } from "@/services/symptomService"; // Adjust the import path as necessary
import { logMood, getWeeklyMood } from "@/services/moodService"; // Adjust the import path as necessary
import { getMedications } from "@/services/medicationService"; // Adjust the import path as necessary
export default {
  data() {
    return {
        isSaveDisabled: true, // Default to true
        infoCards : [
            { icon: "mdi-help-circle-outline", text: "What is HIV?", link: "https://www.cdc.gov/hiv/about/index.html" },
            { icon: "mdi-book-open-page-variant", text: "HIV Research", link: "https://www.niaid.nih.gov/research/hivaids-clinical-trials-networks" },
            { icon: "mdi-account-group-outline", text: "Support Groups", link: "https://www.healthywomen.org/condition/hiv-aids-support-group-finder" },
        ],
        moodDialog: false,
        moodData: {
            date: "", // Prefilled with today's date
            mood: null, // Selected mood
            diary: "", // Diary entry
        },
        moodOptions: [
            { label: "VeryHappy", icon: "mdi-emoticon-outline", color: "#01C674", value: "1" },
            { label: "Happy", icon: "mdi-emoticon-happy-outline", color: "#8AB757", value: "2" },
            { label: "Neutral", icon: "mdi-emoticon-neutral-outline", color: "yellow", value: "3" },
            { label: "Sad", icon: "mdi-emoticon-sad-outline", color: "orange", value: "4" },
            { label: "VerySad", icon: "mdi-emoticon-cry-outline", color: "red", value: "5" },
            { label: "Angry", icon: "mdi-emoticon-angry-outline", color: "#DA3B49", value: "6" },
        ],
        // week : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        moodEntries : [
            { icon: "mdi-emoticon-happy-outline", color: "#8AB757", hasDiary: true, date: "Monday, 3/27", mood: "happy", diary: "Had a great day!" },
            { icon: "mdi-emoticon-sad-outline", color: "orange", hasDiary: true, date: "Tuesday, 3/28", mood: "sad", diary: "Feeling a bit down today." },
            { icon: "mdi-emoticon-cry-outline", color: "red", hasDiary: true },
            { icon: "mdi-emoticon-cry-outline", color: "red", hasDiary: true },
            { icon: "mdi-emoticon-cry-outline", color: "red", hasDiary: true },
            { icon: "mdi-plus-circle-outline", hasDiary: false },
            { icon: "mdi-plus-circle-outline", hasDiary: false },
        ],
        weeklyMood: [],
        feelingDialog: false,
        feelingData: {
            date: "",
            notes: "",
        },
        recommendationDialog: false,
        recommendationMessage: "",
        lastFiveDates: this.getLastFiveDates(), 
        week: this.getLastSevenDays(),
        symptomsDialog: false,
        symptomsData: {
            date: this.formatDate(new Date()), // Autofill today's date
            selectedSymptoms: [], // Selected symptoms
        },
        symptomsList: [
            "Fever",
            "Cough",
            "Fatigue",
            "Headache",
            "Sore throat",
            "Shortness of breath",
            "Chills",
            "Rash",
            "Night sweats",
            "Muscle aches",
            "Swollen lymph nodes",
            "Mouth ulcers",
            "Nausea",
        ],
        userId: localStorage.getItem("userId"),
        userName: localStorage.getItem("userName"),
        savedSymptoms: {},
        // Store fetched symptoms
        medications: [],
        selectedMedications: [],
        editDialog: false,
        editMedication: {
            name: "",
            dosage: "",
            quantity: "",
            timeOfDay: "",
        },
        editIndex: null,
    };
  },
  computed: {
    isSaveDisabled() {
      const today = new Date();
      const currentDate = today.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
      return this.moodData.date !== currentDate; // Disable if the date doesn't match today's date
    },
  },
  async mounted() {
      console.log('Mounted hook called'); 
        this.userId = localStorage.getItem("userId"); 
        this.userName = localStorage.getItem("userName"); 
        console.log("in mounted userid:", localStorage.getItem("userId")); // Get user ID from token
        console.log("name:", localStorage.getItem("userName")); 
        if (this.userId) {
          await this.fetchMedications();
          await this.fetchSymptoms(this.userId); 
          await this.fetchWeeklyMood(); // Pass userId to fetchSymptoms
        } else {
          console.error("User ID is not available in localStorage.");
        }
        
        // Fetch symptoms when the component is mounted
    },
    
  methods: {
    navigateTo(link) {
      window.open(link, "_blank"); // Open the link in a new tab
    },
    getDoseSummary(dose) {
      if (!dose) return ""; // Handle empty or undefined dose
      const periodIndex = dose.indexOf(".");
      return periodIndex !== -1 ? dose.substring(0, periodIndex + 1) : dose;
    },
    getLastSevenDays() {
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i); // Subtract i days from today
    days.push(
      date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "2-digit",
        day: "2-digit",
      })
    );
  }

  return days;
},
    getMoodIcon(mood) {
      const moodOption = this.moodOptions.find((option) => option.value === mood);
      return moodOption ? moodOption.icon : "mdi-emoticon-neutral-outline";
    },
    getMoodColor(mood) {
      const moodOption = this.moodOptions.find((option) => option.value === mood);
      return moodOption ? moodOption.color : "grey";
    },
    selectMood(mood) {
      this.moodData.mood = mood; // Set the selected mood
    },
    formatDate2(date) {
      const options = { weekday: "short", month: "2-digit", day: "2-digit" };
      return date.toLocaleDateString("en-US", options); // Format: "Mon, 04/03"
    },
    openMoodDialog(day) {
  const today = new Date();
  const formattedToday = today.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  this.moodData = {
    date: day || formattedToday, // Set to today's date in MM/DD/YYYY format
    mood: null, // Reset mood
    diary: "", // Reset diary entry
  };

  // Enable the Save button only if the date is today's date
  this.isSaveDisabled = this.moodData.date !== formattedToday;

  this.moodDialog = true;
},
    openMoodDialogWithData(entry) {
      console.log("Opening mood dialog with data:", entry.formattedDate);
      // Use the exact date from the mood entry without reformatting
      this.moodData = {
        date: entry.formattedDate,// Use the formatted date from the mood entry
        mood: entry.mood, // Highlight the mood
        diaryEntry: entry.diaryEntry || "", // Prefill the diary entry or set to an empty string if not available
      };

      this.moodDialog = true; // Open the dialog
    },
    closeMoodDialog() {
      this.moodDialog = false;
    },
    async saveMoodEntry() {
      try {
        const currentYear = new Date().getFullYear(); // Get the current year
        // Prepare the mood data to send to the backend
        const moodData = {
          userId: this.userId, // User ID from localStorage
          date: new Date(this.moodData.date).setFullYear(currentYear), // Date of the mood entry
          mood: this.moodData.mood, // Selected mood
          diaryEntry: this.moodData.diaryEntry, // Diary entry
        };

        // Call the logMood API to save the mood entry
        const response = await logMood(moodData);
        console.log("Mood logged successfully:", response);

        // Close the mood dialog
        this.closeMoodDialog();

        // Refresh the weekly mood data to reflect the new entry
        await this.fetchWeeklyMood();
      } catch (error) {
        console.error("Error logging mood:", error.message);
      }
},

    async fetchWeeklyMood() {
  try {
    const response = await getWeeklyMood(this.userId);
    console.log("Weekly mood data:", response);

    // Get the last 7 days (including today) in MM/DD format
    const lastSevenDays = this.getLastSevenDays().map((date) =>
      date.substring(5, 10).replace("-", "/")
    );

    // Initialize an empty array with 7 slots (one for each day of the week)
    const alignedMoodData = Array(7).fill(null);

    if (response && Array.isArray(response)) {
      response.forEach((entry) => {
        // Extract MM/DD from entry.date
        const entryDate = new Date(entry.date).toISOString().substring(5, 10).replace("-", "/");

        // Find the index of the entry date in the lastSevenDays array
        const dayIndex = lastSevenDays.findIndex((day) => day === entryDate);
        // Find the corresponding mood option
        const moodOption = this.moodOptions.find((option) => option.label === entry.mood);

        if (dayIndex !== -1) {
          // Map the mood entry to the correct day in the week array
          alignedMoodData[dayIndex] = {
            ...entry,
            icon: moodOption ? moodOption.icon : "mdi-emoticon-neutral-outline", // Default icon if no match
            color: moodOption ? moodOption.color : "grey", // Default color if no match
            formattedDate: entryDate, // Ensure the formatted date matches the header
          };
        }
      });

      this.weeklyMood = alignedMoodData;
    } else {
      console.warn("No mood logs found in the response.");
      this.weeklyMood = Array(7).fill(null); // Ensure the array has 7 slots
    }
  } catch (error) {
    console.error("Error fetching weekly mood data:", error.message);
  }
},
    async fetchMedications() {
      try {
        console.log("Fetching medications for user ID:", this.userId);
        const response = await getMedications(this.userId);
        console.log("Fetched medications:", response);
        this.medications = response; // Store the medications in the component state
      } catch (error) {
        console.error("Error fetching medications:", error.message);
      }
    },
    showRecommendationPopup(message) {
      this.recommendationMessage = message;
      this.recommendationDialog = true;
    },
    getLastFiveDates() {
      const dates = [];
      const today = new Date();
      let i = 0;
      while (dates.length <= 7) {
        const date = new Date(today);
        date.setDate(today.getDate() - i); // Subtract i days from today
        dates.push(this.formatDate(date));
        i++;
      }
      return dates;
    },
    formatDate(date) {
      const options = { weekday: "long", month: "numeric", day: "numeric" };
      return date.toLocaleDateString("en-US", options); // Format: "Monday, 04/08"
    },
    openSymptomsDialogForNewDate() {
      this.symptomsData = {
        date: this.formatDate(new Date()), // Autofill today's date
        selectedSymptoms: [], // Reset symptoms
      };
      this.symptomsDialog = true;
    },
    openSymptomsDialogForDate(date) {
      // Load saved symptoms for the selected date, or initialize empty data
      this.symptomsData.date = date;
      this.symptomsData.selectedSymptoms = this.savedSymptoms[date] || [];
      this.symptomsDialog = true; 
    },
    closeSymptomsDialog() {
      this.symptomsDialog = false; // Close the dialog
    },
    async fetchSymptoms() {
      console.log("Fetching symptoms for user ID:", this.userId);
      try {
        const logs = await getSymptomLogs(this.userId);
        console.log("Fetched logs:", logs);

        const lastFiveDates = this.getLastFiveDates();
        console.log("Last five dates:", lastFiveDates);

        this.savedSymptoms = logs.reduce((acc, log) => {
          console.log("log date:", log.date);
         

          if (lastFiveDates.includes(log.date)) {
            acc[log.date] = log.symptoms; // Only include logs from the past 5 days
          }
          console.log("acc", acc);
          return acc;
        }, {});
        
      } catch (error) {
        console.error('Error fetching symptoms:', error.message);
      }
    },
    async saveSymptoms() {
      console.log("symptomsData", this.symptomsData);
      if (!this.symptomsData.selectedSymptoms.length) {
        console.error("No symptoms selected.");
        return;
      }
      try {
        const logData = {
          userId: this.userId,
          date: this.symptomsData.date,
          symptoms: this.symptomsData.selectedSymptoms,
        };
        await saveSymptomLog(logData);
        this.savedSymptoms[this.symptomsData.date] = [...this.symptomsData.selectedSymptoms];
        console.log('Symptoms saved:', this.symptomsData);
        this.closeSymptomsDialog();
      } catch (error) {
        console.error('Error saving symptoms:', error.message);
      }
    },
    deleteMedication(index) {
      this.medications.splice(index, 1); // Remove the medication at the given index
    },
    openEditDialog(index) {
      this.editIndex = index;
      this.editMedication = { ...this.medications[index] }; // Prepopulate the form with medication details
      this.editDialog = true;
    },
    closeEditDialog() {
      this.editDialog = false;
      this.editMedication = { name: "", dosage: "", quantity: "", timeOfDay: "" };
    },
    saveMedication() {
      if (this.editIndex !== null) {
        this.medications[this.editIndex] = { ...this.editMedication }; // Save the updated medication details
      }
      this.closeEditDialog();
    },
  },
};
</script>

<style>
body, .v-container, .v-app-bar, .v-row, .v-col, .v-card, .v-btn, h1, h2, h3, h4, h5, h6, p, span, .text-body-2, .subtitle-1, .text-center, .header-cell, .info-text {
  font-family: 'Montserrat';
}
.card-red {
  background-color: #E8B7B1 !important;
  color: black !important; /* Ensure text is readable on a red background */
}
.delete-icon {
  cursor: pointer;
}
.edit-icon {
  cursor: pointer;
  margin-right: 8px;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.symptom-tracker-title {
  color: #D26E63; /* Change this to your desired color */
  font-weight: bold;
  align-self: center;
}
.edit-medication-title {
  color: #D26E63; /* Change this to your desired color */
  font-weight: bold;
  align-self: center;
}
.no-uppercase {
  text-transform: none !important;/* Prevents text from being displayed in all caps */
}

.mood-table {
  margin-top: 10px;
  border-collapse: collapse;
  outline: gray solid 1px;
  table-layout: fixed; /* Ensures equal column widths */
  border-radius: 8px; /* Adds rounded corners */
  overflow: hidden; 
}

.header-cell {
  background-color: #dba7a7;
  font-weight: bold;
  font-size: medium;
  padding: 10px;
  text-align: center;
  font-family: 'Montserrat';
  border-right: gray solid 1px;
  max-width: 10px;
}

.mood-cell {
    max-width: 10px;
  padding: 15px;
  text-align: center;
  border-right: gray solid 1px;
}

.mood-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;
  gap: 5px;
}

.mood-icon {
  margin-top: 10px;
  padding-top: 30px;
  margin-bottom: 20px;
  font-size: 40px;
}

.add-icon {
  border: 2px solid black;
  border-radius: 50%;
}

.diary-btn {
  font-size: 10px;
  text-decoration: underline !important;
  text-transform: none !important;
}
.info-section {
  max-width: 900px;
  margin: auto;
}

.info-card {
  background-color: #dba7a7 !important;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  margin-right: 35px;
  margin-left: 35px;
  margin-bottom: 35px;
}

.info-icon {
  color: black;
}

.info-text {
  font-size: 16px;
  font-weight: bold;
}
</style>