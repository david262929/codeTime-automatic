function Schema({}) {

}

const schema = new Schema({
    from: {
        type : String,
        required: true,
    },
    file: {
        type : String,
        required: true,
    },
    data: {
        type : Date,
        default: Date.now,
    },
    clicks: {
        type : Number,
        default: 0,
    },
    owner: {
        type: Types.ObjectId,
        ref: 'User'
    }
});

// module.exports = model('Link', schema)