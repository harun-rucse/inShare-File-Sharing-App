const express = require('express');
const { v4: uuidv4 } = require('uuid');
const File = require('../models/File');
const { uploadFile } = require('../middlewares/fileUpload');
const sendEmail = require('../utils/email');
const emailTemplate = require('../utils/emailTemplate');

const router = express.Router();

router.post('/', uploadFile, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'All Field are required' });
  }

  const file = new File({
    filename: req.file.filename,
    uuid: uuidv4(),
    path: req.file.path,
    size: req.file.size,
  });

  const response = await file.save();
  const filePath = `${req.protocol}://${req.get('host')}/files/${response.uuid}`;

  return res.status(201).json({ file: filePath });
});

router.post('/send', async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(400).send({ error: 'All Field are required' });
  }

  try {
    const file = await File.findOne({ uuid });
    if (file.sender) {
      return res.status(400).send({ error: 'Email already send' });
    }

    file.sender = emailFrom;
    file.receiver = emailTo;
    await file.save();

    try {
      await sendEmail({
        from: emailFrom,
        to: emailTo,
        subject: 'inShare file sharing',
        text: `${emailFrom} share a file with you`,
        html: emailTemplate({
          emailFrom,
          downloadLink: `${req.protocol}://${req.get('host')}/files/${file.uuid}`,
          // eslint-disable-next-line radix
          size: `${parseInt(file.size / 1000)} KB`,
          expires: '24 hours',
        }),
      });

      return res.status(200).json({ status: 'success', message: 'Email send successfully' });
    } catch (err) {
      file.sender = undefined;
      file.receiver = undefined;
      await file.save();
      return res.status(400).send({ error: 'Email send fail' });
    }
  } catch (error) {
    return res.status(400).send({ error: 'Something went wrong' });
  }
});

module.exports = router;
