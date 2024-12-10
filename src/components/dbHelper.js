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
    await db.open(); // Open the database connection
    console.log("Dexie.js Database initialized");
  } catch (error) {
    console.error("Failed to initialize Dexie.js Database:", error);
  }
};

// Insert a record into the `refuelData` table
export const insertData = async (formData) => {
  try {
    // Validate the input data
    if (!formData || Object.keys(formData).length === 0) {
      throw new Error("Invalid data. Cannot insert empty form data.");
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
    console.log("Fetched records:", records); // Debugging output
    return records; // Ensure this returns an array
  } catch (error) {
    console.error("Error fetching data:", error.message || error);
    return []; // Return an empty array on error
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

export default db;
