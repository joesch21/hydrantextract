import Dexie from "dexie";

// Initialize the database
const db = new Dexie("RefuelDatabase");

// Define the schema
db.version(1).stores({
  refuelData:
    "++id, ticket, flight, destination, timeFinish, bay, registration, uplift, createdAt",
});

// Function to insert data
export const insertData = async (formData) => {
  try {
    if (!formData.ticket || !formData.flight || !formData.uplift) {
      console.error("Missing required fields: ticket, flight, or uplift");
      return;
    }
    await db.refuelData.add({
      ...formData,
      createdAt: new Date().toISOString(),
    });
    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};

// Function to fetch all data
export const fetchData = async (limit = 100) => {
  try {
    return await db.refuelData.orderBy("createdAt").limit(limit).toArray();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

// Function to delete a record
export const deleteRecord = async (id) => {
  try {
    await db.refuelData.delete(id);
    console.log(`Record with ID ${id} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting record with ID ${id}:`, error);
  }
};

// Function to clear all data
export const clearData = async () => {
  try {
    await db.refuelData.clear();
    console.log("All records cleared successfully");
  } catch (error) {
    console.error("Error clearing records:", error);
  }
};

export default db;
