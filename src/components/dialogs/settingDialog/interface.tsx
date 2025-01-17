import BookModel from "../../../model/Book";
import NoteModel from "../../../model/Note";
import BookmarkModel from "../../../model/Bookmark";
export interface SettingInfoProps {
  handleSetting: (isSettingOpen: boolean) => void;
  handleMessage: (message: string) => void;
  handleMessageBox: (isShow: boolean) => void;
  bookmarks: BookmarkModel[];
  notes: NoteModel[];
  books: BookModel[];
}
export interface SettingInfoState {
  language: string;
  isTouch: boolean;
  isOpenBook: boolean;
  isExpandContent: boolean;
  isAutoSync: boolean;
  isRememberSize: boolean;
}
