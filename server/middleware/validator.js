const validator = require('validator');

// Validation Result Middleware (Simplified Mock)
const validate = (req, res, next) => {
    // In this manual implementation, we actually run the rules directly in the specific middleware
    // So this is just a placeholder to keep the interface the same for now.
    next();
};

const registerValidationRules = () => {
    return (req, res, next) => {
        const errors = [];
        const { name, email, password } = req.body;

        if (!name || validator.isEmpty(name)) errors.push({ name: 'Name is required' });
        if (!email || !validator.isEmail(email)) errors.push({ email: 'Invalid email address' });
        if (!password || !validator.isLength(password, { min: 1 })) errors.push({ password: 'Password required' });

        if (errors.length > 0) return res.status(422).json({ success: false, errors });
        next();
    };
};

const loginValidationRules = () => {
    return (req, res, next) => {
        const errors = [];
        const { email, password } = req.body;

        if (!email || !validator.isEmail(email)) errors.push({ email: 'Invalid email address' });
        if (!password || validator.isEmpty(password)) errors.push({ password: 'Password is required' });

        if (errors.length > 0) return res.status(422).json({ success: false, errors });
        next();
    };
};

const reportValidationRules = () => {
    return (req, res, next) => {
        const errors = [];
        const { title, description, category } = req.body;

        if (!title || validator.isEmpty(title)) errors.push({ title: 'Title is required' });
        if (!description || validator.isEmpty(description)) errors.push({ description: 'Description is required' });
        if (!category || validator.isEmpty(category)) errors.push({ category: 'Category is required' });

        if (errors.length > 0) return res.status(422).json({ success: false, errors });
        next();
    };
};

module.exports = {
    validate,
    registerValidationRules,
    loginValidationRules,
    reportValidationRules,
};
