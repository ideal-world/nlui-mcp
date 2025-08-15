import type { NLUIGalleryComponentProps } from '$lib/ui/components/gallery.types';

export function getGalleryExamples(): NLUIGalleryComponentProps[] {
  return [
    {
      title: 'Nature Photography',
      items: [
        {
          id: '1',
          src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
          caption: 'Mountain Vista - Beautiful mountain landscape'
        },
        {
          id: '2',
          src: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop',
          caption: 'Lake Reflection - Serene lake reflection'
        },
        {
          id: '3',
          src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
          caption: 'Forest Trail - Dense forest path'
        },
        {
          id: '4',
          src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
          caption: 'Ocean Sunset - Ocean waves at sunset'
        }
      ]
    },
    {
      title: 'City Architecture',
      items: [
        {
          id: '1',
          src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
          caption: 'City Skyline - Modern city skyline'
        },
        {
          id: '2',
          src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=800&h=600&fit=crop',
          caption: 'Historic Building - Historic architecture'
        },
        {
          id: '3',
          src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
          caption: 'Modern Office - Glass office buildings'
        }
      ]
    }
  ];
}
