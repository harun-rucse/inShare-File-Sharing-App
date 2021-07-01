/*eslint-disable */
const schedule = require('node-schedule');
const fs = require('fs');
const File = require('../models/File');

const deleteFiles = async () => {
  const files = await File.find({
    createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });
  console.log(files);
  if (files.length) {
    for (const file of files) {
      try {
        fs.unlinkSync(file.path);
        await file.remove();
        console.log(`successfully deleted ${file.filename}`);
      } catch (err) {
        console.log(`error while deleting file ${err} `);
      }
    }
  }
  console.log('Job done!');
};

module.exports = () => {
  schedule.scheduleJob({ hour: 2, minute: 0 }, deleteFiles);
};
