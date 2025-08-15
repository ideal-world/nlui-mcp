import type { NLUIAudioComponentProps } from '$lib/ui/components/audio.types';

export function getAudioExamples(): NLUIAudioComponentProps[] {
  return [
    {
      title: 'Podcast Episode - Tech Talk',
      src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    },
    {
      title: 'Background Music',
      src: 'https://www.soundjay.com/misc/sounds/bell-ringing-01.wav'
    }
  ];
}
