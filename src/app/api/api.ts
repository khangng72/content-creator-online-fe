import { book_mock_data, Chapters, book } from "@/app/api/mock/book_data";
import { PinkPoeWorks } from "@/app/api/mock/book_data";

// Mock API
export const get_books = () => {
  return book_mock_data;
};

export const get_author_works = () => {
  return PinkPoeWorks;
};

export const get_chapters = () => {
  return Chapters;
};

export const get_book = () => {
  return book;
};
