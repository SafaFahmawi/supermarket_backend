const path = require('path');
const UploadedFile = require('../models/file_model');
const { defineDynamicProductModel } = require('../models/product_model');
const sequelize = require('../config/DB');
const { readCSVFile, mapProducts, transformData, convertToCSV } = require("../middleware/read_CSVfile");

module.exports.downloadCSVFile = async (req, res) => {
  const fileId = req.params.fileId;

  try {
    // Retrieve the filename based on the file ID
    const fileEntry = await UploadedFile.findByPk(fileId);

    if (!fileEntry) {
      return res.status(404).send('File not found');
    }

    const filename = fileEntry.filename;
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    // Call the readCSVFile function to read the CSV file
    const { csvData, columnNames } = await readCSVFile(filePath);

    // Delete the existing Product table
    await sequelize.getQueryInterface().dropTable('Products');

    // Use the dynamic product model definition
    const { Product } = defineDynamicProductModel(columnNames);

    // Sync the dynamic model with the database
    await Product.sync();

    // Map dynamic columns to the actual Product model
    const mappedProducts = mapProducts(columnNames, csvData);

    // Insert new products into the database
    await Product.bulkCreate(mappedProducts);

    // Retrieve the dynamic model and column names
    const { Product: DownloadedProduct, columnNames: downloadedColumnNames } = defineDynamicProductModel(columnNames);

    // Fetch all data from the dynamically created Product table
    const products = await DownloadedProduct.findAll();

    // Transform the data if needed
    const transformedData = transformData(downloadedColumnNames, products);

    // Convert the data to CSV format
    const csvString = convertToCSV(transformedData);

    // Set response headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Send the CSV data as the response
    res.status(200).send(csvString);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to download and store data!', error: error.message });
  }
};