export const getReadableTime = (time) => {
	const zeroPad = (num) => String(num).padStart(2, '0');

	let ms = time % 1000;
	time = (time - ms) / 1000;
	let secs = time % 60;
	time = (time - secs) / 60;
	let mins = time % 60;
	let hrs = (time - mins) / 60;

	return `${zeroPad(hrs)}:${zeroPad(mins)}:${zeroPad(secs)}.${zeroPad(ms)}`;
};

export const fetchImage = async () => {
	let imageID = Math.floor(Math.random() * 1000);
	const response = await fetch(`https://picsum.photos/id/${imageID}/1200`);
	if (response.status == 404) throw new Error("Couldn't find an image. Try again.");
	return { imageID, url: response.url };
};
