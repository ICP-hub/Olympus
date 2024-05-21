use serde::{Deserialize, Serialize};
use candid::CandidType;


#[derive(Serialize, Deserialize, Debug, CandidType)]
pub struct Areas {
    id: i32,
    name: String,
}

pub fn get_areas() -> Vec<Areas> {
    vec![
        Areas {
            id: 1,
            name: "DeFi".to_string(),
        },
        Areas {
            id: 2,
            name: "Tooling".to_string(),
        },
        Areas {
            id: 3,
            name: "NFTs".to_string(),
        },
        Areas {
            id: 4,
            name: "Infrastructure".to_string(),
        },
        Areas {
            id: 5,
            name: "DAO".to_string(),
        },
        Areas {
            id: 6,
            name: "Social".to_string(),
        },
        Areas {
            id: 7,
            name: "Games".to_string(),
        },
        Areas {
            id: 8,
            name: "Others".to_string(),
        },
        Areas {
            id: 9,
            name: "Metaverse".to_string(),
        },
        Areas {
            id: 10,
            name: "AI".to_string(),
        },
    ]
}