import ImageResizer from '@/components/ImageResizer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Image Resize App
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Easily resize your images with our modern, intuitive tool. Simply drag and drop your image, adjust the size, and download.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <ImageResizer />
        </div>

        <footer className="mt-12 text-center text-gray-500">
          <p>Built with Next.js, TypeScript, and TailwindCSS</p>
        </footer>
      </div>
    </main>
  );
}
