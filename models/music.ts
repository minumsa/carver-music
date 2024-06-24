import mongoose, { Document, Model } from "mongoose";

interface Video extends Document {
  title: string;
  url: string;
}

interface MusicData extends Document {
  title: string;
  id: string;
  imgUrl: string;
  artistId: string;
  artistImgUrl: string;
  artist: string;
  album: string;
  label: string;
  releaseDate: string;
  genre: string;
  link: string;
  text: string;
  uploadDate: string;
  duration: number;
  tracks: number;
  score: number;
  musicVideoTitle: string;
  musicVideoUrl: string;
  videos: Video[];
  tagKeys: string[];
  blurHash: string;
  markdown: string;
}

const videoSchema = new mongoose.Schema({
  title: String,
  url: String,
});

const musicSchema = new mongoose.Schema({
  title: String,
  id: String,
  imgUrl: String,
  artistId: String,
  artistImgUrl: String,
  artist: String,
  album: String,
  label: String,
  releaseDate: String,
  genre: String,
  link: String,
  text: String,
  uploadDate: String,
  duration: Number,
  tracks: Number,
  score: Number,
  musicVideoTitle: String,
  musicVideoUrl: String,
  videos: [videoSchema],
  tagKeys: [String],
  blurHash: String,
  markdown: String,
});

const Music: Model<MusicData> =
  mongoose.models?.Music || mongoose.model<MusicData>("Music", musicSchema);

export default Music;
