const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('citizen', 'investigator', 'admin'),
        defaultValue: 'citizen'
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    badgeId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    profileImage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Cyber Crime Division'
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    kycStatus: {
        type: DataTypes.ENUM('pending', 'verified', 'rejected'),
        defaultValue: 'verified'
    },
    isTwoFactorEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    // New fields for Email/2FA OTP
    loginOtp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    loginOtpExpires: {
        type: DataTypes.DATE,
        allowNull: true
    },
    verificationToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    loginHistory: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    loginAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    lockoutUntil: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true,
    paranoid: true, // Enable soft deletes
    indexes: [
        { unique: true, fields: ['email'] },
        { fields: ['role'] },
        { fields: ['kycStatus'] }
    ],
    hooks: {
        beforeCreate: async (user) => {
            if (user.email) user.email = user.email.trim().toLowerCase();
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
            // Assign unique professional stylized avatar if none provided
            if (!user.profileImage) {
                user.profileImage = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
            }
        },
        beforeUpdate: async (user) => {
            if (user.email) user.email = user.email.trim().toLowerCase();
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

// Instance Method for password comparison
User.prototype.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;
