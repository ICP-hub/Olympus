use candid::CandidType;
use serde::{Deserialize, Serialize};
use ic_cdk_macros::*;
use crate::constant_api::manage_hubs::*;
use crate::guard::*;

#[derive(CandidType)]
pub struct UserType {
    pub id: i32,
    pub role_type: String,
}

#[query(guard = "is_user_anonymous")]
pub fn type_of_user_profile() -> Vec<UserType> {
    vec![
        UserType {
            id: 1,
            role_type: "Individual".to_string(),
        },
        UserType {
            id: 2,
            role_type: "DAO".to_string(),
        },
        UserType {
            id: 2,
            role_type: "Company".to_string(),
        },
    ]
}

#[query(guard = "is_user_anonymous")]
pub fn get_multichain_list() -> Vec<String> {
    let chains = vec![
        "Ethereum".to_string(),
        "Polygon".to_string(),
        "Arbitrum".to_string(),
        "Optimism".to_string(),
        "Base".to_string(),
        "zkSync".to_string(),
        "Avalanche".to_string(),
        "Gnosis".to_string(),
        "BNB".to_string(),
        "Scroll".to_string(),
        "Moonbeam".to_string(),
        "Aurora".to_string(),
        "Linea".to_string(),
        "Fantom".to_string(),
        "Mantle".to_string(),
        "Axelar".to_string(),
        "Zora Network".to_string(),
        "Solana".to_string(),
        "Celo".to_string(),
        "Boba".to_string(),
        "Metis".to_string(),
        "Harmony".to_string(),
        "Kava".to_string(),
        "Klaytn".to_string(),
        "Polkadot".to_string(),
        "Skale".to_string(),
        "Shardeum Sphinx".to_string(),
        "Filecoin".to_string(),
        "Cronos".to_string(),
        "Telos".to_string(),
        "Reef".to_string(),
        "Celestia".to_string(),
        "Zeta".to_string(),
        "Evmos".to_string(),
        "Osmosis".to_string(),
        "Nordek".to_string(),
    ];
    chains
}

#[query(guard = "is_user_anonymous")]
pub fn get_investment_stage() -> Vec<String> {
    vec![
        "Pre-MVP".to_string(),
        "MVP to initial traction".to_string(),
        "Growing traction".to_string(),
        "We do NOT currently invest".to_string(),
    ]
}

#[query(guard = "is_user_anonymous")]
pub fn get_range_of_check_size() -> Vec<String> {
    vec![
        "<$500k".to_string(),
        "$500k-$2M".to_string(),
        "$2-5M".to_string(),
        "$5-10M".to_string(),
        "Above $10M".to_string(),
    ]
}

#[derive(Serialize, Deserialize, Debug, CandidType)]
pub struct JobCategory {
    id: i32,
    name: String,
}

#[query(guard = "is_user_anonymous")]
pub fn get_job_category() -> Vec<JobCategory> {
    vec![
        JobCategory {
            id: 1,
            name: "JOBS".to_string(),
        },
        JobCategory {
            id: 2,
            name: "BOUNTY".to_string(),
        },
        JobCategory {
            id: 3,
            name: "RFP".to_string(),
        },
    ]
}

#[derive(CandidType)]
pub struct JobType {
    pub id: i32,
    pub job_type: String,
}

#[query(guard = "is_user_anonymous")]
pub fn type_of_job() -> Vec<JobType> {
    vec![
        JobType {
            id: 1,
            job_type: "Full-Time".to_string(),
        },
        JobType {
            id: 2,
            job_type: "Part-Time".to_string(),
        },
        JobType {
            id: 3,
            job_type: "Internship".to_string(),
        },
        JobType {
            id: 4,
            job_type: "Contract".to_string(),
        },
    ]
}

#[derive(Serialize, Deserialize, Debug, CandidType)]
pub struct Areas {
    id: i32,
    name: String,
}

