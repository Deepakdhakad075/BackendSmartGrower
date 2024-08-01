const express = require('express');
const { 
    addLabour, 
    getLabours, 
    getLabourById, 
    updateLabour, 
    deleteLabourById, 
    addDailyReport,
    createReceipt,
    deleteDailyReport,
    editDailyReport,
    updateDeposit,
    createDeposit
} = require('../controllers/labourController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, addLabour);
router.get('/', protect, getLabours);
router.get('/:id', protect, getLabourById);
router.put('/:id', protect, updateLabour);

// Example of delete route implementation
router.delete('/:id', protect, deleteLabourById);

// New route for adding daily reports
router.post('/:labourId/dailyReports', protect, addDailyReport);
router.post('/labours/:id/receipts', createReceipt);
router.delete('/:labourId/dailyReports/:reportId', protect, deleteDailyReport);
router.put('/:labourId/dailyReports/:reportId', protect, editDailyReport);

// Route to create a deposit entry
router.post('/labours/:id/paid', createDeposit);

// Route to update a deposit entry
router.put('/labours/:labourId/paid/:depositId', updateDeposit);
module.exports = router;
