import Dexie from "dexie";

// Initialize the Dexie database
const db = new Dexie("RefuelDatabase");

// Define the latest database schema
db.version(1).stores({
  refuelData: `
    ++id,
    ticket,
    flight,
    destination,
    timeFinish,
    bay,
    registration,
    uplift,
    ticketNumber,
    airline,
    aircraftType,
    vehicle,
    meterStart,
    meterStop,
    pit,
    date,
    startFigure,
    dp,
    flow,
    operator,
    airport,
    created_at
  `,
});

// Ensure the database is ready
export const initDatabase = async () => {
  try {
    await db.open(); // Open the database connection
    console.log("Dexie.js Database initialized");
  } catch (error) {
    console.error("Failed to initialize Dexie.js Database:", error.message || error);
  }
};

// Insert a record into the `refuelData` table
export const insertData = async (formData) => {
  try {
    if (!formData || Object.keys(formData).length === 0) {
      throw new Error("Invalid data. Cannot insert empty form data.");
    }

    // Validate required fields
    const requiredFields = ["ticket", "flight", "destination", "timeFinish"];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    await db.refuelData.add({
      ...formData,
      created_at: new Date().toISOString(), // Automatically add a timestamp
    });
    console.log("Data inserted successfully:", formData);
  } catch (error) {
    console.error("Error inserting data:", error.message || error);
  }
};

// Fetch all records from the `refuelData` table
export const fetchData = async () => {
  try {
    const records = await db.refuelData.orderBy("created_at").toArray();
    console.log("Fetched records:", records);
    return records;
  } catch (error) {
    console.error("Error fetching data:", error.message || error);
    return [];
  }
};

// Fetch a specific record by ID
export const fetchRecordById = async (id) => {
  try {
    const record = await db.refuelData.get(id);
    if (!record) {
      console.warn(`No record found with ID: ${id}`);
      return null;
    }
    console.log("Fetched record:", record);
    return record;
  } catch (error) {
    console.error(`Error fetching record with ID ${id}:`, error.message || error);
    return null;
  }
};

// Update a record in the database by ID
export const updateRecord = async (id, updatedData) => {
  try {
    if (!id || !updatedData) {
      throw new Error("Invalid ID or updated data for update operation.");
    }
    await db.refuelData.update(id, updatedData);
    console.log(`Record with ID ${id} updated successfully:`, updatedData);
  } catch (error) {
    console.error(`Error updating record with ID ${id}:`, error.message || error);
  }
};

// Clear all records in the database
export const clearData = async () => {
  try {
    await db.refuelData.clear(); // Clear the table
    console.log("All data cleared successfully");
  } catch (error) {
    console.error("Error clearing data:", error.message || error);
  }
};

// Delete a specific record by ID
export const deleteRecord = async (id) => {
  try {
    if (!id) {
      throw new Error("Invalid ID for delete operation.");
    }
    await db.refuelData.delete(id);
    console.log(`Record with ID ${id} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting record with ID ${id}:`, error.message || error);
  }
};

// Generate a thumbnail from an image (as Base64)
export const generateThumbnail = async (imageBase64, width = 500, height = 500) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.onload = () => {
      try {
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        const thumbnail = canvas.toDataURL("image/jpeg"); // Convert to Base64
        resolve(thumbnail); // Return the thumbnail
      } catch (error) {
        console.error("Error generating thumbnail:", error);
        reject(error);
      }
    };

    img.onerror = (error) => {
      console.error("Error loading image for thumbnail:", error);
      reject(error);
    };

    img.src = imageBase64;
  });
};

// Utility: Log all stored data to the console
export const logAllData = async () => {
  const records = await fetchData();
  console.table(records); // Log data in table format for readability
};

export default db;
