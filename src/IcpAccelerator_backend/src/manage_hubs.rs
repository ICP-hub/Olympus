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
            name: "ICP Hub, India".to_string(),
            region: "".to_string(),
        },
        IcpHub {
            id: 2,
            name: "ICP Hub, Malaysia".to_string(),
            region: "".to_string(),
        },
        IcpHub {
            id: 3,
            name: "ICP Hub, Italia".to_string(),
            region: "".to_string(),
        },
        IcpHub {
            id: 4,
            name: "ICP Hub, North America".to_string(),
            region: "".to_string(),
        },
        IcpHub {
            id: 5,
            name: "ICP Hub, Philippines".to_string(),
            region: "".to_string(),
        },
        IcpHub {
            id: 6,
            name: "ICP Hub, Turkey".to_string(),
            region: "".to_string(),
        },
        IcpHub {
            id: 7,
            name: "ICP Hub, Indonesia".to_string(),
            region: "".to_string(),
        },
        IcpHub {
            id: 8,
            name: "ICP Hub, Korea".to_string(),
            region: "".to_string(),
        },
        // ... Continue for the second image
        IcpHub {
            id: 9,
            name: "ICP Hub, East Africa".to_string(),
            region: "".to_string(),
        },
        IcpHub {
            id: 10,
            name: "ICP Hub, West Africa".to_string(),
            region: "".to_string(),
        },
        IcpHub {
            id: 11,
            name: "ICP Hub, GCC".to_string(),
            region: "".to_string(),
        },
        IcpHub {
            id: 12,
            name: "ICP Hub, Germany".to_string(),
            region: "".to_string(),
        },
        IcpHub {
            id: 13,
            name: "ICP Hub, Singapore".to_string(),
            region: "".to_string(),
        },
        IcpHub {
            id: 14,
            name: "ICP Hub, Bulgaria".to_string(),
            region: "".to_string(),
        },
        IcpHub {
            id: 15,
            name: "ICP Hub, LATAM".to_string(),
            region: "".to_string(),
        },
        // Add any other Hubs from the images provided
    ]
}
