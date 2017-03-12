import test from 'ava';
import AbstractDataStore from '../lib/AbstractDataStore';
import File from '../lib/File';

const fakeRequest = {
    headers: {
        'upload-length': 1,
        'upload-defer-length': 1,
        'upload-metadata': 1,
    },
};

test('constructor must require a path', (t) => {
    const error = t.throws(() => {
        new AbstractDataStore();
    }, TypeError);

    t.is(error.message, 'Store must have a path');
});

test('constructor namingFunction must be a function ', (t) => {
    const error = t.throws(() => {
        new AbstractDataStore({
            path: '/files',
            namingFunction: 'a string',
        });
    }, TypeError);

    t.is(error.message, 'namingFunction must be a function');
});

test('extensions should only set if an array is passed', (t) => {
    const store = new AbstractDataStore({ path: '/files' });

    const error = t.throws(() => {
        store.extensions = 'creation, concatenation';
    }, TypeError);

    t.is(error.message, 'extensions must be an array');
});

test('extensions should get/set appropriately for the Tus-Extension header', (t) => {
    const extensions = ['creation', 'concatenation'];
    const store = new AbstractDataStore({ path: '/files' });
    t.is(store.extensions, null);
    store.extensions = extensions;
    t.is(store.extensions, extensions.join());
});

test('create() returns a file', async (t) => {
    const store = new AbstractDataStore({ path: '/files' });
    const file = await store.create(fakeRequest);
    t.true(file instanceof File);
});

test('create() should use a naming function', async (t) => {
    const fileName = 'myFileName';
    const namingFunction = (req) => fileName;
    const store = new AbstractDataStore({
        path: '/files',
        namingFunction,
    });
    const file = await store.create(fakeRequest);
    t.is(file.id, fileName);
});

test('write() resolves a new offset', async (t) => {
    const store = new AbstractDataStore({ path: '/files' });
    const offset = await store.write(fakeRequest);
    t.is(typeof offset, 'number');
    t.is(offset, 0);
});

test('getOffset() resolves the current file size', async (t) => {
    const store = new AbstractDataStore({ path: '/files' });
    const offset = await store.getOffset(fakeRequest);
    t.is(typeof offset.size, 'number');
    t.is(offset.size, 0);
    t.is(typeof offset.upload_length, 'number');
    t.is(offset.upload_length, 1);
});

test('getOffset() should throw an error of file isn‘t found', (t) => {
    const store = new AbstractDataStore({ path: '/files' });
    return store.getOffset()
            .catch((error) => {
                t.is(error.message, 'ENOENT');
            });

});

