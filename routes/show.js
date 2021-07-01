const express = require('express');
const File = require('../models/File');

const router = express.Router();

router.get('/:uuid', async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });

    if (!file) {
      return res.render('download', { error: 'Link has been expired' });
    }
    // Add file show count
    file.show += 1;
    await file.save();

    const downloadLink = `${req.protocol}://${req.get('host')}/files/download/${file.uuid}`;
    return res.render('download', {
      fileName: file.filename,
      fileSize: file.size,
      shows: file.show,
      downloaded: file.downloaded,
      downloadLink,
    });
  } catch (error) {
    return res.render('download', { error: 'Something went wrong!' });
  }
});

module.exports = router;
