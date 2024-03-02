pub(crate) use std::collections::HashMap;
use ic_cdk::export::Principal;
use std::cell::RefCell;
use std::rc::Rc;

use crate::mentor::AreaOfExpertise;


#[derive(Debug, Default)]
pub struct TrieNode {
    children: HashMap<char, TrieNode>,
    mentor_principals: Vec<Principal>,
}

impl TrieNode {
    fn new() -> Self {
        TrieNode {
            children: HashMap::new(),
            mentor_principals: Vec::new(),
        }
    }
}


#[derive(Debug, Default)]
pub struct Trie {
   pub root: TrieNode,
}

impl Trie {
    fn new() -> Self {
        Trie {
            root: TrieNode::new(),
        }
    }

    
    pub fn insert(&mut self, keyword: &str, mentor_principal: Principal) {
        let mut node = &mut self.root;
        for c in keyword.chars() {
            node = node.children.entry(c).or_insert_with(TrieNode::new);
        }
        node.mentor_principals.push(mentor_principal);
    }

    
    pub fn search(&self, keyword: &str) -> Vec<Principal> {
        let mut node = &self.root;
        for c in keyword.chars() {
            if let Some(n) = node.children.get(&c) {
                node = n;
            } else {
                return Vec::new(); 
            }
        }
        node.mentor_principals.clone()
    }
}


thread_local! {
    pub static EXPERTISE_TRIE: RefCell<Trie> = RefCell::new(Trie::new());
}

pub fn expertise_to_str(expertise: &AreaOfExpertise) -> String {
    match expertise {
        AreaOfExpertise::DeFi => "DeFi".to_string(),
        AreaOfExpertise::Tooling => "Tooling".to_string(),
        AreaOfExpertise::NFTs => "NFTs".to_string(),
        AreaOfExpertise::Infrastructure => "Infrastructure".to_string(),
        AreaOfExpertise::DAO => "DAO".to_string(),
        AreaOfExpertise::Social => "Social".to_string(),
        AreaOfExpertise::Games => "Games".to_string(),
        AreaOfExpertise::Other(s) => s.clone(),
        AreaOfExpertise::MetaVerse => "MetaVerse".to_string(),
    }
}
