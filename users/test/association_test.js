const assert = require('assert');

const mongoose = require('mongoose');
const User = require('../src/user');
const Comment = require('../src/Comment');
const BlogPost = require('../src/BlogPost');

describe('Associations', () => {
    let joe, blogPost, commment;

    beforeEach((done) => {
        joe = new User({ name: 'Joe' });
        blogPost = new BlogPost({ title: 'JS is Great', content: 'Yup' });
        comment = new Comment({ content: 'Congrats!' });

        joe.blogPosts.push(blogPost);
        blogPost.comments.push(comment);
        comment.user = joe;

        Promise.all([joe.save(), blogPost.save(), comment.save()]).then(() =>
            done()
        );
    });

    it('saves a relation between a user and a blog post', (done) => {
        User.findOne({ name: 'Joe' })
            .populate('blogPosts') // 'blogPosts' comes user model key
            .then((user) => {
                assert(user.blogPosts[0].title === 'JS is Great');
                done();
            });
    });

    it('saves a full relation graph', (done) => {
        User.findOne({ name: 'Joe' })
            .populate({
                path: 'blogPosts',
                populate: {
                    path: 'comments',
                    model: 'comment',
                    populate: {
                        path: 'user',
                        model: 'user',
                    },
                },
            })
            .then((user) => {
                // console.log(user.blogPosts[0].comments[0]);
                assert(user.name === 'Joe');
                assert(user.blogPosts[0].title === 'JS is Great');
                assert(user.blogPosts[0].comments[0].content === 'Congrats!');
                assert(user.blogPosts[0].comments[0].user.name === 'Joe');
                done();
            });
    });
});
