import { RecordingPreview } from '@/components/recording-preview';

export default function TypeScreen() {
  return (
    <RecordingPreview
      title="Type expense"
      description="A sentence is all it should take. Text entry will turn a short note into an expense, with an easy way to correct it."
      example="“Paid €35 for groceries at Lidl yesterday.”"
    />
  );
}
