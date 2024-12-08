import Dexie from "dexie";

// Initialize the database
const db = new Dexie("RefuelDatabase");

// Define the database schema
db.version(1).stores({
  refuelData: `
    ++id,
    flight,
    destination,
    time,
    bay,
    registration,
    uplift,
    ticket,
    created_at
  `,
});

// Ensure the database is ready
export const initDatabase = async () => {
  try {
    console.log("Dexie.js Database initialized");
  } catch (error) {
    console.error("Failed to initialize Dexie.js Database:", error);
  }
};

// Insert a record into the `refuelData` table
export const insertData = async (formData) => {
  try {
    await db.refuelData.add({
      flight: formData.flight,
      destination: formData.destination,
      time: formData.time,
      bay: formData.bay,
      registration: formData.registration,
      uplift: formData.uplift,
      ticket: formData.ticket,
      created_at: new Date().toISOString(), // Add timestamp
    });
    console.log("Data inserted successfully:", formData);
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};

export const fetchData = async () => {
  try {
    const records = await db.refuelData.orderBy("created_at").toArray();
    console.log("Fetched records:", records); // Debugging output
    return records; // Ensure this returns an array
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Return an empty array on error
  }
};


export default db;
