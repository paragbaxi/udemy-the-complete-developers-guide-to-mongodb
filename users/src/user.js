const mongoose = require('mongoose');
const PostSchema = require('./PostSchema');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        validate: {
            validator: (name) => name.length > 2,
            message: 'Name must be longer than 2 characters.',
        },
    },
    // postCount: Number,
    posts: [PostSchema],
    likes: Number,
    blogPosts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'blogPost',
        },
    ],
});

// Use function so that "this" is bound to UserInstance
UserSchema.virtual('postCount').get(function () {
    return this.posts.length;
});

UserSchema.pre('remove', function (next) {
    // Avoid circular logic since BlogPost may require User (this model)
    const BlogPost = mongoose.model('blogPost');

    // this === joe
    BlogPost.deleteMany({ _id: { $in: this.blogPosts } }).then(() => next());
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
