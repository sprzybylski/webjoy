var PostSchema = new mongoose.Schema({
    body: {
        'type': String,
        'default': '',
        'trim': true
    },
    user: User,
    comments: [{
        'body': String,
        'user': String,
        'created_at': {
            'type': Date,
            'default': Date.now
        }
    }],
    created_at: {
        'type': Date,
        'default': Date.now
    }
});

PostSchema.path('body').validate(function (body) {
    return body.length > 0;
}, 'Post body cannot be blank');

exports = module.exports = Post = mongoose.model('Post', PostSchema);