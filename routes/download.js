const express = require('express');
const File = require('../models/File');

const router = express.Router();

router.get('/:uuid', async (req, res) => {
  const file = await File.findOne({ uuid: req.params.uuid });

  if (!file) {
    return res.render('download', { error: 'Link has been expired' });
  }

  // Add file downloaded count
  file.downloaded += 1;
  await file.save();

  const filePath = `${__dirname}/../${file.path}`;
  return res.download(filePath);
});

module.exports = router;
