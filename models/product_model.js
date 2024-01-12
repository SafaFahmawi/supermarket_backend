const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/DB');
const UploadedFile = require('../models/file_model');

function defineDynamicProductModel(columnNames) {
    // Define a dynamic model based on the mapped column names
    const modelDefinition = {};
    columnNames.forEach((originalName) => {
        const desiredName = mapColumnName(originalName);
        // Check if the desired name is non-empty before adding to the model definition
        if (desiredName.trim() !== '') {
            modelDefinition[desiredName] = DataTypes.STRING; // Adjust data type as needed
        }
    });

    // Define the dynamic model with a standardized primary key
    const Product = sequelize.define('Product', modelDefinition, {
        primaryKey: 'id',
        fileId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
    });

    // Define the foreign key relationship
    Product.belongsTo(UploadedFile, { foreignKey: 'fileId', onDelete: 'CASCADE', targetKey: 'fileId' });
    UploadedFile.hasMany(Product, { foreignKey: 'fileId', onDelete: 'CASCADE' });
    
    // Create a mapping between original and desired column names
    const mappedColumnNames = {};
    columnNames.forEach((originalName) => {
        const desiredName = mapColumnName(originalName);
        mappedColumnNames[originalName] = desiredName;
    });

    return { Product, columnNames };
}

// Function to map original column names to desired names
function mapColumnName(originalName) {
    //Convert original names to lowercase with underscores
    return originalName.toLowerCase().replace(/\s+/g, '_');
}

module.exports = { defineDynamicProductModel, mapColumnName };