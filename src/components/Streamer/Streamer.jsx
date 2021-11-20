import React, { useState, useRef, useEffect } from "react";
import styles from "./Streamer.module.scss";
import RtcMultiConncetion from "rtcmulticonnection-react-js";
import io from "socket.io-client";
import moment from "moment";

// Components imports
import VideoElement from "../Common/VideoElement/VideoElement";
import Chat from "../Common/Chat/Chat";
import Loader from "../Common/Loader/Loader";
import { getEventById, updateEvent } from "../../api";
import { FaEye } from "react-icons/fa";

const Streamer = (props) => {
  const [streamerId, updateStreamerId] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatUsers, setChatUsers] = useState([]);
  const [connectionOpened, setConnectionOpened] = useState(false);
  const [broadcastStopped, setBroadcastStopped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [viewersCount, setViewersCount] = useState(0);
  const eventId = props.match.params.eventId;

  const streamerVideo = useRef();
  const streamerCaption = useRef();
  const startStreamButton = useRef();
  const stopStreamButton = useRef();
  const chatButton = useRef();
  const connection = useRef();
  const socket = useRef();

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

    console.log("connection from useEffect", connection);
    stopStreamButton.current.disabled = true;
    connection.current.connectSocket(function (socket) {
      socket.on("broadcast-stopped", function (broadcastId) {
        alert("Broadcast has been stopped.");
        console.error("broadcast-stopped", broadcastId);
        alert("This broadcast has been stopped.");
      });

      // this event is emitted when a broadcast is absent.
      socket.on("start-broadcasting", function (typeOfStreams) {
        console.log("start-broadcasting", typeOfStreams);
        updateEventStatus("live");

        // host i.e. sender should always use this!
        connection.current.sdpConstraints.mandatory = {
          OfferToReceiveVideo: false,
          OfferToReceiveAudio: false,
        };

        connection.current.session = typeOfStreams;

        // "open" method here will capture media-stream
        // we can skip this function always; it is totally optional here.
        // we can use "connection.getUserMediaHandler" instead
        console.log("connection.current.userid", connection.current.userid);
        console.log("start-broadcasting called**********");
        connection.current.open(connection.current.userid);
      });
    });

    connection.current.onopen = function () {
      console.log("connection opened");

      // connection.current.send(`${streamerId}: Hello everyone!`);
    };

    connection.current.onstream = function (e) {
      console.log("onstream event:", e);
      streamerVideo.current.srcObject = e.stream;
      streamerVideo.current.streamid = e.streamid;
      streamerVideo.current.play();
    };

    connection.current.onleave = function (e) {
      console.log("onleave triggered");
    };

    connection.current.onNumberOfBroadcastViewersUpdated = function (e) {
      setViewersCount(e.numberOfBroadcastViewers);
      if (e.numberOfBroadcastViewers) {
        setConnectionOpened(true);
      } else {
        setConnectionOpened(false);
      }
    };

    setLoading(true);
    getEventById(eventId)
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          setTopic(res.data.event.topic);
          updateStreamerId(res.data.event.user.username);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("err:", err);
      });

    return () => {
      if (connectionOpened) {
        streamerVideo.current.srcObject.stop();
        connection.current.getAllParticipants().forEach(function (nodeId) {
          connection.current.disconnectWith(nodeId);
        });
      }
    };
  }, [eventId]);

  const updateEventStatus = async (status) => {
    setLoading(true);
    const data = {
      eventId,
      status,
    };
    let res = await updateEvent(data);
    setLoading(false);
    if (res.data.success) {
      console.log("event successfully updated");
      if (status === "live") {
        socket.current.emit("broadcast-started");
      } else {
        socket.current.emit("broadcast-stopped");
      }
    } else {
      console.log("error occured.");
    }
  };

  const startStreaming = (e) => {
    if (streamerId === "") {
      alert("Please enter streamer id");
      return;
    }
    e.target.disabled = true;
    stopStreamButton.current.disabled = false;
    console.log("streamerId", streamerId);
    connection.current.extra.broadcastId = streamerId;
    if (!broadcastStopped) {
      console.log("joinStreamer emited ****");
      socket.current.emit("joinStreamer", {
        room: streamerId,
        username: streamerId,
      });
    }

    connection.current.session = {
      audio: true,
      video: true,
      oneway: true,
    };
    connection.current.getSocket(function (socket) {
      socket.emit(
        "check-broadcast-presence",
        streamerId,
        function (isBroadcastExists) {
          if (!isBroadcastExists) {
            // the first person (i.e. real-broadcaster) MUST set his user-id
            connection.current.userid = streamerId;
            console.log(
              "userid set to streamerid",
              connection.current.userid,
              streamerId
            );
          }

          console.log(
            "check-broadcast-presence",
            streamerId,
            isBroadcastExists
          );
          console.log("connection-userid", connection.current.userid);
          console.log("connection.session", connection.current.session);

          socket.emit("join-broadcast", {
            broadcastId: streamerId,
            userid: connection.current.userid,
            typeOfStreams: connection.current.session,
          });
        }
      );
    });

    if (broadcastStopped) {
      console.log("broadcast-resumed message emited");
      socket.current.emit("broadcast-resumed");
      setBroadcastStopped(false);
      setConnectionOpened(true);
    }
  };

  const stopStreaming = (e) => {
    console.log("connection before rem.stream", connection.current);
    e.target.disabled = true;
    startStreamButton.current.disabled = false;
    console.log(
      "streamerVideo.current.streamid",
      streamerVideo.current.streamid
    );

    console.log(
      "stopStreaming attachStreams",
      connection.current.attachStreams
    );

    streamerVideo.current.srcObject.stop();
    connection.current.getAllParticipants().forEach(function (nodeId) {
      connection.current.disconnectWith(nodeId);
    });
    setBroadcastStopped(true);
    setConnectionOpened(false);
    console.log("connection after rem.stream", connection.current);
    console.log(streamerVideo.current.currentTime);
    updateEventStatus("finished");
  };

  const sendMessage = (e) => {
    if (connectionOpened) {
      socket.current.emit("chatMessage", {
        user: streamerId,
        chatMessage,
      });
      setChatMessage("");
    } else {
      setChatMessage("");
      alert("There are no viewers. Wait for connectios and start chating.");
    }
  };

  return (
    <div className={styles.container}>
      {loading && <Loader absolute={true} />}
      <h1 ref={streamerCaption} className={styles.title}>
        {topic}
      </h1>
      <div className={styles.videoChatWrapper}>
        <div className={styles.inputWrapper}>
          <div className={styles.videoContainer}>
            <VideoElement video={streamerVideo} />
          </div>
          <div className={`${styles.startStreaming} ${styles.mtLg}`}>
            <div className={styles.buttonHolder}>
              <div className={styles.buttonInnerWrapper}>
                <button
                  id="videoButton"
                  className={`${styles.startButton} ${styles.btn}`}
                  ref={startStreamButton}
                  onClick={(e) => {
                    startStreaming(e);
                  }}
                >
                  Start Streaming
                </button>
                <button
                  className={`${styles.stopButton} ${styles.btn}`}
                  ref={stopStreamButton}
                  onClick={(e) => {
                    stopStreaming(e);
                  }}
                >
                  Stop Streaming
                </button>
              </div>
              <div className={styles.viewerCounterWrapper}>
                <FaEye color="white" />
                <p>{viewersCount}</p>
              </div>
            </div>
          </div>
        </div>
        <Chat
          currentUser={streamerId}
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
export default Streamer;
