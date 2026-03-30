const Settings = require('../models/Settings');

exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json({ success: true, settings });
  } catch (error) { next(error); }
};

exports.updateSettings = async (req, res, next) => {
  try {
    if (req.file) req.body.logo = { url: `/uploads/${req.file.filename}`, publicId: req.file.filename };
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create(req.body);
    else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    res.json({ success: true, settings });
  } catch (error) { next(error); }
};
