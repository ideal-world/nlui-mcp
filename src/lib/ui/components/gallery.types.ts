import type { BaseComponentProps, LinkActionProps, ApiActionProps } from '../common/base.types';

export interface NLUIGalleryComponentProps extends BaseComponentProps {
  /** Gallery items (images or videos) */
  items: GalleryItem[];
  /** Action available for the gallery */
  action?: LinkActionProps;
}

export interface GalleryItem {
  /** Unique identifier for the item */
  id: string;
  /** Source URL for the media */
  src: string;
  /** Caption/description for the item */
  caption?: string;
}
