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
    emailId: {
        type: String,
        // required: true,
        unique: true,
    },
    password: {
        type: String,
        // required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        // required: true,
    },
    caste: {
        type: String,
        default: null,
    },
    disability: {
        type: Boolean,
        default: false,
    },
    healthConditions: {
        type: [String], // List of health conditions
        default: [],
    },
    economy: {
        type: String,
        enum: ['Below Poverty Line', 'Above Poverty Line'],
        // required: true,
    },
    state: {
        type: String,
        // required: true,
    },
    city: {
        type: String,
        // required: true,
    },
    educationLevel: {
        type: String,
        // required: true,
    },
    isStudent: {
        type: Boolean,
        default: false,
    },
    isWidow: {
        type: Boolean,
        default: false,
    },
    schemesList: {
        type: [String],
        default: [],
    },
    markedForReviewSchemes: {
        type: [String],
        default: [],
    },
});

const userModel = mongoose.model('user',UserSchema);

module.exports = userModel;