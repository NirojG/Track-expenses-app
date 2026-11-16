import { RecordingPreview } from '@/components/recording-preview';

export default function ScanScreen() {
  return (
    <RecordingPreview
      title="Scan receipt"
      description="Keep the receipt. Skip the typing. Receipt scanning will turn a photo into an expense you can review and correct."
      example="Capture a receipt, keep the original, and let the details follow."
    />
  );
}
