<template>
  <div id="modal" class="modal">
    <span
      class="span_arrow"
      style="left: 10px"
      v-if="modelimage != 0"
      @click="onclicklesser"
      >&lt;</span
    >
    <img id="m_img" style="height: inherit" />
    <span
      class="span_arrow"
      style="right: 10px"
      v-if="modelimage != images.length - 1"
      @click="onclickgreater"
      >&gt;</span
    >
    <span class="span_img" @click="onclickspan">X</span>
    <div class="bottom_img">
      <div v-for="(image, index) in images" :key="index">
        <img
          :src="image.path"
          width="100"
          height="100"
          class="b_img"
          :class="index == modelimage ? 'activeimg' : ''"
          @click="enlargeImg(image.name)"
        />
      </div>
    </div>
  </div>
  <div v-if="senduser" id="outerbox" class="outerbox">
    <div class="header">
      <img
        :src="senduser.profile"
        width="60"
        height="60"
        style="border-radius: 80px"
      />
      <div class="status">
        <label style="font-family: Aboreto; text-shadow: 0 0 3px white">
          <b>{{ senduser.username }}</b></label>
        <label v-if="status[senduser.username]" class="status-text" :style="status[senduser.username] == 'typing...' ? 'color: lawngreen; font-family: unset' : '' ">
          {{ status[senduser.username] }} </label>
        <label v-else class="status-text">{{ "offline" }}</label>
      </div>
    </div>
    <div class="outermsg" id="outermsg" @scroll="onscrolling">
      <div
        :id="index == messageList.length - 1 ? 'lastmessage' : ''"
        v-for="(msg, index) in messageList"
        :key="index"
        :class="msg.reader == senduser.username ? 'sender' : 'receiver'"
      >
        <div
          :class="
            msg.reader == senduser.username ? 'txt receive' : ' txt  send'
          "
        >
          <div v-for="(file, idx) in msg.file" :key="idx">
            <label class="filemsg">
              <img
                src="../assets/file.png"
                width="80"
                height="80"
                @click="checkExist(file)"
              />
              <div class="downoad_name">
                <label style="word-break: break-word; width: 80%">{{
                  file.name
                }}</label>
                <CIcon
                  :icon="cilArrowCircleBottom"
                  width="25"
                  height="25"
                  @click="onClickDownload(file)"
                />
              </div>
            </label>
          </div>
          <div v-for="(file, idx) in msg.image" :key="idx">
            <img
              v-if="file"
              :src="file.path"
              width="300"
              height="300"
              style="border: 2px solid #ffffff7d"
              @click="enlargeImg(file.name)"
            />
          </div>
          <label v-if="msg.message" v-html="msg.message"></label>
          <span
            v-if="msg.reader == senduser.username"
            style="text-align: right"
          >
            <img
              v-if="msg.status == 1"
              src="../assets/singletickwhite.png"
              width="20"
              height="25"
            />
            <img
              v-else-if="msg.status == 2"
              src="../assets/doubletickwhite.png"
              width="25"
              height="25"
            />
            <img
              v-else-if="msg.status == 3"
              src="../assets/doubletickblue.png"
              width="25"
              height="25"
            />
          </span>
          <span class="timespan">{{ msg.time }}</span>
        </div>
      </div>
    </div>
    <div class="sendcontain">
      <label id="unreadcount"></label>
      <CIcon
        :icon="cilChevronBottom"
        width="30"
        height="30"
        id="scrollbottom"
        @click="scrollup"
      />
      <div id="preview"></div>
      <EmojiPicker
        :native="true"
        @select="onSelectEmoji"
        v-if="showemoji"
        class="emoji"
      />
      <div class="txtfilesend">
        <div v-if="showaudiotab" id="emojitext" class="emojitext">
           <audio controls autoplay muted id="mainaudio">
            
          </audio>
        </div>
        <div v-else
          style="
            display: flex;
            align-items: flex-end;
            width: 87%;
            background-color: aliceblue;
            border-radius: 20px;
          "
        >
          <CIcon
            :icon="cilSmile"
            v-if="showemoji == false"
            width="25"
            height="31"
            @click="showemoji = !showemoji"
            class="smiley"
          />
          <CIcon
            :icon="cilX"
            v-else
            width="25"
            height="31"
            @click="showemoji = !showemoji"
            class="smiley"
          />
          <div id="textmsg" class="textmsg" contenteditable="true" @input="onenteringtext"></div>
        </div>
        <label for="file" style="cursor: pointer"
          ><CIcon :icon="cilDescription" width="25" height="25" class="upload"
        /></label>
        <input
          type="file"
          id="file"
          style="display: none; visibility: none"
          multiple="multiple"
          @input="onpreviewImage"
        />
        <!-- <CIcon
          v-if="!showsendbutton"
          id="audiobutton"
          class="sendbtn"
          :icon="cilMic"
          width="25"
          height="25"
          @click="onclickaudio"
        /> -->
        <CIcon
          id="send"
          class="sendbtn"
          :icon="cilSend"
          width="25"
          height="25"
          @click="onsend"
        />
      </div>
    </div>
  </div>
  <div v-else id="chathome" class="chathome">
    <!-- <label class="quotes" >
      <label class="welcome">Welcome {{ $store.state.user.username }} !!</label>
      <br />
      Use Chat app to stay in touch with your Friends and Families. 
      Search option enables you to search for available users by their names.
      Users can able to know who is currently in online and offline.
      Users have the ability to easily share the documents, GIFs, Images via ChatApp. 
      They can able to see the messages are received/read by their recepients or not.</label> -->
  </div>
