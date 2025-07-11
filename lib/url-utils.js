//Dave
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch {
        return false;
    }
}

function extractHostname(url) {
    return new URL(url).hostname;
}

module.exports = { isValidUrl, extractHostname };
