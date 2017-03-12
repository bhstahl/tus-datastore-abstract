/**
 * @fileOverview
 * Based store for all AbstractDataStore classes.
 *
 * @author Ben Stahl <bhstahl@gmail.com>
 */

const Uid = require('./Uid');
const File = require('./File');
const EventEmitter = require('events');

class AbstractDataStore extends EventEmitter {
    constructor(options) {
        super();
        if (!options || !options.path) {
            throw new TypeError('Store must have a path');
        }
        if (options.namingFunction && typeof options.namingFunction !== 'function') {
            throw new TypeError('namingFunction must be a function');
        }
        this.path = options.path;
        this.generateFileName = options.namingFunction || Uid.rand;
    }

    get extensions() {
        if (!this._extensions) {
            return null;
        }
        return this._extensions.join();
    }

    set extensions(extensions_array) {
        if (!Array.isArray(extensions_array)) {
            throw new TypeError('extensions must be an array');
        }
        this._extensions = extensions_array;
    }

    /**
     * Called in POST requests. This method just creates a
     * file, implementing the creation extension.
     *
     * http://tus.io/protocols/resumable-upload.html#creation
     *
     * @param  {object} req http.incomingMessage
     * @return {Promise}
     */
    create(req) {
        return new Promise((resolve, reject) => {
            const file_id = this.generateFileName(req);
            const file = new File(file_id, req.headers['upload-length'], req.headers['upload-defer-length'], req.headers['upload-metadata']);
            return resolve(file);
        });
    }

    /**
     * Called in PATCH requests. This method should write data
     * to the AbstractDataStore file, and possibly implement the
     * concatenation extension.
     *
     * http://tus.io/protocols/resumable-upload.html#concatenation
     *
     * @param  {object} req http.incomingMessage
     * @return {Promise}
     */
    write(req) {
        return new Promise((resolve, reject) => {
            // Stub resolve for tests
            const offset = 0;
            return resolve(offset);
        });
    }

    /**
     * Called in HEAD requests. This method should return the bytes
     * writen to the AbstractDataStore, for the client to know where to resume
     * the upload.
     *
     * @param  {string} id     filename
     * @return {Promise}       bytes written
     */
    getOffset(id) {
        return new Promise((resolve, reject) => {
            if (!id) {
                throw new Error('ENOENT');
            }

            return resolve({ size: 0, upload_length: 1 });
        });
    }
}

module.exports = AbstractDataStore;
