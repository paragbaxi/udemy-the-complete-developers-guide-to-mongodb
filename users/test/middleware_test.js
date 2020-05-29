const mongoose = require('mongoose');
const assert = require('assert');

const User = require('../src/user');
const BlogPost = require('../src/BlogPost');

describe('Middleware', () => {
    let joe;

    beforeEach((done) => {
        joe = new User({ name: 'Joe' });
        blogPost = new BlogPost({ title: 'JS is Great', content: 'Yup' });

        joe.blogPosts.push(blogPost);

        Promise.all([joe.save(), blogPost.save()]).then(() => done());
    });

    it('users clean up dangling blogposts on delete', (done) => {
        joe.remove()
            .then(() => BlogPost.countDocuments())
            .then((count) => {
                assert(count === 0);
                done();
            });
    });
});
