const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://full-stack:${password}@cluster0-blxze.mongodb.net/phonebook?retryWrites=true`;
const options = {
  useNewUrlParser: true,
  dbName: "testDB"
};
mongoose
  .connect(url, options)
  .then(() => {}, err => console.log("Error in connection:", err));

const personSchema = new mongoose.Schema({
  name: String,
  number: Number
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
});

const save = () => {
  person.save().then(response => {
    if (!person.name || !person.number) {
      console.log("syötä nimi ja numero");
      process.exit(1);
    }
    console.log(`Lisätään ${person.name} numero ${person.number} luetteloon.`);
    mongoose.connection.close();
  });
};
save();
const print = () => {
  Person.find({}).then(result => {
    console.log("Luettelo:");
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
    process.exit(0);
  });
};
if (process.argv.length == 3) print();
