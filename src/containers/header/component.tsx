//header 页面
import React from "react";
import "./header.css";
import SearchBox from "../../components/searchBox";
import ImportLocal from "../../components/importLocal";
import { Trans } from "react-i18next";
import { HeaderProps, HeaderState } from "./interface";
import OtherUtil from "../../utils/otherUtil";
import UpdateInfo from "../../components/dialogs/updateInfo";
import RestoreUtil from "../../utils/syncUtils/restoreUtil";
import BackupUtil from "../../utils/syncUtils/backupUtil";

import { isElectron } from "react-device-detect";

class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps) {
    super(props);
    this.state = {
      isOnlyLocal: false,
      language: OtherUtil.getReaderConfig("lang"),
      isNewVersion: false,
      width: document.body.clientWidth,
    };
  }
  handleSortBooks = () => {
    if (this.props.isSortDisplay) {
      this.props.handleSortDisplay(false);
    } else {
      this.props.handleSortDisplay(true);
    }
  };
  async componentDidMount() {
    if (isElectron) {
      const fs = window.require("fs");
      const path = window.require("path");
      const request = window.require("request");
      const { remote, app } = window.require("electron");
      const configDir = (app || remote.app).getPath("userData");
      const dirPath = path.join(configDir, "uploads");
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
        fs.mkdirSync(path.join(dirPath, "data"));
        fs.mkdirSync(path.join(dirPath, "data", "book"));
        console.log("文件夹创建成功");
      } else {
        console.log("文件夹已存在");
      }
      if (!fs.existsSync(path.join(dirPath, `cover.png`))) {
        let stream = fs.createWriteStream(path.join(dirPath, `cover.png`));
        request(`https://koodo.960960.xyz/images/splash.png`)
          .pipe(stream)
          .on("close", function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log("文件下载完毕");
            }
          });
      }
      const { zip } = window.require("zip-a-folder");
      let storageLocation = OtherUtil.getReaderConfig("storageLocation")
        ? OtherUtil.getReaderConfig("storageLocation")
        : window
            .require("electron")
            .ipcRenderer.sendSync("storage-location", "ping");
      let sourcePath = path.join(storageLocation, "config");
      let outPath = path.join(storageLocation, "config.zip");
      await zip(sourcePath, outPath);
      var data = fs.readFileSync(outPath);
      let blobTemp = new Blob([data], { type: "application/epub+zip" });
      let fileTemp = new File([blobTemp], "config.zip", {
        lastModified: new Date().getTime(),
        type: blobTemp.type,
      });

      OtherUtil.getReaderConfig("isAutoSync") === "yes" &&
        RestoreUtil.restore(
          fileTemp,
          () => {
            isElectron &&
              BackupUtil.backup(
                this.props.books,
                this.props.notes,
                this.props.bookmarks,
                () => {},
                5,
                () => {}
              );
          },
          true
        );
    }
    window.addEventListener("resize", () => {
      this.setState({ width: document.body.clientWidth });
    });
  }
  render() {
    return (
      <div className="header">
        <div className="header-search-container">
          <SearchBox />
        </div>

        <div
          className="header-sort-container"
          onClick={() => {
            this.handleSortBooks();
          }}
        >
          <span className="header-sort-text">
            <Trans>Sort</Trans>
          </span>
          <span className="icon-sort header-sort-icon"></span>
        </div>
        <div
          className="setting-icon-container"
          onClick={() => {
            this.props.handleSetting(true);
          }}
        >
          <span className="icon-setting setting-icon"></span>
        </div>

        <div
          className="import-from-cloud"
          onClick={() => {
            this.props.handleBackupDialog(true);
          }}
          style={
            this.props.isCollapsed && document.body.clientWidth < 950
              ? { width: "42px" }
              : {}
          }
        >
          <div className="animation-mask"></div>
          {this.props.isCollapsed && this.state.width < 950 ? (
            <span
              className="icon-clockwise"
              style={{ fontSize: "20px" }}
            ></span>
          ) : (
            <Trans>Backup and Restore</Trans>
          )}
        </div>
        <ImportLocal
          {...{
            handleDrag: this.props.handleDrag,
          }}
        />
        {isElectron && <UpdateInfo />}
      </div>
    );
  }
}

export default Header;
