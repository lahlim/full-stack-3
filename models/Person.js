const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

mongoose.set("useFindAndModify", false);
const url = process.env.MONGODB_URI;

console.log("Connecting to MongoDB");
const options = {
  useNewUrlParser: true,
  dbName: "testDB"
};

mongoose.connect(url, options).then(
  resp => {
    console.log("Connected to MongoDB");
  },
  err => console.log("Error in connection:", err)
);

const personSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, required: true },
  number: { type: String, minlength: 8, required: true }
});
personSchema.plugin(uniqueValidator);

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Person", personSchema);