#[query(guard = "is_user_anonymous")]
pub fn get_area_focus_expertise() -> Vec<Areas> {
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

#[query(guard = "is_user_anonymous")]
pub fn get_icp_hubs_candid() -> Vec<IcpHub> {
    vec![
        IcpHub {
            id: 1,
            name: "ICP Hub".to_string(),
            region: "Bulgaria".to_string(),
        },
        IcpHub {
            id: 2,
            name: "ICP Hub".to_string(),
            region: "Brazil".to_string(),
        },
        IcpHub {
            id: 3,
            name: "ICP Hub".to_string(),
            region: "Canada".to_string(),
        },
        IcpHub {
            id:4,
            name: "ICP Hub".to_string(),
            region: "China".to_string(),
        },
        IcpHub {
            id: 5,
            name: "ICP Hub".to_string(),
            region: "East Africa".to_string(),
        },
        IcpHub {
            id: 6,
            name: "ICP Hub".to_string(),
            region: "Germany".to_string(),
        },
        IcpHub {
            id: 7,
            name: "ICP Hub".to_string(),
            region: "Holland".to_string(),
        },
        IcpHub {
            id: 8,
            name: "ICP Hub".to_string(),
            region: "Honkong".to_string(),
        },
        IcpHub {
            id: 9,
            name: "ICP Hub".to_string(),
            region: "India".to_string(),
        },
        IcpHub {
            id: 10,
            name: "ICP Hub".to_string(),
            region: "Indonesia".to_string(),
        },
        // ... Continue for the second image
        IcpHub {
            id: 11,
            name: "ICP Hub".to_string(),
            region: "Italia".to_string(),
        },
        IcpHub {
            id: 12,
            name: "ICP Hub".to_string(),
            region: "Italy".to_string(),
        },
        IcpHub {
            id: 13,
            name: "ICP Hub".to_string(),
            region: "Kenya".to_string(),
        },
        IcpHub {
            id: 14,
            name: "ICP Hub".to_string(),
            region: "Korea".to_string(),
        },
        IcpHub {
            id: 15,
            name: "ICP Hub".to_string(),
            region: "Malaysia".to_string(),
        },
        IcpHub {
            id: 16,
            name: "ICP Hub".to_string(),
            region: "Mexico".to_string(),
        },
        IcpHub {
            id: 17,
            name: "ICP Hub".to_string(),
            region: "Nigeria".to_string(),
        },
        IcpHub {
            id: 18,
            name: "ICP Hub".to_string(),
            region: "North America".to_string(),
        },
        IcpHub {
            id: 19,
            name: "ICP Hub".to_string(),
            region: "Philippines".to_string(),

        },
        IcpHub {
            id: 20,
            name: "ICP Hub".to_string(),
            region: "Poland".to_string(),
        },
        IcpHub {
            id: 21,
            name: "ICP Hub".to_string(),
            region: "Portugal".to_string(),
        },
        IcpHub {
            id: 22,
            name: "ICP Hub".to_string(),
            region: "Singapore".to_string(),
        },
        IcpHub {
            id: 23,
            name: "ICP Hub".to_string(),
            region: "South Africa".to_string(),
        },
        IcpHub {
            id: 24,
            name: "ICP Hub".to_string(),
            region: "Thailand".to_string(),
        },
        IcpHub {
            id: 25,
            name: "ICP Hub".to_string(),
            region: "Turkiye".to_string(),
        },
        IcpHub {
            id: 26,
            name: "ICP Hub".to_string(),
            region: "UAE".to_string(),
        },
        IcpHub {
            id: 27,
            name: "ICP Hub".to_string(),
            region: "USA".to_string(),
        },
        IcpHub {
            id: 28,
            name: "ICP Hub".to_string(),
            region: "Vietnam".to_string(),
        },
        IcpHub {
            id: 29,
            name: "ICP Hub".to_string(),
            region: "West Africa".to_string(),
        },
        // Add any other Hubs from the images provided
    ]
}