</template>

<script>
import { CIcon } from "@coreui/icons-vue";
import {
  cilMic,
  cilDescription,
  cilSmile,
  cilX,
  cilSend,
  cilArrowThickToBottom,
  cilArrowCircleBottom,
  cilChevronBottom,
} from "@coreui/icons";
import io from "socket.io-client";
import axios from "axios";
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";

/* eslint-disable */
export default {
  name: "Chatbox",
  components: {
    CIcon,
    EmojiPicker,
  },
  props: {
    senduser: [ Object, String],
    logout: Boolean,
    profile: Boolean,
  },
  emits: {
    addchat: Object,
  },
  data() {
    return {
      showaudiotab: false,
      showsendbutton: false,
      showemoji: false,
      textmessage: "",
      modelimage: 0,
      base: "",
      files: [],
      existfile: {},
      messageList: [],
      status: [],
      images: [],
      m_files: [],
      cilDescription,
      cilSmile,
      cilMic,
      cilX,
      cilSend,
      cilArrowThickToBottom,
      cilArrowCircleBottom,
      cilChevronBottom,
      isScrolling: true,
      unreadMessageChat: [],
    };
  },
  created() {
    this.socket = io("http://localhost:9090", {
      transports: ["websocket"],
      extraHeaders: {
        myheader: "12345",
      },
      withCredentials: true,
    });

    this.socket.on("connect", () => {
      console.log(`Connection made with ${this.socket.id}`);
      this.socket.emit("user_connected", this.$store.state.user.username);
      this.status = [];
    });

    this.socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    this.socket.on("return_message", (data) => {
      if (this.senduser.username == data.reader) {
        this.messageList.push(data);
        this.updateLastMessage(data);
        this.updateImage(data);
        this.scrollup();
      }
    });

    this.socket.on("receive_message", (data) => {
      if(this.status[data.author] && this.status[data.author] == 'typing...')
      this.status[data.author] = 'online'
      if (
        JSON.stringify(this.senduser.username) == JSON.stringify(data.author)
      ) {
        this.messageList.push(data);
        this.updateLastMessage(data);
        this.updateImage(data);
        this.checkElementinViewPort(data._id);
      } else {
        var chatexist = this.$store.state.user.chats.filter((e) => {
          if (JSON.stringify(e.name) == JSON.stringify(data.author)) return e;
        });

        if (chatexist.length > 0) {
          this.updateLastMessage(data);
          this.$store.commit("setUnread", { name: data.author, data: data });
        } else {
          this.$emit("addchat", data);
          this.updateLastMessage(data);
        }

        var r_messageId = this.findMessageId(data.author);
        var msg_allunread = this.$store.state.allunreadmessage[data.author].filter( e => {
          if(e._id == data._id)
          return e
        })
        msg_allunread[0].status = 2;

        this.socket.emit("message_received", {
          messageId: r_messageId,
          data: msg_allunread[0]
        });
      }
    });

    this.socket.on("acknowledge_receive", (data) => {
      if (data.reader == this.senduser.username) {
        var receive_id = this.messageList.findIndex( e => e._id == data._id)
        if(receive_id != -1)
        this.messageList[receive_id].status = 2;
      }
      this.updateLastMessage(data);
    });

    this.socket.on("acknowledge_read", (data) => {
      console.log("acknowledge read", data);
      if (Array.isArray(data)) {
        if (data[0].reader == this.senduser.username) {
          data.forEach((ele) => {
            var read_id2 = this.messageList.findIndex( e => e._id == ele._id)
            if(read_id2 != -1)
            this.messageList[read_id2].status = 3;
          });
        }
        data[data.length - 1].status = 3;
        this.updateLastMessage(data[data.length-1])
      } else {
        if (data.reader == this.senduser.username) {
          var read_id1 = this.messageList.findIndex( e => e._id == data._id)
          if( read_id1 != -1)
          this.messageList[read_id1].status = 3;
        }
        data.status = 3;
        this.updateLastMessage(data)
      }
    });

    this.socket.on("online", (names) => {
      names.forEach((element) => {
        this.status[element] = "online";
      });
    });

    this.socket.on("offline", (name) => {
      this.status[name] = "offline";
    });

    this.socket.on("error_message", (error) => {
      console.log("err_msg", error);
    });

    this.socket.on('on-start-typing', (data) => {
      if(this.status[data])
        this.status[data] = 'typing...'
      if(!this.senduser.username != data) {
        if(this.$store.state.lastmessage[data]) 
          this.$store.state.lastmessage[data].typing = true
      }
    })

    this.socket.on('on-finish-typing', (data) => {
      if(this.status[data])
        this.status[data] = 'online'
      if(this.senduser.username != data) {
        if(this.$store.state.lastmessage[data]) 
          this.$store.state.lastmessage[data].typing = false
      }
    })
  },
  watch: {
    profile: {
      handler(newValue) {
        var outerbox = document.getElementById("outerbox");
        var chathome = document.getElementById("chathome");
        if (newValue == true) {
          if (outerbox) outerbox.style.display = "none";
          if (chathome) chathome.style.display = "none";
        } else {
          if (outerbox) outerbox.style.display = "grid";
        }
      },
    },
    senduser: {
      handler(newValue) {
        if(this.$store.state.lastmessage[newValue.username])
          this.$store.state.lastmessage[newValue.username].typing = false
        if (newValue) {
          this.messageList = [];
          this.images = [];
          var messageId = this.findMessageId(newValue.username);
          if (messageId.length > 0) {
            axios
              .post(`${this.$store.state.remoteurl}getmsg/${messageId[0].id}`)
              .then((res) => {
                if (res.data.status == "success") {
                  this.messageList = res.data.data.messages;
                  if (
                    this.$store.state.allunreadmessage[
                      this.senduser.username
                    ] &&
                    this.$store.state.allunreadmessage[this.senduser.username]
                      .length > 0
                  ) {
                    this.$store.state.allunreadmessage[
                      this.senduser.username
                    ].forEach((e) => {
                      var existlength = this.messageList.filter(ele => {
                        if(ele._id == e._id)
                        return ele
                      })
                      if(existlength.length == 0)
                      this.messageList.push(e);
                      this.unreadMessageChat.push(e);
                    });
                  }
                  this.scrollup();
                  this.messageList.forEach((element) => {
                    this.updateImage(element);
                    // this.checkFile(element);
                  });
                  this.$store.commit("removeUnread", this.senduser.username);
                } else this.messageList = [];
              })
              .catch((err) => {
                this.messageList = [];
              });
          }
        }
      },
      immediate: true,
    },
    logout: {
      handler(newValue) {
        if (newValue == true) {
          this.socket.emit(
            "user_disconnected",
            this.$store.state.user.username
          );
        }
      },
    },
  },
  methods: {
    onclickaudio() {
      this.showaudiotab = true
      // this.showsendbutton = true
      var mediaDevice = navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      var audioChunks = [];

        mediaDevice.then(stream => {
          var mediaRecorder = new MediaRecorder(stream)
          mediaRecorder.start();

          mediaRecorder.addEventListener("dataavailable", event => {
            var audiofile = new File([event.data], 'audio1')
            console.log(audiofile, event.data)
            audioChunks.push(event.data)
          })

          mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            console.log(audioUrl)
            var mainaudio = document.getElementById('mainaudio');
            mainaudio.innerHTML = '<source src='+ audioUrl +' type="audio/webm" /> '
          });

          setTimeout(() => {
            mediaRecorder.stop();
          }, 3000);
      })
    },
    onenteringtext(event) {
      if(event.target.innerText == '')
      this.socket.emit('finish-typing', { sender: this.$store.state.user.username, receiver: this.senduser.username })
      // this.showsendbutton = false
      else
      this.socket.emit('start-typing', { sender: this.$store.state.user.username, receiver: this.senduser.username })
      // this.showsendbutton = true
    },
    findMessageId(username) {
      var foundmessageId = this.$store.state.user.chats.filter((e) => {
        if (JSON.stringify(e.name) == JSON.stringify(username)) return e;
      });
      return foundmessageId;
    },
    onscrolling() {
      var scrollheight = document.getElementById("outermsg").scrollHeight;
      var scrolldiv = document.getElementById("outermsg").scrollTop;
      var scrollbutton = document.getElementById("scrollbottom");
      if (scrolldiv + 600 < scrollheight) {
        this.isScrolling = true;
        scrollbutton.style.display = "block";
      } else {
        this.isScrolling = false;
        if (this.unreadMessageChat.length > 0) {
          var unread = document.getElementById("unreadcount");
          unread.style.display = "none";
        }
        var msgLst = this.messageList[this.messageList.length - 1];
        if (
          msgLst != null &&
          JSON.stringify(msgLst.author) ==
            JSON.stringify(this.senduser.username) &&
          msgLst.status &&
          msgLst.status != 3
        ) {
          this.unreadMessageChat.forEach((ele) => {
            var updateMsgId1 = this.messageList.findIndex( e => e._id == ele._id)
            if( updateMsgId1 != -1)
            this.messageList[updateMsgId1].status = 3;
          });
          var s_messageId = this.findMessageId(msgLst.author);
          this.socket.emit("read_message", {
            messageId: s_messageId,
            data: this.unreadMessageChat,
          });
          console.log("_read_onscroll", this.unreadMessageChat);
          this.unreadMessageChat = [];
        }
        scrollbutton.style.display = "none";
      }
    },
    checkElementinViewPort(id) {
      var receiveMsgIndex = this.messageList.findIndex( e => e._id == id)
      setTimeout(() => {
        var unread = document.getElementById("unreadcount");
        var lastElement = document.getElementById("lastmessage");
        if (lastElement != null && receiveMsgIndex != -1) {
          var bounding = lastElement.getBoundingClientRect();
          if (
            bounding.top >= 0 &&
            bounding.left >= 0 &&
            bounding.right <= window.innerWidth &&
            bounding.bottom <= window.innerHeight
          ) {
            var cr_messageId = this.findMessageId(
              this.messageList[receiveMsgIndex].author
            );
            this.messageList[receiveMsgIndex].status = 3;
            this.socket.emit("read_message", {
              messageId: cr_messageId,
              data: this.messageList[receiveMsgIndex],
            });
            this.scrollup();
            console.log("inside viewport");
          } else {
            var c_messageId = this.findMessageId(
              this.messageList[receiveMsgIndex].author
            );
            this.messageList[receiveMsgIndex].status = 2;
            this.socket.emit("message_received", {
              messageId: c_messageId,
              data: this.messageList[receiveMsgIndex],
            });
            this.isScrolling = true;
            this.unreadMessageChat.push(this.messageList[receiveMsgIndex]);
            unread.innerHTML = this.unreadMessageChat.length;
            unread.style.display = "flex";
          }
        }
      }, 1);
    },
    playSound() {
      var audio = new Audio(require("../assets/sendsound.mp3"));
      audio.play();
    },
    async checkExist(file) {
      await fetch(file.path)
        .then((res) => {
          if (res.status == 200) {
            this.existfile[file.name] = true;
          }
        })
        .catch((err) => {
          this.existfile[file.name] = false;
        });
    },
    onClickDownload(file) {
      if (file.path.toString().startsWith("blob")) {
        let link = document.createElement("a");
        link.download = file.name;
        link.href = file.path;
        link.click();
        URL.revokeObjectURL(link.href);
      } else {
        let h_link = document.createElement("a");
        h_link.download = file.name;
        let blob = new Blob([file.path]);
        h_link.href = URL.createObjectURL(blob);
        h_link.click();
        URL.revokeObjectURL(h_link.href);
      }
    },
    onclicklesser() {
      this.enlargeImg(this.images[this.modelimage - 1].name);
    },
    onclickgreater() {
      this.enlargeImg(this.images[1 + this.modelimage].name);
    },
    onclickspan() {
      var s_modal = document.getElementById("modal");
      s_modal.style.display = "none";
    },
    enlargeImg(index) {
      var select_index = this.images.findIndex((ele) => ele.name == index);
      var modal = document.getElementById("modal");
      modal.style.display = "flex";
      modal.style.alignItems = "center";
      modal.style.justifyContent = "center";
      var m_img = document.getElementById("m_img");
      this.modelimage = select_index;
      m_img.src = this.images[select_index].path;
    },
    onSelectEmoji(emoji) {
      var txt1 = document.getElementById("textmsg");
      txt1.innerText += emoji.i;
    },
    onpreviewImage(event) {
      for (var it = 0; it < event.target.files.length; it++) {
        this.files.push({
          name: event.target.files[it].name,
          path: event.target.files[it],
        });
        var i = event.target.files[it].type.toString().startsWith("image")
          ? "img"
          : "noimg";
        var image = URL.createObjectURL(event.target.files[it]);
        var imagediv = document.getElementById("preview");
        var newimg =
          i == "img"
            ? document.createElement("img")
            : document.createElement("div");
        var addlabel = document.createElement("label");
        var close = document.createElement("label");
        close.innerText = "X";
        close.setAttribute("id", `${it + 1}`);
        newimg.setAttribute("id", `${(it + 1) * 100}`);
        close.setAttribute(
          "style",
          "background-color: #4c4747; padding:1px 4px; border-radius: 15px; border: 2px solid white; height: fit-content; margin-left: -40px; margin-top:3px; margin-right:20px; font-weight: bold; box-shadow: 0px 0px 3px black"
        );
        addlabel.setAttribute(
          "style",
          "padding: 20px; font-size: 50px; background-color: #5f5b5b; border-radius: 10px;"
        );
        addlabel.setAttribute("for", "file");
        addlabel.innerText = "+";
        if (i == "img") newimg.src = image;
        newimg.setAttribute("style", "width: 100px; height: 100px");
        if (i == "noimg") {
          var filename = document.createElement("label");
          var filelogo = document.createElement("img");
          filelogo.src = require("../assets/file.png");
          filename.innerHTML = `${event.target.files[it].name.substring(
            0,
            8
          )}...`;
          newimg.appendChild(filelogo);
          newimg.appendChild(filename);
          filelogo.setAttribute(
            "style",
            "width: 50px; height: 50px; padding: 0px 25px"
          );
          newimg.setAttribute(
            "style",
            " background-color: #282626; width: 100px; height: 100px; display: flex; justify-content: center; align-items: center; flex-direction:column; gap: 10px;"
          );
        }
        imagediv.classList.add("preview");
        if (!imagediv.lastChild) {
          imagediv.appendChild(newimg);
          imagediv.appendChild(close);
          imagediv.appendChild(addlabel);
        } else {
          var count = imagediv.lastChild;
          imagediv.replaceChild(newimg, count);
          imagediv.appendChild(close);
          imagediv.appendChild(addlabel);
          imagediv.scrollLeft += 110;
        }

        close.addEventListener("click", (ele) => {
          var childclose = document.getElementById(ele.target.id);
          var child = document.getElementById(ele.target.id * 100);
          imagediv.removeChild(child);
          imagediv.removeChild(childclose);
          if (imagediv.childElementCount == 1) {
            imagediv.removeChild(imagediv.children[0]);
            imagediv.classList.remove("preview");
          }
          this.files.splice(1 - ele.target.id, 1);
        });
      }
    },
    onsend(event) {
      var data = {};
      var filelink = [];
      var imagelink = [];
      event.preventDefault();
      var txt = document.getElementById("textmsg").innerText;
      var hour = new Date().getHours();
      hour = hour < 10 ? "0" + hour : hour;
      var mins = new Date().getMinutes();
      mins = mins < 10 ? "0" + mins : mins;
      var time = hour + ":" + mins;
      if (this.files.length > 0 || txt != "") {
        this.playSound();
        this.files.forEach((element) => {
          if (element.path.type.toString().startsWith("image"))
            imagelink.push({
              name: element.name,
              path: URL.createObjectURL(element.path),
            });
          else
            filelink.push({
              name: element.name,
              path: URL.createObjectURL(element.path),
            });
        });
        var _id = new Date().valueOf();
        data = {
          _id: _id,
          message: txt != "" ? txt : "",
          reader: this.senduser.username,
          author: this.$store.state.user.username,
          time: time,
          file: filelink.length > 0 ? filelink : "",
          image: imagelink.length > 0 ? imagelink : "",
          status: 1,
        };
        this.socket.emit("send_message", data);
        this.messageList.push(data);
        this.updateLastMessage(data);
        this.updateImage(data);
        var formdata = new FormData();
        for (const z of Object.keys(this.files)) {
          formdata.append("file", this.files[z].path);
        }
        formdata.append("_id", _id);
        formdata.append("message", txt != "" ? txt : "");
        formdata.append("reader", this.senduser.username);
        formdata.append("author", this.$store.state.user.username);
        formdata.append("time", time);
        formdata.append("status", 1);
        this.scrollup();
        axios
          .post("http://localhost:2020/upload", formdata, {
            header: {
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
              type: "formData",
            },
          })
          .then((res) => {
            console.log("axios", res);
            var chatexist1 = this.$store.state.user.chats.filter(e => {
            if(JSON.stringify(e.name) == JSON.stringify(data.reader))
            return e;
            })

            if( chatexist1.length == 0) {
              this.$emit('addchat', data )
            }
          })
          .catch((err) => {
            console.log("axios", err);
          });
        document.getElementById("textmsg").innerText = "";
        var imgdiv = document.getElementById("preview");
        var count_node = imgdiv.childElementCount;
        for (var n = 0; n < count_node; n++) {
          imgdiv.children[n].innerHTML = null;
          if (n == count_node - 1) {
            imgdiv.classList.remove("preview");
            imgdiv.innerHTML = null;
          }
        }
        this.files = [];
      }
    },
    scrollup() {
      var obj = document.getElementById("outermsg");
      setTimeout(() => {
        obj.scroll({
          top: obj.scrollHeight,
          behavior: "smooth",
        });
        if (this.unreadMessageChat.length > 0) {
          var unread = document.getElementById("unreadcount");
          unread.style.display = "none";
        }
        this.isScrolling = false;
        var msgLst = this.messageList[this.messageList.length - 1];
        if (
          JSON.stringify(msgLst.author) ==
            JSON.stringify(this.senduser.username) &&
          msgLst.status &&
          msgLst.status != 3
        ) {
          this.unreadMessageChat.forEach((ele) => {
            var updateMsgId = this.messageList.findIndex( e => e._id == ele._id)
            if( updateMsgId != -1)
            this.messageList[updateMsgId].status = 3;
          });
          if (this.unreadMessageChat.length > 0) {
            var su_messageId = this.findMessageId(
              this.unreadMessageChat[0].author
            );
            this.socket.emit("read_message", {
              messageId: su_messageId,
              data: this.unreadMessageChat,
            });
          }
          console.log("_read_scrollup", this.unreadMessageChat);
          this.unreadMessageChat = [];
        }
      }, 1);
    },
    updateLastMessage(data) {
      var name =
        this.$store.state.user.username == data.author
          ? data.reader
          : data.author;
      if (data.message) {
        this.$store.commit("updateLastmessage", {
          name: name,
          msg: { message: data.message, author: data.author, status: data.status },
        });
      } else if (data.image) {
        this.$store.commit("updateLastmessage", { name: name, msg: { message: "Photo", author: data.author, status: data.status } });
      } else {
        this.$store.commit("updateLastmessage", { name: name, msg: { message: "File", author: data.author, status: data.status } });
      }
    },
    updateImage(data) {
      if (data.image && data.image.length > 0) {
        if (data.image.length > 1) {
          data.image.forEach((ele) => {
            this.images.push(ele);
          });
        } else this.images.push(data.image[0]);
      }
    },
    checkFile(data) {
      if (data.file && data.file.length > 0) {
        if (data.file.length > 1) {
          data.file.forEach((ele) => {
            this.checkExist(ele);
          });
        } else this.checkExist(data.file[0]);
      }
    },
  },
};
</script>

