const Loader = ({ label = "Memuat..." }) => (
  <div className="flex flex-col items-center justify-center py-16 text-mist gap-3">
    <div className="h-8 w-8 rounded-full border-2 border-line border-t-pulse animate-spin"></div>
    <p className="text-sm">{label}</p>
  </div>
);

export default Loader;
