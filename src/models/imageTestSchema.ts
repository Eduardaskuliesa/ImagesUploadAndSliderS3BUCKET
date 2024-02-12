import mongoose, { Schema } from 'mongoose';

const albumSchemaTest = new Schema({
  name: { type: String, required: true },
  date: { type: String},
  images: [{
    url: {
      required: true,
      type: String
    }
  }],
});

export default mongoose.models.AlbumTest || mongoose.model('AlbumTest', albumSchemaTest);

