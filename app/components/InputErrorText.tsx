export default function InputErrorText({ error }: { error: string }) {
  return (
    <div className="pt-1 text-red-700" id="email-error">
      {error}
    </div>
  );
}
