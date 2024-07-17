const windows = {};

function fixedWindowCounter(ip) {
    const now = Math.floor(Date.now() / 1000);
    const window = Math.floor(now / 60) * 60;

    if (!windows[window]) {
        windows[window] = {};
    }

    if (!windows[window][ip]) {
        windows[window][ip] = 0;
    }

    if (windows[window][ip] < 60) {
        windows[window][ip] += 1;
        return true;
    } else {
        return false;
    }
}

module.exports = fixedWindowCounter;
