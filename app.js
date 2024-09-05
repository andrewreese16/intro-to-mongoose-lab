const dotenv = require("dotenv");
const prompt = require("prompt-sync")();
dotenv.config();
const mongoose = require("mongoose");
const Crm = require("./models/model");

const connect = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
  await runQueries();
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
  process.exit();
};

const runQueries = async () => {
  console.log("Queries running.");
  let exit = false;

  while (!exit) {
    const choice = displayMenu();
    await handleUserChoice(choice);

    if (choice === "5") {
      exit = true;
    }
  }
};

connect();

function displayMenu() {
  console.log("Welcome to the CRM System");
  console.log("1. Create a customer");
  console.log("2. View all customers");
  console.log("3. Update a customer");
  console.log("4. Delete a customer");
  console.log("5. Exit");
  return prompt("Enter your choice(1-5): ");
}

async function handleUserChoice(choice) {
  switch (choice) {
    case "1":
      await handleUserCreate();
      break;
    case "2":
      await handleUserFind();
      break;
    case "3":
      await handleUserUpdate();
      break;
    case "4":
      await handleDelete();
      break;
    case "5":
      console.log("Exiting....");
      break;
    default:
      console.log("Invalid choice, please try again.");
  }
}

async function handleUserCreate() {
  try {
    const name = prompt("Enter customer name: ");
    const age = prompt("Enter customer age: ");

    const newCustomer = await Crm.create({
      name: name,
      age: age,
    });
    console.log("Customer created successfully:", newCustomer);
  } catch (error) {
    console.log("Error creating customer:", error);
  }
}

async function handleUserFind() {
  try {
    const customers = await Crm.find();

    if (customers.length === 0) {
      console.log("No customers found.");
      return;
    }

    console.log("Customer List:");
    customers.forEach((customer, index) => {
      console.log(
        `${index + 1}. ID: ${customer._id}, Name: ${customer.name}, Age: ${
          customer.age
        }`
      );
    });
  } catch (error) {
    console.log("Error finding customers:", error);
  }
}

async function handleUserUpdate() {
  try {
    const customers = await Crm.find();

    if (customers.length === 0) {
      console.log("No customers found.");
      return;
    }
    console.log("Customer List:");
    customers.forEach((customer, index) => {
      console.log(
        `${index + 1}. ID: ${customer._id}, Name: ${customer.name}, Age: ${
          customer.age
        }`
      );
    });
    const customerId = prompt("Enter the ID of the customer to update: ");

    const newName = prompt(
      "Enter the new name (leave blank to keep the same): "
    );
    const newAge = prompt("Enter the new age (leave blank to keep the same): ");

    const updateData = {};
    if (newName) updateData.name = newName;
    if (newAge) updateData.age = newAge;

    if (Object.keys(updateData).length === 0) {
      console.log("No updates made.");
      return;
    }

    const updatedCustomer = await Crm.findByIdAndUpdate(
      customerId,
      updateData,
      { new: true }
    );
    if (updatedCustomer) {
      console.log("Customer updated successfully", updatedCustomer);
    } else {
      console.log("Customer not found.");
    }
  } catch (error) {
    console.error("Error updating customer:", error);
  }
}

async function handleDelete() {
  try {
    const customers = await Crm.find();

    if (customers.length === 0) {
      console.log("No customers found.");
      return;
    }

    console.log("Customer List:");
    customers.forEach((customer, index) => {
      console.log(
        `${index + 1}. ID: ${customer._id}, Name: ${customer.name}, Age: ${
          customer.age
        }`
      );
    });

    const customerId = prompt("Enter the ID of the customer to delete: ");

    const confirmation = prompt(
      "Are you sure you want to delete this customer? (yes/no): "
    ).toLowerCase();
    if (confirmation !== "yes") {
      console.log("Deletion cancelled.");
      return;
    }

    const deletedCustomer = await Crm.findByIdAndDelete(customerId);

    if (deletedCustomer) {
      console.log("Customer deleted successfully:", deletedCustomer);
    } else {
      console.log("Customer not found.");
    }
  } catch (error) {
    console.error("Error deleting customer:", error);
  }
}
