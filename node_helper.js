const NodeHelper = require("node_helper");
const fs = require("fs");
const path = require("path");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);

module.exports = NodeHelper.create({

	start() {
		this.photosDir = null;
		this.registerRoute();
	},

	registerRoute() {
		this.expressApp.use("/MMM-LocalPhotos/photo", (req, res) => {
			if (!this.photosDir) return res.status(503).end();
			// Resolve full path and verify it stays within photosDir
			const resolved = path.resolve(this.photosDir, "." + req.path);
			if (!resolved.startsWith(path.resolve(this.photosDir) + path.sep)) {
				return res.status(403).end();
			}
			if (fs.existsSync(resolved)) {
				res.sendFile(resolved);
			} else {
				res.status(404).end();
			}
		});
	},

	socketNotificationReceived(notification, payload) {
		console.log(`[MMM-LocalPhotos] Received notification: ${notification}`);
		if (notification === "INIT") {
			this.photosDir = payload.photosDir;
			this.sendPhotoList();
		}
	},

	sendPhotoList() {
		console.log(`[MMM-LocalPhotos] Scanning: ${this.photosDir}`);
		try {
			// Recursively find all image files under photosDir
			const files = fs.readdirSync(this.photosDir, { recursive: true })
				.filter(f => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()));

			console.log(`[MMM-LocalPhotos] Found ${files.length} images`);
			if (!files.length) {
				console.error(`[MMM-LocalPhotos] No images found in ${this.photosDir}`);
				return;
			}

			// Shuffle for variety
			files.sort(() => Math.random() - 0.5);
			// Build URLs from relative paths (may include subdirectories)
			const urls = files.map(f =>
				`/MMM-LocalPhotos/photo/${f.split(path.sep).map(encodeURIComponent).join("/")}`
			);
			console.log(`[MMM-LocalPhotos] Sending ${urls.length} URLs, first: ${urls[0]}`);
			this.sendSocketNotification("PHOTOS_LIST", urls);
		} catch (e) {
			console.error(`[MMM-LocalPhotos] Cannot read directory ${this.photosDir}: ${e.message}`);
		}
	},
});
