import { Schema, model } from 'mongoose';

const GroupSchema = new Schema({
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default model('Group', GroupSchema);
