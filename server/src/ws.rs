use futures::{FutureExt, StreamExt};
use serde::Deserialize;
use serde_json::from_str;
use std::collections::HashMap;
use tokio::sync::mpsc;
use tokio_stream::wrappers::UnboundedReceiverStream;
use warp::ws::{Message, WebSocket};

use crate::{Client, Clients, handler, board};

type Dictionary = HashMap<String, String>;

#[derive(Deserialize, Debug)]
struct ClientMessage {
    message: String,
    payload: Option<Dictionary>,
}

pub async fn client_connection(ws: WebSocket, id: String, clients: Clients, mut client: Client) {
    let (client_ws_sender, mut client_ws_rcv) = ws.split();
    let (client_sender, client_rcv) = mpsc::unbounded_channel();

    let client_rcv = UnboundedReceiverStream::new(client_rcv);
    tokio::task::spawn(client_rcv.forward(client_ws_sender).map(|result| {
        if let Err(e) = result {
            eprintln!("error sending websocket msg: {}", e);
        }
    }));

    client.sender = Some(client_sender);
    clients.write().await.insert(id.clone(), client);

    println!("client_id {} connected", id);

    while let Some(result) = client_ws_rcv.next().await {
        let msg = match result {
            Ok(msg) => msg,
            Err(e) => {
                eprintln!("error receiving ws message for id: {}): {}", id.clone(), e);
                break;
            }
        };
        client_msg(&id, msg, &clients).await;
    }

    clients.write().await.remove(&id);
    println!("{} disconnected", id);
}

async fn client_msg(id: &str, msg: Message, clients: &Clients) {
    println!("received message from {}: {:?}", id, msg);
    let message = match msg.to_str() {
        Ok(v) => v,
        Err(_) => return,
    };

    let client_msg: ClientMessage = match from_str(&message) {
        Ok(v) => v,
        Err(e) => {
            eprintln!("Error while parsing client message: {}", e);
            return;
        }
    };

    if client_msg.message == "ping" || client_msg.message == "ping\n" {
        return;
    }

    // If message is "new_game", create a new game and return the starting board state
    if client_msg.message == "new_game" {
        let body = handler::Event {
            user_id: id.parse::<usize>().ok(),
            message: board::STARTING_BOARD.to_string(),
        };
        handler::publish_handler(body, clients.clone()).await.unwrap();
    }

}

