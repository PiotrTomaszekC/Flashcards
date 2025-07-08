import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Card from "./models/cardModel.js";
import Set from "./models/setModel.js";
import User from "./models/userModel.js";
import users from "./data/users.js";
import flashcards from "./data/flashcards.js";
import sets from "./data/sets.js";
import colors from "colors";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Card.deleteMany();
    await Set.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const user = createdUsers[0]._id;
    //first user for simplicity

    const sampleSets = sets.map((set) => ({
      ...set,
      user,
    }));

    const createdSets = await Set.insertMany(sampleSets);

    const sampleCards = flashcards.map((flashcard, index) => {
      return {
        ...flashcard,
        user,
        set: createdSets[index % createdSets.length]._id,
      };
    });

    await Card.insertMany(sampleCards);
    console.log("Data imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Card.deleteMany();
    await Set.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
