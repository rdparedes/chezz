use std::{collections::HashMap, convert::Infallible, sync::Arc};
use tokio::sync::{mpsc, RwLock};
use warp::{ws::Message, Filter, Rejection};

mod handler;
mod ws;
mod board;

#[derive(Debug, Clone)]
pub struct Client {
    pub user_id: usize,
    // pub topics: Vec<String>,
    pub sender: Option<mpsc::UnboundedSender<std::result::Result<Message, warp::Error>>>,
}

type Result<T> = std::result::Result<T, Rejection>;
type Clients = Arc<RwLock<HashMap<String, Client>>>;

#[tokio::main]
async fn main() {
    let clients: Clients = Arc::new(RwLock::new(HashMap::new()));

    let health_route = warp::path!("healthcheck").and_then(handler::health_handler);

    let register = warp::path("register");
    let register_routes = register
        .and(warp::post())
        .and(warp::body::json())
        .and(with_clients(clients.clone()))
        .and_then(handler::register_handler)
        .or(register
            .and(warp::delete())
            .and(warp::path::param())
            .and(with_clients(clients.clone()))
            .and_then(handler::unregister_handler));

    let publish = warp::path!("publish")
        .and(warp::body::json())
        .and(with_clients(clients.clone()))
        .and_then(handler::publish_handler);

    let ws_route = warp::path("ws")
        .and(warp::ws())
        .and(warp::path::param())
        .and(with_clients(clients.clone()))
        .and_then(handler::ws_handler);

    let cors = warp::cors()
        .allow_any_origin()
        .allow_methods(vec!["OPTIONS", "GET", "POST"])
        .allow_headers(vec![
            "Access-Control-Allow-Origin",
            "Access-Control-Request-Headers",
            "Origin",
            "Accept",
            "X-Requested-With",
            "Content-Type",
            "Authorization",
        ])
        .expose_headers(vec!["Access-Control-Allow-Origin"]);

    let log =
        warp::log::custom(|info| eprintln!("{} {} {}", info.method(), info.path(), info.status(),));

    let routes = health_route
        .or(register_routes)
        .or(ws_route)
        .or(publish)
        .with(cors)
        .with(log);

    warp::serve(routes).run(([127, 0, 0, 1], 9160)).await;
}

fn with_clients(clients: Clients) -> impl Filter<Extract = (Clients,), Error = Infallible> + Clone {
    warp::any().map(move || clients.clone())
}
