const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const Upload = require('./models/User')
const fs = require("fs");

app.use(cors());
app.options("*", cors());
// Database connection
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose
  .connect('mongodb://127.0.0.1:27017/HACKDB')
  .then(() => console.log("connected to the Database"))
  .catch((err) => console.log(err));

app.use(bodyParser.json());

// default options
app.use(fileUpload());

app.post('/upload', function(req, res) {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/public/' + sampleFile.name;
  
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    // res.json('File uploaded!');
    console.log(req.body.name);
    const newUpload = new Upload({
      name: req.body.name, // Include the name field
      file: {
        data: fs.readFileSync(uploadPath),
        contentType: `${sampleFile.mimetype}`,
      },
    });
    console.log(newUpload);
    newUpload.save()
        .then((savedUpload) => {
          console.log("Upload saved successfully:");
          res.json("File uploaded and data saved!");
        })
        .catch((error) => {
          console.error("Error saving upload:", error);
          res.status(500).send("Error saving upload");
        });
  });
});

// Route to get the uploaded files
app.get('/upload', async (req, res) => {
  try {
    // Fetch all uploaded files from the database

    const uploads = await Upload.find(); // Assuming your model has 'name' and 'path' fields

    // Send the list of uploaded files as a response
    res.json(uploads);
  } catch (error) {
    console.error("Error fetching uploads:", error);
    res.status(500).send("Error fetching uploads");
  }
});

app.get("/upload/:id", async (req, res) => {
  try {
    // Fetch the uploaded file from the database based on the provided ID
    const upload = await Upload.findById(req.params.id);

    // If no file is found with the provided ID, return a 404 status
    if (!upload) {
      return res.status(404).json({ error: "File not found" });
    }

    // If file is found, send it as a response
    res.json(upload);
  } catch (error) {
    console.error("Error finding upload:", error);
    res.status(500).send("Error finding upload");
  }
});


// Simple Route
app.get("/", (req, res) => res.json('Hello World'));

app.listen(3000, () => console.log("Server is running port 3000"));