import { useSearchParams } from 'react-router-dom';

export default function ViewerPage() {
  const [params] = useSearchParams();
  const data = params.get('data');

  let images: string[] = [];

  try {
    images = data ? JSON.parse(decodeURIComponent(data)) : [];
  } catch {
    images = [];
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-semibold mb-6">Document Viewer</h1>

      {images.length === 0 && (
        <p className="text-gray-400">No documents found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((url, index) => (
          <div
            key={index}
            className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition"
          >
            <img
              src={url}
              alt={`document-${index}`}
              className="w-full h-auto rounded-lg"
            />
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-blue-400 mt-2 text-center"
            >
              Open Full Image
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
