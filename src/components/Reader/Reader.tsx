"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Type,
  Moon,
  Sun,
  TableOfContents,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Mock book data
const mockBook = {
  title: "Whispers of Eternity",
  content: [
    {
      chapter_id: 1,
      chapter_title: "The Dreamer Awakes",
      chapter_content: "In the quiet town of Eldershade, a young dreamer named Aelin awakens from a vivid dream. It's a dream unlike any she had experienced before, one that feels almost real. The colors, the sensations, and the whispers of an unknown voice still echo in her mind, guiding her through the fog of sleep. Aelin can barely recall the specifics of the dream, but the feeling lingers—like a message just out of reach. She feels a strange connection to the dream, a sense that it holds the key to something important, something bigger than herself. Despite the confusion, Aelin feels compelled to investigate its meaning. As she steps out of bed, the morning sun filters through her window, casting a warm glow on the room. But today, nothing seems ordinary. Her once peaceful village feels different, as if the world itself is holding its breath. Aelin has always been able to decipher her dreams, but this one is different. She decides to visit the local dream oracle, an elderly woman known for her wisdom. The oracle listens carefully to Aelin's description and then falls silent, her gaze distant as if lost in thought. 'The dreams you see are not just figments of your imagination,' the oracle says with a cryptic smile. 'They are the whispers of the eternal dreamscape. And soon, you will find yourself in the midst of it.'"
    },
    {
      chapter_id: 2,
      chapter_title: "The Hidden Realm",
      chapter_content: "Determined to understand her dream and its significance, Aelin ventures into the Forbidden Forest, a place that has long been shrouded in mystery. The trees here are ancient, their roots twisted and gnarled as if they hold secrets that have been buried for centuries. The air is thick with an unsettling silence, broken only by the rustle of leaves beneath her feet. Aelin's heart races with anticipation and fear. She follows the path laid before her in her dream, which seems to appear before her as though guided by an unseen force. After hours of walking, she stumbles upon a clearing where the sunlight seems to bend unnaturally, casting strange shadows on the ground. In the center of the clearing stands a massive stone archway, covered in ancient runes that glow faintly in the dim light. This is the portal she has seen in her dream. Aelin's breath catches in her throat as she steps closer to the archway. She feels an undeniable pull toward it, a magnetic force that seems to call her name. As her fingers brush against the cold stone, a surge of energy pulses through her, and the world around her begins to shift. The air grows thick with power, and for a moment, she feels like she's standing between two worlds—one foot in reality and the other in a place beyond comprehension. With one final step, she crosses the threshold and enters the Hidden Realm."
    },
    {
      chapter_id: 3,
      chapter_title: "The Eternal Dreamscape",
      chapter_content: "The Hidden Realm is unlike anything Aelin has ever seen. The sky is a swirling canvas of colors that shift and change like liquid, and the ground beneath her feet seems to pulse with energy. Strange creatures flit through the air, their forms shifting between solid and ethereal. Aelin feels both exhilarated and terrified as she takes her first steps into this new world. The dream oracle's words echo in her mind—this is the eternal dreamscape, a place where dreams and reality intertwine. As she explores, Aelin begins to understand that this realm is not just a physical place but a manifestation of the collective unconscious, where the dreams of all dreamers converge. She meets other dreamers who have found their way here, each with their own story and purpose. Some are lost, some are searching, and some, like Aelin, seem to have been called here for a reason they don't yet understand. The more time she spends in the dreamscape, the more Aelin realizes that her dream was not just a random occurrence but a summons—a call to action that she cannot ignore."
    }
  ]
};

const Reader = () => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const { theme, setTheme } = useTheme();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isImmersive, setIsImmersive] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Load reading progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`book_${mockBook.title}_progress`);
    if (savedProgress) {
      setCurrentChapter(parseInt(savedProgress));
    }
  }, []);

  // Save reading progress to localStorage
  useEffect(() => {
    localStorage.setItem(`book_${mockBook.title}_progress`, currentChapter.toString());
    setReadingProgress(Math.round((currentChapter / (mockBook.content.length - 1)) * 100));
  }, [currentChapter]);

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Save bookmark to localStorage
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    if (!isBookmarked) {
      bookmarks.push({ bookTitle: mockBook.title, chapter: currentChapter });
    } else {
      const index = bookmarks.findIndex((b: any) => b.bookTitle === mockBook.title);
      if (index > -1) {
        bookmarks.splice(index, 1);
      }
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  };

  const toggleImmersive = () => {
    setIsImmersive(!isImmersive);
  };

  const nextChapter = () => {
    if (currentChapter < mockBook.content.length - 1) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  return (
    <div className={`flex flex-col min-h-screen bg-background ${isImmersive ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className={`flex justify-between items-center p-4 border-b ${isImmersive ? 'hidden' : ''}`}>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <BookOpen className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">{mockBook.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Type className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleFontSizeChange(14)}>
                Small
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFontSizeChange(16)}>
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFontSizeChange(18)}>
                Large
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleBookmark}>
            <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleImmersive}>
            {isImmersive ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <TableOfContents className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Table of Contents</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                {mockBook.content.map((chapter, index) => (
                  <Button
                    key={chapter.chapter_id}
                    variant={currentChapter === index ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setCurrentChapter(index)}
                  >
                    {chapter.chapter_title}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 max-w-3xl mx-auto">
        <div
          className="prose dark:prose-invert max-w-none"
          style={{ fontSize: `${fontSize}px` }}
        >
          <h2 className="text-2xl font-bold mb-6">
            {mockBook.content[currentChapter].chapter_title}
          </h2>
          <p className="whitespace-pre-line leading-relaxed">
            {mockBook.content[currentChapter].chapter_content}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-muted">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center p-4 border-t">
        <Button
          variant="ghost"
          onClick={prevChapter}
          disabled={currentChapter === 0}
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Previous Chapter
        </Button>
        <div className="text-sm text-muted-foreground">
          Chapter {currentChapter + 1} of {mockBook.content.length} ({readingProgress}%)
        </div>
        <Button
          variant="ghost"
          onClick={nextChapter}
          disabled={currentChapter === mockBook.content.length - 1}
        >
          Next Chapter
          <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Reader; 