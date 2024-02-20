use candid::{CandidType, Deserialize};
use ic_cdk_macros::{query, update};
use serde::Serialize;
use std::collections::HashMap;
use std::fmt::Display;

use crate::project_registration::AreaOfFocus;


#[derive(Clone, Serialize, Deserialize, CandidType)]
pub struct TrieNode {
    children: HashMap<String, TrieNode>, 
    is_end_of_word: bool,
    ids: Vec<String>,
}

impl Default for TrieNode {
    fn default() -> Self {
        TrieNode {
            children: HashMap::new(),
            is_end_of_word: false,
            ids: Vec::new(),
        }
    }
}

#[derive(Clone, Serialize, Deserialize, CandidType, Default)]
pub struct Trie {
    root: TrieNode,
}

impl Trie {
    pub fn new() -> Self {
        Trie {
            root: TrieNode::default(),
        }
    }

    pub fn insert(&mut self, word: &str, id: String) {
        let mut current_node = &mut self.root;
        for c in word.chars() {
            let c_str = c.to_string(); // Convert char to String
            current_node = current_node.children.entry(c_str).or_insert_with(TrieNode::default);
        }
        current_node.is_end_of_word = true;
        current_node.ids.push(id);
    }

    pub fn search(&self, word: AreaOfFocus) -> Vec<String> {
        let mut current_node = &self.root;
        for c in word {
            let c_str = c.to_string(); // Convert char to String
            if let Some(node) = current_node.children.get(&c_str) {
                current_node = node;
            } else {
                return Vec::new();
            }
        }
        current_node.ids.clone()
    }
}

#[update]
fn insert(word: String, id: String) {
     ic_kit::ic::with_mut::<Trie, _, _>(|trie: &mut Trie| {
        trie.insert(&word, id);
    });
}

#[query]
fn search(word: AreaOfFocus) -> Vec<String> {
    let mut result = Vec::new();
    ic_kit::ic::with::<Trie, _, _>(|trie| {
        result = trie.search(&word);
    });
    result
}