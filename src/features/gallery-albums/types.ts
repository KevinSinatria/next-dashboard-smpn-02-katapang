export interface GalleryAlbumType {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryPhotoType {
  id: number;
  photo_url: string;
}

export interface GalleryAlbumDetailType extends GalleryAlbumType {
  description: string;
  photos: GalleryPhotoType[];
}
