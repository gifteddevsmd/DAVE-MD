const commands = [];

/**
 * Registers a command into the commands list.
 * @param {Object} info - Command metadata (pattern, desc, category, etc.)
 * @param {Function} func - The function to be executed when the command is triggered
 */
function cmd(info, func) {
    const data = { ...info };

    data.function = func;
    data.dontAddCommandList = data.dontAddCommandList || false;
    data.desc = data.desc || '';
    data.fromMe = data.fromMe || false;
    data.category = data.category || 'misc';
    data.filename = data.filename || 'Not Provided';

    commands.push(data);
    return data;
}

// Aliases for compatibility
module.exports = {
    cmd,
    AddCommand: cmd,
    Function: cmd,
    Module: cmd,
    commands
};
