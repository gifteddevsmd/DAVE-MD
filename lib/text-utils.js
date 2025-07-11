// Dave
function truncate(text, length = 100) {
    return text.length > length ? text.slice(0, length) + '...' : text;
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

module.exports = { truncate, capitalize };
