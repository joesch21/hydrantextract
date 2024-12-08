import Dexie from "dexie";

// Initialize the database
const db = new Dexie("RefuelDatabase");

// Define the schema
db.version(1).stores({
  refuelData:
    "++id, ticket, flight, destination, time, bay, registration, uplift, created_at",
});

// Function to insert data
export const insertData = async (formData) => {
  await db.refuelData.add({
    ...formData,
    created_at: new Date().toISOString(),
  });
  console.log("Data inserted successfully");
};

// Function to fetch all data
export const fetchData = async () => {
  return await db.refuelData.orderBy("created_at").toArray();
};

export default db;
