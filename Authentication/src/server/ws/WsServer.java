package server.ws;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.apache.tomcat.util.buf.MessageBytes;

@ServerEndpoint("/websocketendpoint")
public class WsServer {

	private static Set<Session> clients = Collections.synchronizedSet(new HashSet<Session>());
	private static ConcurrentHashMap<String, HashSet<Session>> repo = new ConcurrentHashMap<>();
	private static HashSet<Session> toBeNotified = new HashSet<Session>();

	@OnMessage
	public void onMessage(String message, Session session) throws IOException {

		synchronized (clients) {
			// Iterate over the connected sessions
			// and broadcast the received message
			if (message.contains("S1")) {
				HashSet<Session> theList = repo.get("S1");
				if (theList == null) {
					theList = new HashSet<Session>();
				}
				theList.add(session);
				repo.put("S1", theList);
				toBeNotified = theList;
			}
			if (message.contains("S2")) {
				HashSet<Session> theList = repo.get("S2");
				if (theList == null) {
					theList = new HashSet<Session>();
				}
				theList.add(session);
				repo.put("S2", theList);
				toBeNotified = theList;
			}
			if (message.contains("S3")) {
				HashSet<Session> theList = repo.get("S3");
				if (theList == null) {
					theList = new HashSet<Session>();
				}
				theList.add(session);
				repo.put("S3", theList);
				toBeNotified = theList;
			}

			System.out.println("The repo " + repo);
			System.out.println("To be Notified " + toBeNotified);
			for (Session client : toBeNotified) {
				// System.out.println("THE PARAMS " + client.getRequestParameterMap());

				if (!client.equals(session)) {
					System.out.println("THE MESSAGE IS " + message);
					if(!message.contains("--1"))
						client.getBasicRemote().sendText(message);

				}
			}
		}

	}

	@OnOpen
	public void onOpen(Session session) {
		// Add session to the connected sessions set
		clients.add(session);

	}

	@OnClose
	public void onClose(Session session) {
		// Remove session from the connected sessions set
		clients.remove(session);
	}

//	@OnOpen
//	public void onOpen(){
//		System.out.println("Open Connection ...");
//	}
//	
//	@OnClose
//	public void onClose(){
//		System.out.println("Close Connection ...");
//	}

//	@OnMessage
//	public String onMessage(String message){
//		System.out.println("Message from the client: " + message);
//		String echoMsg = "Echo from the server : " + message;
//		return echoMsg;
//	}

	@OnError
	public void onError(Throwable e) {
		e.printStackTrace();
	}

}
