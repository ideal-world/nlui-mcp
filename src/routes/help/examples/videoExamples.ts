import type { NLUIVideoComponentProps } from '$lib/ui/components/video.types';

export function getVideoExamples(): NLUIVideoComponentProps[] {
  return [
    {
      title: 'Product Demo Video',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    {
      title: 'Educational Content',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    }
  ];
}
