import type { NLUIImageComponentProps } from '$lib/ui/components/image.types';

export function getImageExamples(): NLUIImageComponentProps[] {
  return [
    {
      title: 'Hero Image - Computer setup with code on screen',
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
      size: 'lg'
    },
    {
      title: 'Profile Photo - Professional headshot',
      src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      size: 'sm'
    },
    {
      title: 'Product Showcase - Modern smartphone on desk',
      src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
      size: 'md'
    }
  ];
}
