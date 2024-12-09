export default function InputErrorText({ error }: { error: string }) {
  return (
    <div role="alert" className="pt-1 text-red-700" id="email-error">
      {error}
    </div>
  );
}
