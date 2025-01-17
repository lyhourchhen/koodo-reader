import BookModel from "../../../model/Book";
import NoteModel from "../../../model/Note";
import BookmarkModel from "../../../model/Bookmark";

import { RouteComponentProps } from "react-router";
export interface BookListProps extends RouteComponentProps<any> {
  books: BookModel[];
  mode: string;
  shelfIndex: number;
  searchResults: number[];
  isSearch: boolean;
  isCollapsed: boolean;
  isBookSort: boolean;
  viewMode: string;
  bookmarks: BookmarkModel[];
  notes: NoteModel[];
  bookSortCode: { sort: number; order: number };
  noteSortCode: { sort: number; order: number };
  handleFetchList: () => void;
  handleMode: (mode: string) => void;
  handleShelfIndex: (index: number) => void;
  handleDeleteDialog: (isShow: boolean) => void;
  handleFetchBooks: (isTrash: boolean) => void;
}
export interface BookListState {
  shelfIndex: number;
  isOpenDelete: boolean;
  favoriteBooks: number;
}
