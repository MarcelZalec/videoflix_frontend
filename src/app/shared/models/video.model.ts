export class VideoModel {
    id: number;
    title: string;
    description: string;
    category: string;
    created_at: string;
    video_file: string;
    thumbnail: string;
  
    constructor(
      id: number,
      title: string,
      description: string,
      category: string,
      created_at: string,
      video_file: string,
      thumbnail: string
    ) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.category = category;
      this.created_at = created_at;
      this.video_file = video_file;
      this.thumbnail = thumbnail;
    }
  }