<style scoped>

audio {
  width: 100%;
  height: 100%;
  background-color: aliceblue;
  color: #007589;
  border-radius: 20px;
}

.header {
  background-color: #00a4ca;
  padding: 1%;
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 30px;
}

.textmsg {
  display: inline-block;
  border: none;
  padding: 10px;
  border-bottom-right-radius: 20px;
  border-top-right-radius: 20px;
  background-color: aliceblue;
  color: #25344f;
  font-size: 20px;
  width: 95%;
  overflow-wrap: anywhere;
  overflow-y: auto;
  max-height: 70px;
  scroll-behavior: smooth;
}

.outerbox {
  height: 99vh;
  display: grid;
  grid-template-rows: 10% 78% 10%;
  background-image: url("../assets/doodles.jpg");
  /* background-repeat: no-repeat; */
  /* background-size: 100% 100%; */
}

.sendbtn {
  padding: 10px;
  border-radius: 30px;
  color: white;
  background-color: #20768a;
  border: none;
}

.sendcontain {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: column;
  gap: 10px;
  /* margin-bottom: 1%; */
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  width: 5px;
  background: #888;
  border-radius: 30px;
}

.textmsg:focus {
  outline: none;
}

.outermsg {
  width: 99%;
  /* height: 580px; */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 5px;
}

