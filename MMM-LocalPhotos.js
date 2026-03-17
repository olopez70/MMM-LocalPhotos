Module.register("MMM-LocalPhotos", {
	requiresVersion: "2.1.0",

	defaults: {
		photosDir: "/home/user/Pictures/magic-mirror",
		changeInterval: 5 * 60 * 1000,  // how often to advance to the next photo (ms)
	},

	photos: [],
	currentIndex: 0,
	changeTimer: null,

	start() {
		this.sendSocketNotification("INIT", {
			photosDir: this.config.photosDir,
		});
	},

	getDom() {
		return document.createElement("div");
	},

	socketNotificationReceived(notification, payload) {
		if (notification === "PHOTOS_LIST") {
			this.photos = payload;
			this.currentIndex = 0;
			if (this.changeTimer) clearInterval(this.changeTimer);
			this.showPhoto(this.photos[0]);
			this.changeTimer = setInterval(
				() => this.nextPhoto(),
				this.config.changeInterval
			);
		}
	},

	showPhoto(url) {
		if (!url) return;
		// Preload the image, then swap instantly once it's ready
		const img = new Image();
		img.onload = () => {
			document.body.style.backgroundImage = `url("${url}")`;
			document.body.style.backgroundSize = "contain";
			document.body.style.backgroundPosition = "center";
			document.body.style.backgroundRepeat = "no-repeat";
		};
		img.src = url;
	},

	nextPhoto() {
		if (!this.photos.length) return;
		this.currentIndex = (this.currentIndex + 1) % this.photos.length;
this.showPhoto(this.photos[this.currentIndex]);
	},
});
