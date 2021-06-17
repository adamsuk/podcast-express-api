var fs = require("fs");
var path = require("path");
var url = require('url');
var { InvalidReqError, InvalidMethodError, InvalidPathError } = require("../errors");

var getFilesInDirectory = async (base_path, ext) => {
    const files = await fs.promises.readdir(base_path);
    var filenames = [];
    
    for (let f of files) {
        const filepath = path.join(base_path, f);
        const stats = await fs.promises.lstat(filepath);
        if (stats.isFile()) {
            filenames.push(path.basename(f).replace(ext, ''));
        };
    };
    return filenames;
};

var getDirectories = () => {
    return fs.readdirSync(__dirname)
        .map(file => file)
        .filter(file => fs.statSync(path.join(__dirname, file)).isDirectory());
};

var valid_req = async (req, res, next) => {
    const valid_methods = getDirectories();
    try {
        if (valid_methods.includes(req.method)) {
            var valid_paths = await getFilesInDirectory(path.join(__dirname, req.method), '.js');
            const req_path = url.parse(req.url).pathname.slice(1);
            if (valid_paths.includes(req_path)) {
                require(`./${req.method}/${req_path}`)(req, res, next);
            } else {
                throw new InvalidPathError(`Requested path '${req_path}' not found.`);
            };
        } else {
            throw new InvalidMethodError(`Requested method '${req.method}' not supported.`);
        };
    } catch (err) {
        if (err instanceof InvalidReqError) {
            next(res.status(err.code).json({
                name: err.name,
                message: err.message
            }));
        } else {
            console.log(err);
            next(res.status(500).json({
                status: 'Error',
                message: 'Something unexpected happened :/'
            }));
        };
    };
};

module.exports = valid_req;
