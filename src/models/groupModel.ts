import { Schema, model } from 'mongoose';

const GroupSchema = new Schema({
    name: { type: String, unique: true, required: true },
});

export default model('Group', GroupSchema);
