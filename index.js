// .env set-up
require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || '3030';

// Check if FILE_TO_WATCH ENV is there
if (!("FILE_TO_WATCH" in process.env)) {
    throw new Error("Please add path to a file you want to watch in .env using FILE_TO_WATCH=<file_to_watch>");
}

// Add file watch interval to options
const watcherOptions = {
    interval: Number.parseInt(process.env.WATCH_INTERVAL) | 5000
}

// Set-up express app
const app = express();
const server = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
io.on('connection', (socket) => {
    console.log(`${socket.id} connect`);

    // Emit already living lines to new user
    var stdout = fs.readFileSync(process.env.FILE_TO_WATCH, 'utf-8');
    io.emit('stdout', stdout.split('\n'));

    socket.on('Disconnect', () => {
        console.log(`${socket.id} disconnected`);
    })
});

// Set up file watcher
fs.watchFile(process.env.FILE_TO_WATCH, watcherOptions, (curr, prev) => {
    var stdout = fs.readFileSync(process.env.FILE_TO_WATCH, 'utf-8');
    io.emit('stdout', stdout.split('\n'));
});

// Set-up routes
app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Start app
server.listen(port, () => {
    console.log(`Started Stdout Watcher`);
});