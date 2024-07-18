const asyncHandler = require('express-async-handler');
const Labour = require('../models/Labour');

// Add a new labour
const addLabour = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const labour = new Labour({ owner: req.user._id, name });
    const createdLabour = await labour.save();
    res.status(201).json(createdLabour);
});

// Get all labours for the logged-in user
const getLabours = asyncHandler(async (req, res) => {
    const labours = await Labour.find({ owner: req.user._id });
    res.json(labours);
});

// Get a labour by ID
const getLabourById = asyncHandler(async (req, res) => {
    const labour = await Labour.findById(req.params.id);
    if (labour) {
        res.json(labour);
    } else {
        res.status(404).json({ message: 'Labour not found' });
    }
});

// Update a labour
const updateLabour = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const labour = await Labour.findById(req.params.id);
    if (labour) {
        labour.name = name || labour.name;
        const updatedLabour = await labour.save();
        res.json(updatedLabour);
    } else {
        res.status(404).json({ message: 'Labour not found' });
    }
});

// Delete a labour by ID

const deleteLabourById = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    // Find the labour by ID
    const labour = await Labour.findById(id);
  
    // Check if labour exists
    if (!labour) {
      return res.status(404).json({ message: 'Labour not found' });
    }
  
    // If labour exists, remove it
    await labour.deleteOne(); // Use deleteOne() to remove the document from MongoDB
  
    // Respond with a success message
    res.json({ message: 'Labour deleted successfully' });
  });

// Add a daily report for a labour
const addDailyReport = asyncHandler(async (req, res) => {
    const { labourId } = req.params;
    const { date,numberofLabours, workHours, rate, description, dailyCharge } = req.body;

    const labour = await Labour.findById(labourId);

    if (!labour) {
        return res.status(404).json({ message: 'Labour not found' });
    }

    const newDailyReport = {
        date,
        numberofLabours,
        workHours,
        rate,
        description,
        dailyCharge
    };

    labour.dailyReports.push(newDailyReport);
    await labour.save();

    res.status(201).json(labour);
});
const createReceipt = async (req, res) => {
    const { id } = req.params;
    const { labourName, numberofLabours, totalPay, date, due } = req.body;
  
    try {
      const labour = await Labour.findById(id);
      if (!labour) {
        return res.status(404).json({ message: 'Labour not found' });
      }
  
      const receipt = {
        labourName,
        numberofLabours,
        totalPay,
        date,
        due
      };
  
      labour.receipts.push(receipt);
      await labour.save();
      res.status(201).json(receipt);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create receipt', error });
    }
  };
  const deleteDailyReport = asyncHandler(async (req, res) => {
    const { labourId, reportId } = req.params;
  
    try {
      const labour = await Labour.findById(labourId);
      if (!labour) {
        return res.status(404).json({ message: 'Labour not found' });
      }
  
      // Filter out the daily report to delete
      labour.dailyReports = labour.dailyReports.filter(report => report._id.toString() !== reportId);
      await labour.save();
  
      res.json({ message: 'Daily report deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete daily report', error });
    }
  });
  
  // Edit a daily report by ID
  const editDailyReport = asyncHandler(async (req, res) => {
    const { labourId, reportId } = req.params;
    const { date, numberofLabours, workHours, rate, description, dailyCharge } = req.body;
  
    try {
      const labour = await Labour.findById(labourId);
      if (!labour) {
        return res.status(404).json({ message: 'Labour not found' });
      }
  
      // Find the daily report to edit
      const report = labour.dailyReports.find(report => report._id.toString() === reportId);
      if (!report) {
        return res.status(404).json({ message: 'Daily report not found' });
      }
  
      // Update daily report fields
      report.date = date;
      report.numberofLabours = numberofLabours;
      report.workHours = workHours;
      report.rate = rate;
      report.description = description;
      report.dailyCharge = dailyCharge;
  
      await labour.save();
  
      res.json({ message: 'Daily report updated successfully', report });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update daily report', error });
    }
  });
  
module.exports = {
    addLabour,
    getLabours,
    getLabourById,
    updateLabour,
    deleteLabourById,
    addDailyReport,
    createReceipt,
    deleteDailyReport,
    editDailyReport,
};