.sender {
  margin: 1% 0px;
  width: 50%;
  display: flex;
  justify-content: flex-end;
  margin-left: 50%;
}

.receiver {
  margin: 1% 0px;
  width: 50%;
  display: flex;
  justify-content: flex-start;
}

.txt {
  padding: 10px;
  background-color: darkgray;
  color: white;
  font-size: 17px;
  font-family: system-ui;
  text-align: justify;
  display: flex;
  flex-direction: column;
  gap: 5px;
  white-space: break-spaces;
}

.send {
  background-color: #1f4a60;
  color: white;
  border-radius: 0px 15px 15px 15px;
}

.receive {
  background-color: #263550;
  border-radius: 15px 0px 15px 15px;
}

.timespan {
  display: flex;
  justify-content: flex-end;
  /* color: #8e8a8a; */
  font-size: 14px;
}

.status {
  display: flex;
  flex-direction: column;
}

.chathome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url('https://www.searchenginejournal.com/wp-content/uploads/2021/09/16-reasons-why-social-media-is-important-to-your-company-616d3200e6dc6-sej-760x400.webp');
}

.welcome {
  /* color: #00a4ca; */
  font-size: 50px;
  font-family: math;
  padding: 2%;
  font-style: italic;
}

.upload {
  padding: 10px;
  background-color: aliceblue;
  border-radius: 30px;
  color: #007589;
}

