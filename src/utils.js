export const getReadableTime = (time) => {
    const zeroPad = (num) => String(num).padStart(2, '0')

    let ms = time % 1000;
    time = (time - ms) / 1000;
    let secs = time % 60;
    time = (time - secs) / 60;
    let mins = time % 60;
    let hrs = (time - mins) / 60;

    return `${zeroPad(hrs)}:${zeroPad(mins)}:${zeroPad(secs)}.${zeroPad(ms)}`
}