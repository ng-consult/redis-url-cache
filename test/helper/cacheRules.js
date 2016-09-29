module.exports = {
    maxAge: [
        {
            regex: /maxAge.html$/,
            maxAge: 1
        }
    ],
    always: [
        {
            regex: /always.html$/
        }
    ],
    never: [
        {
            regex: /never.html$/
        }
    ],
    default: 'never'
};
