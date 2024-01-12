
const multer = require("multer");
const path = require("path");
let fileCounter = 1;

const csvFilter = (req, file, cb) => {
  if (file.mimetype.includes("csv")) {
    cb(null, true);//cb: callback , null: there is no error.
  } else {
    cb(new Error("Please upload only csv file."), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));//creates the path to the "uploads" directory located in the parent directory of the module.
  },                                                /*  __dirname: The current directory of the module.
                                                        "..": Move up to the parent directory.(directory: file)
                                                        "uploads": Move into the "uploads" directory. */

  filename: (req, file, cb) => {
    const fileId = fileCounter++;
    const filename = `${fileId}-${file.originalname}`;

    req.uploadedFileId = fileId;
    req.uploadedFilename = filename;

    cb(null, filename);
  },
});

const uploading_CSVFile = multer({ storage: storage, fileFilter: csvFilter });

module.exports = uploading_CSVFile;
//handle file upload