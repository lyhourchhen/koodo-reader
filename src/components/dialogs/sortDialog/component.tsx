//排序弹窗
import React from "react";
import "./sortDialog.css";
import OtherUtil from "../../../utils/otherUtil";
import { Trans } from "react-i18next";
import { SortDialogProps, SortDialogState } from "./interface";

class SortDialog extends React.Component<SortDialogProps, SortDialogState> {
  constructor(props: SortDialogProps) {
    super(props);
    this.state = {
      isNote: this.props.mode === "note" || this.props.mode === "digest",
    };
  }

  handleSort = (code: number) => {
    if (this.state.isNote) {
      let noteSortCode = this.props.noteSortCode;
      noteSortCode.sort = code;
      this.props.handleNoteSortCode(noteSortCode);
      this.props.handleNoteSort(true);
      OtherUtil.setNoteSortCode(code, this.props.noteSortCode.order);
    } else {
      let bookSortCode = this.props.bookSortCode;
      bookSortCode.sort = code;
      this.props.handleBookSortCode(bookSortCode);
      this.props.handleBookSort(true);
      OtherUtil.setBookSortCode(code, this.props.bookSortCode.order);
    }
  };
  handleOrder = (code: number) => {
    if (this.state.isNote) {
      let noteSortCode = this.props.noteSortCode;
      noteSortCode.order = code;
      this.props.handleNoteSort(true);
      OtherUtil.setNoteSortCode(this.props.noteSortCode.sort, code);
      this.props.handleNoteSortCode(noteSortCode);
    } else {
      let bookSortCode = this.props.bookSortCode;
      bookSortCode.order = code;
      this.props.handleBookSort(true);
      OtherUtil.setBookSortCode(this.props.bookSortCode.sort, code);
      this.props.handleBookSortCode(bookSortCode);
    }
  };
  handleSortBooks = () => {
    if (this.props.isSortDisplay) {
      this.props.handleSortDisplay(false);
    } else {
      this.props.handleSortDisplay(true);
    }
  };
  render() {
    let sortCode = this.state.isNote
      ? this.props.noteSortCode
      : this.props.bookSortCode;
    return (
      <div
        className="sort-dialog-container"
        onMouseLeave={() => {
          this.handleSortBooks();
        }}
        style={
          this.state.isNote
            ? { boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.18)", height: "120px" }
            : { boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.18)" }
        }
        // style={this.state.isNote ? { height: "120px" } : {}}
      >
        {this.state.isNote ? (
          <ul className="sort-by-category">
            {["Sort by Name", "Sort by Date"].map((item, index) => {
              return (
                <li
                  className="sort-by-category-list"
                  onClick={() => {
                    this.handleSort(index + 1);
                  }}
                  style={
                    sortCode.sort === index + 1
                      ? { color: "rgba(75, 75, 75, 1)" }
                      : {}
                  }
                >
                  <Trans>{item}</Trans>
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className="sort-by-category">
            {[
              "Sort by Recent",
              "Sort by Name",
              "Sort by Date",
              "Sort by Duration",
              "Sort by Author",
              "Sort by Percentage",
            ].map((item, index) => {
              return (
                <li
                  className="sort-by-category-list"
                  onClick={() => {
                    this.handleSort(index);
                  }}
                  style={
                    sortCode.sort === index
                      ? { color: "rgba(75, 75, 75, 1)" }
                      : {}
                  }
                >
                  <Trans>{item}</Trans>
                </li>
              );
            })}
          </ul>
        )}
        <div className="sort-dialog-seperator"></div>
        <ul className="sort-by-order">
          <li
            className="sort-by-order-list"
            onClick={() => {
              this.handleOrder(1);
            }}
            style={sortCode.order === 1 ? { color: "rgba(75, 75, 75, 1)" } : {}}
          >
            <Trans>Ascending Order</Trans>
          </li>
          <li
            className="sort-by-order-list"
            onClick={() => {
              this.handleOrder(2);
            }}
            style={sortCode.order === 2 ? { color: "rgba(75, 75, 75, 1)" } : {}}
          >
            <Trans>Descending Order</Trans>
          </li>
        </ul>
      </div>
    );
  }
}

export default SortDialog;
