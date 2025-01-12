const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const MongoUrl = 'mongodb://0.0.0.0:27017/Blixtra'

mongoose.connect(MongoUrl)
    .then(() => {
        console.log('Connected to MongoDB');
    });

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
    },
    password: {
        type: String,
        required: true,
        minlength: 8, // You can apply more validation for password criteria
    },
    aadhar: {
        type: String,
        required: true,
        length: 12, // 12-digit Aadhaar number
    },
    pan: {
        type: String,
        required: true,
        match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, // Match PAN Card format: XXXXX1234X
    },
    ration: {
        type: String,
        required: true,
        length: 10, // 10-digit Ration Card number
    },
    state: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other'],
    },
    age: {
        type: Number,
        required: true,
        min: 18, // Minimum age 18 for validation
    },
    caste: {
        type: String,
        required: true,
    },
    minority: {
        type: String,
        required: true,
        enum: ['Yes', 'No'],
    },
    differentlyAbled: {
        type: String,
        required: true,
        enum: ['Yes', 'No'],
    },
    maritalStatus: {
        type: String,
        required: true,
        enum: ['Single', 'Married', 'Divorced'],
    },
    disabilityPercentage: {
        type: Number,
        required: false,
        min: 0, // Disability percentage
        max: 100, // Max disability percentage
    },
    bpl: {
        type: String,
        required: true,
        enum: ['Yes', 'No'],
    },
    student: {
        type: String,
        required: true,
        enum: ['Yes', 'No'],
    },
    occupation: {
        type: String,
        required: true,
    }
}, {timestamps: true});
const userModel = mongoose.model('user', UserSchema);

module.exports = userModel;