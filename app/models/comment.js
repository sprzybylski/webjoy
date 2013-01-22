var CommentSchema = new mongoose.Schema({
    body: {
        'type': String,
        'default': ''
    },
    user: User,
    created_at: {
        'type': Date,
        'default': Date.now
    }
});

CommentSchema.path('body').validate(function (body) {
    return body.length > 0;
}, 'Comment body cannot be blank');

exports = module.exports = Comment = mongoose.model('Comment', CommentSchema);