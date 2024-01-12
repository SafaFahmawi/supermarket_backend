const router = require('express').Router();
const Upload_CSVfile_controller = require('../controllers/Upload_CSVfile_controller');
const uploading_CSVFile = require("../middleware/uploading_csv");
const download_csv_controller = require("../controllers/download_csv_Controller");
const Delete_CSVfile_controller = require("../controllers/Delete_CSVfile_controller");

router.post("/uploadCSV", uploading_CSVFile.single("csvFile"), (req, res) => {
   
  // Check for validation errors
  if (req.fileValidationError) {
    return res.status(400).send(req.fileValidationError.message);
  }

  // Continue with the rest of your file upload logic
  Upload_CSVfile_controller.uploadCSV(req, res);
});

router.delete('/deleteCSVfile/:fileId', Delete_CSVfile_controller.deleteCSVFile);
router.get("/downloadCSVFile/:fileId", download_csv_controller.downloadCSVFile);

module.exports = router;