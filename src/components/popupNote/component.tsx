import React from "react";
import "./popupNote.css";
import Note from "../../model/Note";
import localforage from "localforage";
import { PopupNoteProps } from "./interface";
import { Trans } from "react-i18next";

declare var window: any;

class PopupNote extends React.Component<PopupNoteProps> {
  componentDidMount() {
    let textArea: any = document.querySelector(".editor-box");
    textArea && textArea.focus();
    console.log(textArea);
  }
  createNote() {
    if (
      !document.getElementsByTagName("iframe")[0] ||
      !document.getElementsByTagName("iframe")[0].contentDocument
    ) {
      return;
    }
    let book = this.props.currentBook;
    let epub = this.props.currentEpub;
    let iframe = document.getElementsByTagName("iframe")[0];
    let iDoc = iframe.contentDocument;
    let sel = iDoc!.getSelection();
    let rangeBefore = sel!.getRangeAt(0);
    let notes = (document.querySelector(".editor-box") as HTMLInputElement)
      .value;
    (document.querySelector(".editor-box") as HTMLInputElement).value = "";
    let text = sel!.toString();
    text = text && text.trim();
    let cfiBase = epub.renderer.currentChapter.cfiBase;
    let cfi = new window.EPUBJS.EpubCFI().generateCfiFromRange(
      rangeBefore,
      cfiBase
    );
    let percentage = this.props.currentEpub.locations.percentageFromCfi(cfi);
    let bookKey = book.key;
    let charRange = window.rangy
      .getSelection(iframe)
      .saveCharacterRanges(iDoc!.body)[0];
    let range = JSON.stringify(charRange);
    //获取章节名
    let index = this.props.chapters.findIndex((item: any) => {
      return item.spinePos > epub.renderer.currentChapter.spinePos;
    });
    let chapter = this.props.chapters[index]
      ? this.props.chapters[index].label.trim(" ")
      : "Unknown";
    let chapterIndex = this.props.currentEpub.renderer.currentChapter.spinePos;
    let color = this.props.color || 1;
    let note = new Note(
      bookKey,
      chapter,
      chapterIndex,
      text,
      cfi,
      range,
      notes,
      percentage,
      color
    );
    let noteArr = this.props.notes;
    noteArr.push(note);
    localforage.setItem("notes", noteArr);
    this.props.handleOpenMenu(false);
    this.props.handleMessage("Add Successfully");
    this.props.handleMessageBox(true);
    this.props.handleMenuMode("highlight");
    // this.props.handleMenuMode("menu");
  }
  handleReturn = () => {
    this.props.handleMenuMode("menu");
  };
  handleClose = () => {
    this.props.handleOpenMenu(false);
    this.props.handleMenuMode("menu");
  };

  render() {
    const renderNoteEditor = () => {
      return (
        <div className="note-editor">
          <div
            className="note-return-button"
            onClick={() => {
              this.handleReturn();
            }}
          >
            <span className="icon-return"></span>
          </div>
          <div className="editor-box-parent">
            <textarea className="editor-box" />
          </div>
          <div className="note-button-container">
            <span
              className="cancel-button"
              onClick={() => {
                this.handleClose();
              }}
            >
              <Trans>Cancel</Trans>
            </span>
            <span
              className="confirm-button"
              onClick={() => {
                this.createNote();
              }}
            >
              <Trans>Confirm</Trans>
            </span>
          </div>
        </div>
      );
    };
    return renderNoteEditor();
  }
}
export default PopupNote;