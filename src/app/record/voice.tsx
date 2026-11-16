import { RecordingPreview } from '@/components/recording-preview';

export default function VoiceScreen() {
  return (
    <RecordingPreview
      title="Record by voice"
      description="Say it your way. Voice recording will help you capture everyday spending without filling out a form."
      example="“I spent 15 euros on groceries and 4 euros on coffee.”"
    />
  );
}
