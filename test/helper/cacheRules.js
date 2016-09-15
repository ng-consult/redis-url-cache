module.exports = {
    cacheMaxAge: [
        {
            regex: /maxAge.html$/,
            maxAge: 1
        }
    ],
    cacheAlways: [
        {
            regex: /always.html$/
        }
    ],
    cacheNever: [
        {
            regex: /never.html$/
        }
    ],
    default: 'never'
};