.txtfilesend {
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: flex-end;
  width: 100%;
}

.preview {
  background-color: #f0f8ff99;
  display: flex;
  gap: 10px;
  padding: 10px;
  width: 70%;
  overflow-x: scroll;
  border-radius: 10px;
  position: fixed;
  bottom: 10%;
}

.addbtn {
  font-size: 50px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #5f5b5b;
  border-radius: 10px;
}

.filemsg {
  width: 280px;
  display: flex;
  gap: 10px;
  background-color: #326e7a6b;
  padding: 10px;
  border-radius: 10px;
  margin: 2px 0px;
  align-items: center;
}

.smiley {
  color: #007488;
  background-color: #eff8ff;
  padding: 6px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}

.modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.9);
}

.span_img {
  position: fixed;
  top: 20px;
  right: 20px;
  font-size: 30px;
  text-shadow: 0px 0px 10px black;
  cursor: pointer;
}

.bottom_img {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background-color: #1f1c1cad;
  position: fixed;
  bottom: 0px;
  width: 100vw;
  padding: 10px 0px;
  overflow-x: auto;
}

.b_img {
  /* border: 2px solid black; */
  border-radius: 10px;
  cursor: pointer;
}

.b_img:hover:not(.activeimg) {
  box-shadow: 0px 0px 15px black;
}

.activeimg {
  border: 2px solid white;
}

.span_arrow {
  position: fixed;
  font-size: 50px;
  text-shadow: 0px 0px 10px black;
  cursor: pointer;
}

.emoji {
  z-index: 1;
  position: absolute;
  bottom: 10%;
  left: 27%;
}

.downoad_name {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

#scrollbottom {
  position: absolute;
  right: 55px;
  bottom: 90px;
  border-radius: 50%;
  background: #007589;
  color: #eff8ff;
  padding: 10px;
  box-shadow: 0px 0px 10px black;
  display: none;
}

#unreadcount {
  font-size: 20px;
  background-color: mediumseagreen;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  position: absolute;
  display: none;
  align-items: center;
  justify-content: center;
  bottom: 125px;
  right: 40px;
  z-index: 1;
  box-shadow: 0px 0px 10px green;
}

.emojitext {
  width: 87%;
  height: 45px;
  border-radius: 20px;
  background: aliceblue;
}

.quotes {
  font-family: ui-rounded;
  font-style: italic;
  width: 40%;
  padding: 10%;
  font-size: 23px;
  background-color: #607d8ba3;
  color: white;
  text-align: center;
}

.status-text {
  font-size: 19px; 
  font-family: system-ui;
}
</style>