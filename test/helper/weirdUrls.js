module.exports.valid =
    [
    "the quick brown fox jumped over the lazy dog",
    "résumé",
    "hello\u0000world",
    "hello\nworld",
    "semi;colon.js",
    ";leading-semi.js",
    "slash\\.js",
    "slash/.js",
    "star*.js",
    "question?.js",
    "quote\".js",
    "singlequote'.js",
    "brack<e>ts.js",
    "p|pes.js",
    "plus+.js",
    "'five and six<seven'.js",
    " space at front",
    "space at end ",
    ".period",
    "period.",
    "relative/path/to/some/dir",
    "/abs/path/to/some/dir",
    "~/.\u0000notssh/authorized_keys",
    "h?w",
    "h/w",
    "h*w",
    "../",
    "/..",
    "/../",
    "*.|.",
    "./",
    "./foobar",
    "../foobar",
    "../../foobar",
    "./././foobar",
    "|*.what",
    ".",
    "..",
    "LPT9.asdf"];


module.exports.invalid = [

   // "",
    /*"./",
    "col:on.js",*/
];