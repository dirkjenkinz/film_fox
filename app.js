const express = require('express');
const nunjucks = require('nunjucks');

// Create an Express application
const app = express();

// Configure Nunjucks for template rendering
nunjucks.configure('pages', {
    autoescape: true,
    express: app
});

// Middleware setup for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define the server port
const PORT = 3000;

// Serve static files from the public directory
app.use(express.static(`${__dirname}/`)); // Use template literal for path

// Routes object mapping endpoints to router modules
const routers = {
    '/': 'front.js',
    '/front': 'front.js',
    '/convert': 'convert.js',
    '/ctv': 'character-to-voice.js',
    '/character-update': 'character-update.js',
    '/generate-single': 'generate-single.js',
    '/delete': 'delete.js',
    '/gallery': 'gallery.js',
    '/update-image-display': 'update-image-display.js',
    '/showreel': 'showreel.js',
    '/sound': 'sound.js',
    '/concatenate-sound': 'concatenate-sound.js',
    '/master': 'master.js',
    '/play-master': 'play-master.js',
    '/video': 'video.js',
    '/create-video': 'create-video.js',
    '/characters': 'characters.js',
    '/edit-character': 'edit-character.js',
    '/voices': 'voices.js',
    '/get-samples': 'get-samples.js',
    '/scene-shot-list': 'scene-shot-list.js',
    '/update-shot-list': 'update-shot-list.js',
    '/add-shot': 'add-shot.js',
    '/delete-shot': 'delete-shot.js',
    '/update-note': 'update-note.js',
    '/scene-arranger': 'scene-arranger.js',
    '/change-scene-order': 'change-scene-order.js',
    '/sheets': 'sheets.js',
    '/credits': 'credits.js',
    '/update-credits': 'update-credits.js',
    '/add-character': 'add-character.js',
    '/add-character-to-scene': 'add-character-to-scene.js',
    '/delete-character-from-scene': 'delete-character-from-scene.js',
    '/delete-character': 'delete-character.js',
    '/breakdown': 'breakdown.js',
    '/render-breakdown': 'render-breakdown.js',
    '/breakdown-report': 'breakdown-report.js',
    '/add-category': 'add-category.js',
    '/delete-category': 'delete-category.js',
    '/categories': 'categories.js',
    '/compile-scene': 'compile-scene.js',
    '/generate-powerpoint': 'generate-powerpoint.js',
    '/show-gallery': 'show-gallery.js',
    '/delete-image': 'delete-image.js',
    '/rename-image': 'rename-image.js',
    '/generate-scene': 'generate-scene.js',
    '/slideshow': 'slideshow.js',
    '/generate-paperwork': 'generate-paperwork.js',
    '/update-api-key': 'update-api-key.js',
    '/generate-shot-pdfs': 'generate-shot-pdfs.js',
    '/generate-shot-spreadsheets': 'generate-shot-spreadsheets.js',
    '/generate-scene-list-spreadsheet': 'generate-scene-list-spreadsheet.js'
};

// Attach routers to their respective endpoints
Object.entries(routers).forEach(([endpoint, router]) => {
    app.use(endpoint, require(`./routes/${router}`));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

// Start the server and handle potential startup errors
app.listen(PORT, err => {
    if (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
    console.log(`FilmFox is up & running on port ${PORT}`);
});
