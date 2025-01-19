import Dexie from "dexie";

// Initialize the database
const db = new Dexie("RefuelDatabase");

// Define the schema
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
    createdAt
  `,
});

// Insert data with debugging
export const insertData = async (formData) => {
  try {
    console.log("Attempting to insert data:", formData);

    // Validation: Check required fields
    if (!formData.ticket || !formData.flight || !formData.uplift) {
      throw new Error("Missing required fields: ticket, flight, or uplift");
    }

    // Add timestamp and insert into the database
    await db.refuelData.add({
      ...formData,
      createdAt: new Date().toISOString(),
    });

    console.log("Data inserted successfully:", formData);
    return { success: true };
  } catch (error) {
    console.error("Error inserting data:", error.message || error);
    return { success: false, error: error.message };
  }
};

// Fetch all records with optional sorting and logging
export const fetchData = async (limit = 100, order = "desc") => {
  try {
    console.log(`Fetching data with limit: ${limit}, order: ${order}`);

    const query =
      order === "asc"
        ? db.refuelData.orderBy("createdAt").limit(limit).toArray()
        : db.refuelData.orderBy("createdAt").reverse().limit(limit).toArray();

    const data = await query;
    console.log("Fetched data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error.message || error);
    return [];
  }
};

// Fetch a specific record by ID with debugging
export const fetchRecordById = async (id) => {
  try {
    console.log(`Fetching record with ID: ${id}`);
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

// Delete a record with debugging
export const deleteRecord = async (id) => {
  try {
    console.log(`Attempting to delete record with ID: ${id}`);
    await db.refuelData.delete(id);
    console.log(`Record with ID ${id} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting record with ID ${id}:`, error.message || error);
  }
};

// Clear all records with debugging
export const clearData = async () => {
  try {
    console.log("Clearing all records...");
    await db.refuelData.clear();
    console.log("All records cleared successfully");
  } catch (error) {
    console.error("Error clearing records:", error.message || error);
  }
};

// Export data as JSON file
export const exportData = async () => {
  try {
    console.log("Exporting data...");
    const data = await fetchData();
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "refuelDataBackup.json";
    link.click();
    console.log("Data exported successfully");
  } catch (error) {
    console.error("Error exporting data:", error.message || error);
  }
};

// Import data from JSON
export const importData = async (jsonData) => {
  try {
    console.log("Importing data...");
    const data = JSON.parse(jsonData);
    await db.refuelData.bulkAdd(data);
    console.log("Data imported successfully:", data);
  } catch (error) {
    console.error("Error importing data:", error.message || error);
  }
};

// Utility: Log all data to console
export const logAllData = async () => {
  try {
    const data = await fetchData();
    console.table(data);
  } catch (error) {
    console.error("Error logging all data:", error.message || error);
  }
};

export default db;
