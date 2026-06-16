export default function Loading() {
  return (
    <div className="gileara-loader" role="status" aria-live="polite" aria-busy="true">
      <div className="gileara-loader__mark" aria-hidden="true">
        <img src="/assets/gileara/logo-icon.png" alt="" />
      </div>
      <span className="sr-only">Loading Gileara</span>
    </div>
  );
}
