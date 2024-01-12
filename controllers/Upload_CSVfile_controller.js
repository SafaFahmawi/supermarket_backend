const UploadedFile = require("../models/file_model");

module.exports.uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("Please upload a CSV file!");
    }

    const { uploadedFilename } = req;
    // Create a File entry in the database with the desired filename
    const fileEntry = await UploadedFile.create({ filename: uploadedFilename })
      .catch((error) => {
        res.status(500).send({ message: "Error saving filename to database:", error: error.message });
        console.error('Error saving filename to database:', error);
      });

    // Save the file ID in the response
    res.status(200).send({
      message: `Uploaded the CSV file successfully: ${uploadedFilename}`,
      fileId: fileEntry.fileId
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to import data into the database!", error: error.message });
  }
};
