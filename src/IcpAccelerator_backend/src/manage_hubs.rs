use serde::{Deserialize, Serialize};
use candid::CandidType;


#[derive(Serialize, Deserialize, Debug, CandidType)]
pub struct IcpHub {
    id: i32,
    name: String,
    region: String,
}

pub fn get_icp_hubs() -> Vec<IcpHub> {
    vec![
        IcpHub {
            id: 1,
            name: "ICP Hub".to_string(),
            region: "India".to_string(),
        },
        IcpHub {
            id: 2,
            name: "ICP Hub".to_string(),
            region: "Malaysia".to_string(),
        },
        IcpHub {
            id: 3,
            name: "ICP Hub".to_string(),
            region: "Italia".to_string(),
        },
        IcpHub {
            id: 4,
            name: "ICP Hub".to_string(),
            region: "North America".to_string(),
        },
        IcpHub {
            id: 5,
            name: "ICP Hub".to_string(),
            region: "Philippines".to_string(),
        },
        IcpHub {
            id: 6,
            name: "ICP Hub".to_string(),
            region: "Turkey".to_string(),
        },
        IcpHub {
            id: 7,
            name: "ICP Hub".to_string(),
            region: "Indonesia".to_string(),
        },
        IcpHub {
            id: 8,
            name: "ICP Hub".to_string(),
            region: "Korea".to_string(),
        },
        // ... Continue for the second image
        IcpHub {
            id: 9,
            name: "ICP Hub".to_string(),
            region: "East Africa".to_string(),
        },
        IcpHub {
            id: 10,
            name: "ICP Hub".to_string(),
            region: "West Africa".to_string(),
        },
        IcpHub {
            id: 11,
            name: "ICP Hub".to_string(),
            region: "GCC".to_string(),
        },
        IcpHub {
            id: 12,
            name: "ICP Hub".to_string(),
            region: "Germany".to_string(),
        },
        IcpHub {
            id: 13,
            name: "ICP Hub".to_string(),
            region: "Singapore".to_string(),
        },
        IcpHub {
            id: 14,
            name: "ICP Hub".to_string(),
            region: "Bulgaria".to_string(),
        },
        IcpHub {
            id: 15,
            name: "ICP Hub".to_string(),
            region: "LATAM".to_string(),
        },
        // Add any other Hubs from the images provided
    ]
}
