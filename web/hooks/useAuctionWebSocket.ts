import { useEffect, useState, useRef, useCallback } from "react";

interface WebSocketData {
  currentBid?: number;
  currentBidder?: string;
  bidder?: string;
  amount?: number;
  message?: string;
  startingPrice?: number;
  reservePrice?: number;
  auctionType?: string;
  remainingTime?: number;
}

interface ConnectionStatus {
  message: string;
  type?: "error" | "warning" | "info" | "success";
}

export function useAuctionWebSocket(itemId: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    message: "",
  });
  const [data, setData] = useState<WebSocketData>({});

  const setupWebSocket = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return; // Don't create a new connection if one is already open
    }

    const socket = new WebSocket(
      `ws://localhost:8081/Bidding/biddingSocket/${itemId}`
    );

    socket.onopen = () => {
      console.log("WebSocket connection established");
      reconnectAttempts.current = 0;
      setConnectionStatus({ message: "Connected to auction", type: "success" });
    };

    socket.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        console.log("Received message from server:", newData);

        if (newData.error) {
          setConnectionStatus({ message: newData.error, type: "error" });
          return;
        }

        // Update data state with new information
        setData((prevData) => ({
          ...prevData,
          ...newData,
          currentBid: newData.currentBid ?? prevData.currentBid,
          currentBidder: newData.currentBidder ?? prevData.currentBidder,
          startingPrice: newData.startingPrice ?? prevData.startingPrice,
          reservePrice: newData.reservePrice ?? prevData.reservePrice,
          auctionType: newData.auctionType ?? prevData.auctionType,
          remainingTime: newData.remainingTime ?? prevData.remainingTime,
        }));

        if (newData.message) {
          setConnectionStatus({
            message: newData.message,
            type: newData.error ? "error" : "info",
          });
        }
      } catch (parseError) {
        console.error("Error parsing WebSocket message:", parseError);
        setConnectionStatus({
          message: "Invalid message received from server",
          type: "error",
        });
      }
    };

    socket.onerror = () => {
      console.log("WebSocket connection error, trying again!");
      setConnectionStatus({
        message: "Connection to auction server failed",
        type: "error",
      });
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event);

      if (reconnectAttempts.current < maxReconnectAttempts) {
        const timeout = Math.pow(2, reconnectAttempts.current) * 1000;
        setTimeout(() => {
          reconnectAttempts.current += 1;
          setupWebSocket();
        }, timeout);

        setConnectionStatus({
          message: `Connection lost. Reconnecting (${reconnectAttempts.current}/${maxReconnectAttempts})...`,
          type: "warning",
        });
      } else {
        setConnectionStatus({
          message: "Unable to reconnect. Please refresh the page.",
          type: "error",
        });
      }
    };

    socketRef.current = socket;
  }, [itemId]);

  useEffect(() => {
    setupWebSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [setupWebSocket]);

  const sendMessage = useCallback((message: any) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      setConnectionStatus({
        message: "WebSocket connection is not active. Please try again.",
        type: "error",
      });
      return false;
    }

    try {
      socketRef.current.send(JSON.stringify(message));
      return true;
    } catch (sendError) {
      console.error("Error sending message:", sendError);
      setConnectionStatus({
        message: "Failed to send message. Please try again.",
        type: "error",
      });
      return false;
    }
  }, []);

  return { sendMessage, connectionStatus, data };
}
