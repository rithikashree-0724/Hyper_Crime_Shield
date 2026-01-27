const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Report = require('../models/Report');
const Investigation = require('../models/Investigation');

// Get assigned investigations (Investigator) or all (Admin)
router.get('/', auth, async (req, res) => {
    try {
        let options = {
            include: [{ model: Report, as: 'report' }]
        };

        if (req.user.role === 'investigator') {
            // Sequelize can't easily query JSON arrays with standard where
            // For SQLite/MySQL we might need raw queries or just filter in JS for now if data is small
            const allInvestigations = await Investigation.findAll(options);
            const filtered = allInvestigations.filter(inv =>
                inv.investigatorIds && inv.investigatorIds.includes(req.user.id)
            );
            return res.json(filtered);
        } else if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const investigations = await Investigation.findAll(options);
        res.json(investigations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Assign Investigator (Admin or self-claim)
router.post('/:reportId/assign', auth, async (req, res) => {
    try {
        const { investigatorId } = req.body;
        const targetId = investigatorId || req.user.id;

        let investigation = await Investigation.findOne({ where: { reportId: req.params.reportId } });

        if (!investigation) {
            investigation = await Investigation.create({
                reportId: req.params.reportId,
                investigatorIds: [targetId]
            });
        } else {
            let ids = investigation.investigatorIds || [];
            if (!ids.includes(targetId)) {
                ids.push(targetId);
                investigation.investigatorIds = ids;
                investigation.changed('investigatorIds', true);
                await investigation.save();
            }
        }

        // Update Report status
        await Report.update(
            { status: 'investigating' },
            { where: { id: req.params.reportId } }
        );

        res.json(investigation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add Note
router.post('/:id/note', auth, async (req, res) => {
    try {
        const investigation = await Investigation.findByPk(req.params.id);
        if (!investigation) return res.status(404).json({ message: 'Investigation not found' });

        let notes = investigation.notes || [];
        notes.push({
            content: req.body.content,
            authorId: req.user.id,
            date: new Date()
        });

        investigation.notes = notes;
        investigation.changed('notes', true);
        await investigation.save();

        res.json(investigation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add Task
router.post('/:id/task', auth, async (req, res) => {
    try {
        const investigation = await Investigation.findByPk(req.params.id);
        if (!investigation) return res.status(404).json({ message: 'Investigation not found' });

        let tasks = investigation.tasks || [];
        tasks.push({
            title: req.body.title,
            isCompleted: false,
            assignedTo: req.body.assignedTo || req.user.id
        });

        investigation.tasks = tasks;
        investigation.changed('tasks', true);
        await investigation.save();

        res.json(investigation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle Task Completion
router.patch('/:id/task/:index', auth, async (req, res) => {
    try {
        const investigation = await Investigation.findByPk(req.params.id);
        if (!investigation) return res.status(404).json({ message: 'Investigation not found' });

        let tasks = investigation.tasks || [];
        const index = parseInt(req.params.index);

        if (tasks[index]) {
            tasks[index].isCompleted = !tasks[index].isCompleted;
            investigation.tasks = tasks;
            investigation.changed('tasks', true);
            await investigation.save();
        }

        res.json(investigation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Set Final Outcome
router.post('/:id/outcome', auth, async (req, res) => {
    try {
        const investigation = await Investigation.findByPk(req.params.id);
        if (!investigation) return res.status(404).json({ message: 'Investigation not found' });

        investigation.outcome = req.body.outcome;
        investigation.status = 'closed';
        await investigation.save();

        // Update Report status as well
        await Report.update(
            { status: 'resolved' },
            { where: { id: investigation.reportId } }
        );

        res.json(investigation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
