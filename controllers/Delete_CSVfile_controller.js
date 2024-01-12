const UploadedFile = require("../models/file_model");
const sequelize = require('../config/DB');
const path = require('path');
const fs = require('fs');

module.exports.deleteCSVFile = async (req, res) => {
  const fileId = req.params.fileId;
  try {
    // Retrieve the filename based on the file ID
    const fileEntry = await UploadedFile.findByPk(fileId);

    if (!fileEntry) {
      return res.status(404).send('File not found');
    }

    const filename = fileEntry.filename;
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    // Delete the file
    await UploadedFile.destroy({ where: {fileId: fileId} });

    // Delete the existing Product table
    await sequelize.getQueryInterface().dropTable('Products');

    //Delete File from Uploads Directory
    fs.unlink(filePath, err => {
      if (err) {
        throw err;
      }
      else {
        console.log('File path:', filePath);
        console.log(`${filename} was deleted`);
      }
    });

    res.status(200).json({ message: 'CSV File and associated products deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



