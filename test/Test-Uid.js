import test from 'ava';
import Uid from '../lib/Uid';

test('returns a 32 char random string', (t) => {
    const id = Uid.rand();
    t.is(typeof id, 'string');
    t.is(id.length, 32);
});
