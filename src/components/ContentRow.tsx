import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import type { Content } from '../types';

interface ContentRowProps {
  title: string;
  contents: Content[];
  onSelect: (content: Content) => void;
}

export default function ContentRow({ title, contents, onSelect }: ContentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: 'left' | 'right') => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col gap-4 px-4 md:px-12 py-8 group overflow-hidden">
      <h2 className="text-xl md:text-2xl font-bold text-gray-200 hover:text-white transition-colors cursor-pointer">
        {title}
      </h2>
      
      <div className="relative">
        <button
          className={`absolute top-0 bottom-0 left-0 z-40 m-auto h-full w-12 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 bg-black/40 flex items-center justify-center ${!isMoved && 'hidden'}`}
          onClick={() => handleClick('left')}
        >
          <ChevronLeft size={40} className="text-white" />
        </button>

        <div
          ref={rowRef}
          className="flex items-center gap-2 overflow-x-scroll no-scrollbar scroll-smooth"
        >
          {contents.map((content) => (
            <MovieCard key={content.id} content={content} onSelect={onSelect} />
          ))}
        </div>

        <button
          className="absolute top-0 bottom-0 right-0 z-40 m-auto h-full w-12 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 bg-black/40 flex items-center justify-center"
          onClick={() => handleClick('right')}
        >
          <ChevronRight size={40} className="text-white" />
        </button>
      </div>
    </div>
  );
}
