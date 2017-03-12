import test from 'ava';
import File from '../lib/File';

test('must require a file_name', (t) => {
    const error = t.throws(() => {
        new File();
    }, TypeError);

    t.is(error.message, '[File] constructor must be given a file_id');
});

test('must be given either a upload_length or upload_defer_length', (t) => {
    const error = t.throws(() => {
        new File({
            file_id: '1234',
        });
    }, TypeError);

    t.is(error.message, '[File] constructor must be given either a upload_length or upload_defer_length');
});

test('should set properties given', (t) => {

    const file_id = '1234';
    const upload_length = 1234;
    const upload_defer_length = 1;
    const upload_metadata = 'metadata';

    const file = new File(
        file_id,
        upload_length,
        upload_defer_length,
        upload_metadata,
    );

    t.is(file.id, file_id);
    t.is(file.upload_length, upload_length);
    t.is(file.upload_defer_length, upload_defer_length);
    t.is(file.upload_metadata, upload_metadata);
});


