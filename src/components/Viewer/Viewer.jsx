import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./Viewer.module.scss";

// Import npm packages
import moment from "moment";
import io from "socket.io-client";
import RtcMultiConncetion from "rtcmulticonnection-react-js";

// Import components
import VideoElement from "../Common/VideoElement/VideoElement";
import Chat from "../Common/Chat/Chat";
import Loader from "../Common/Loader/Loader";
import { getViewerPageData } from "../../api";

const Viewer = (props) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatUsers, setChatUsers] = useState([]);
  const [viewerId, setViewerId] = useState("");
  const [connectionOpened, setConnectionOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const streamer = props.match.params.username;
  const eventId = props.match.params.eventId;
  const viewerVideo = useRef();
  const viewerCaption = useRef();
  const connection = useRef();
  const chatButton = useRef();
  const socket = useRef();

  const receiveStream = useCallback(
    (shouldEmitJoinStreamer) => {
      console.log("streamer", streamer);
      connection.current.extra.broadcastId = streamer;
      connection.current.session = {
        audio: true,
        video: true,
        oneway: true,
      };

      if (shouldEmitJoinStreamer) {
        console.log("joinStreamer emited ******");
        socket.current.emit("joinStreamer", {
          room: streamer,
          username: connection.current.userid,
        });
      }

      connection.current.getSocket(function (socket) {
        socket.emit(
          "check-broadcast-presence",
          streamer,
          function (isBroadcastExists) {
            if (!isBroadcastExists) {
              // the first person (i.e. real-broadcaster) MUST set his user-id
              connection.current.userid = streamer;
            }

            console.log(
              "check-broadcast-presence",
              streamer,
              isBroadcastExists
            );
            console.log("connection-userid", connection.current.userid);
            console.log("connection.session", connection.current.session);

            socket.emit("join-broadcast", {
              broadcastId: streamer,
              userid: connection.current.userid,
              typeOfStreams: connection.current.session,
            });
          }
        );
      });
    },
    [streamer]
  );

  useEffect(() => {
    socket.current = io.connect("https://fairshost-chat-server.herokuapp.com/");

    socket.current.on("message", (message) => {
      let time = moment().format("h:mm a");
      const msgObject = {
        ...message,
        time,
      };
      setChatMessages((prevState) => {
        return [msgObject, ...prevState];
      });
    });

    socket.current.on("roomUsers", ({ room, users }) => {
      console.log("room:", room, "users:", users);
      setChatUsers(users);
    });

    socket.current.on("reconnect", () => {
      console.log("reconnect message received on viewer");

      setTimeout(function () {
        receiveStream(false);
      }, 1000);
    });

    connection.current = new RtcMultiConncetion();
    connection.current.iceServers = [
      {
        username: "test",
        credential: "test123",
        urls: [
          "turn:104.131.83.116:3478?transport=udp",
          "turn:104.131.83.116:3478?transport=tcp",
        ],
      },
    ];
    connection.current.enableScalableBroadcast = true;
    connection.current.maxRelayLimitPerUser = 1;
    connection.current.autoCloseEntireSession = true;
    connection.current.socketURL = "https://fairshost-be.herokuapp.com/";
    connection.current.socketMessageEvent = "scalable-media-broadcast-demo";

    console.log("connection", connection.current);

    connection.current.connectSocket(function (socket) {
      socket.on("logs", function (log) {
        console.log("logs", log);
        viewerCaption.current.innerHTML = log
          .replace(/</g, "----")
          .replace(/>/g, "___")
          .replace(/----/g, '(<span style="color:#900;">')
          .replace(/___/g, "</span>)");
      });

      socket.on("join-broadcaster", function (hintsToJoinBroadcast) {
        console.log("join-broadcaster", hintsToJoinBroadcast);

        connection.current.session = hintsToJoinBroadcast.typeOfStreams;
        connection.current.sdpConstraints.mandatory = {
          OfferToReceiveVideo: !!connection.current.session.video,
          OfferToReceiveAudio: !!connection.current.session.audio,
        };
        connection.current.broadcastId = hintsToJoinBroadcast.broadcastId;
        connection.current.join(hintsToJoinBroadcast.userid);
      });

      socket.on("rejoin-broadcast", function (broadcastId) {
        console.log("rejoin-broadcast", broadcastId);

        connection.current.attachStreams = [];
        socket.emit(
          "check-broadcast-presence",
          broadcastId,
          function (isBroadcastExists) {
            if (!isBroadcastExists) {
              // the first person (i.e. real-broadcaster) MUST set his user-id
              connection.current.userid = broadcastId;
            }

            socket.emit("join-broadcast", {
              broadcastId: broadcastId,
              userid: connection.current.userid,
              typeOfStreams: connection.current.session,
            });
          }
        );
      });

      socket.on("broadcast-stopped", function (broadcastId) {
        alert("Broadcast has been stopped.");
        // location.reload();
        console.error("broadcast-stopped", broadcastId);
        alert("This broadcast has been stopped.");
      });
    });

    console.log("receive stream called");
    receiveStream(true);
    // setViewerId(connection.current.userid);
    // connection.current.onmessage = function (e) {
    //   let message = e.data;
    //   let remoteUser = e.userid;
    //   let time = moment().format("h:mm a");
    //   let msgObject = {
    //     user: remoteUser,
    //     time,
    //     message,
    //   };
    //   setChatMessages((prevState) => {
    //     return [msgObject, ...prevState];
    //   });
    // };

    connection.current.onopen = function (e) {
      console.log("connection opened");
    };

    connection.current.onstream = function (e) {
      console.log("onstream triggered", "stream:", e.stream);
      connection.current.isUperLeft = false;
      viewerVideo.current.srcObject = e.stream;
      viewerVideo.current.play();
      console.log("onstream attachStreams:", connection.current.attachStreams);
      connection.current.attachStreams = [e.stream];
      connection.current.dontCaptureUserMedia = true;
      connection.current.sdpConstraints.mandatory = {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: false,
      };
      connection.current.getSocket(function (socket) {
        //  socket.emit("can-relay-broadcast"); viewer stream forwarding currently disabled
        // if (connection.current.DetectRTC.browser.name === "Chrome") {
        //   console.log("I am executing can-relay-broadcast section");
        //   console.log("e.userid:", e.userid);
        //   console.log(
        //     "all peers in getAllParticipants:",
        //     connection.current.getAllParticipants()
        //   );
        //   connection.current.getAllParticipants().forEach(function (p) {
        //     console.log("peer in getAllParticipants:", p);
        //     if (p + "" != e.userid + "") {
        //       let peer = connection.current.peers[p].peer;
        //       console.log("concrete peer in getAllParticipants:", peer);
        //       peer.getLocalStreams().forEach(function (localStream) {
        //         console.log(
        //           "local streams of concrete peer in gap:",
        //           localStream
        //         );
        //         peer.removeStream(localStream);
        //       });
        //       e.stream.getTracks().forEach(function (track) {
        //         console.log("tracks os incoming streem in gap:", track);
        //         peer.addTrack(track, e.stream);
        //       });
        //       connection.current.dontAttachStream = true;
        //       connection.current.renegotiate(p);
        //       connection.current.dontAttachStream = false;
        //     }
        //   });
        // }
        // if (connection.current.DetectRTC.browser.name === "Firefox") {
        //   connection.current.getAllParticipants().forEach(function (p) {
        //     if (p + "" != e.userid + "") {
        //       connection.current.replaceTrack(e.stream, p);
        //     }
        //   });
        // }
        // if (connection.current.DetectRTC.browser.name === "Chrome") {
        //   repeatedlyRecordStream(e.stream);
        // }
      });
      // localStorage.setItem(
      //   connection.current.socketMessageEvent,
      //   connection.current.sessionid
      // );
      setConnectionOpened(true);
    };

    connection.current.onstreamended = function (e) {
      console.log("onstreamended triggered");
      console.log(
        "onstreamended attachStreams:",
        connection.current.attachStreams
      );
      viewerVideo.current.srcObject.stop();
      connection.current.attachStreams = [];
      connection.current.getAllParticipants().forEach(function (nodeId) {
        connection.current.disconnectWith(nodeId);
      });

      setConnectionOpened(false);
    };

    setLoading(true);
    getViewerPageData(eventId)
      .then((res) => {
        setLoading(false);
        if (res[0].data.success) {
          setViewerId(res[0].data.user.username);
        }
        if (res[1].data.success) {
          setTopic(res[1].data.event.topic);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("err:", err);
      });
  }, [receiveStream, eventId]);

  const sendMessage = (e) => {
    if (connectionOpened) {
      socket.current.emit("chatMessage", {
        user: connection.current.userid,
        chatMessage,
      });

      setChatMessage("");
    } else {
      setChatMessage("");
      alert("Connection is not established.");
    }
  };

  return (
    <div className={styles.container}>
      {loading && <Loader absolute={true} />}
      <h1 ref={viewerCaption}>{topic}</h1>
      <div className={styles.videoChatWrapper}>
        <div className={styles.inputWrapper}>
          <div className={styles.videoContainer}>
            <VideoElement video={viewerVideo} />
          </div>
        </div>

        <Chat
          currentUser={viewerId}
          setChatMessage={setChatMessage}
          chatMessages={chatMessages}
          sendMessage={sendMessage}
          chatButton={chatButton}
          chatMessage={chatMessage}
          chatUsers={chatUsers}
        />
      </div>
    </div>
  );
};

export default Viewer;
