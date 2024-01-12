const fs = require('fs');
const csv = require('csv-parser');
const { mapColumnName } = require('../models/product_model');

async function readCSVFile(filePath) {

    // Arrays to store data from the CSV file
    const csvData = [];
    let columnNames = [];

    // Read the CSV file and dynamically create product model and store data
    await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('error', (error) => reject(error))
            .on('data', (row) => {
                csvData.push(row);
                // Collect column names from the first row
                if (columnNames.length === 0) {
                    columnNames = Object.keys(row);
                }
            })
            .on('end', resolve);
    });

    console.log('Original Column Names:', columnNames);

    return { csvData, columnNames };
}

// Function to map CSV data to a format suitable for database insertion
function mapProducts(columnNames, csvData) {
    return csvData.map((row) => {
        const mappedProduct = {};
        // Map each column to its corresponding database column name
        columnNames.forEach((originalName) => {
            const desiredName = mapColumnName(originalName);
            mappedProduct[desiredName] = row[originalName];
        });
        return mappedProduct;
    });
}

// Function to transform data retrieved from the database
function transformData(downloadedColumnNames, products) {
    return products.map((product) => {
        const transformedProduct = {};
        // Map each column back to its original name
        downloadedColumnNames.forEach((originalName) => {
            const desiredName = mapColumnName(originalName);
            transformedProduct[originalName] = product[desiredName];
        });
        return transformedProduct;
    });
}

// Function to convert data to CSV format
function convertToCSV(data) {
    return [
        // Create the CSV header by joining keys of the first object
        Object.keys(data[0] || {}).join(','),
        // Create CSV rows by joining values of each object
        ...data.map((item) => Object.values(item).join(',')),
    ].join('\n');
}

module.exports = {
    readCSVFile,
    mapProducts,
    transformData,
    convertToCSV
};