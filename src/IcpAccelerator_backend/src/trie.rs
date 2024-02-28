pub(crate) use std::{collections::HashMap, cell::RefCell, rc::Rc};

#[derive(Debug, Default)]
pub struct TrieNode {
    children: HashMap<char, Rc<RefCell<TrieNode>>>,
    is_end_of_word: bool,
    mentor_ids: Vec<String>,
}

impl TrieNode {
    fn new() -> Self {
        TrieNode::default()
    }
}

#[derive(Debug, Default)]
pub struct Trie {
    root: Rc<RefCell<TrieNode>>,
}

thread_local! {
    pub static EXPERTISE_TRIE: RefCell<Trie> = RefCell::new(Trie::new());
}

impl Trie {
    pub fn new() -> Self {
        Trie::default()
    }

    pub fn insert_with_id(&self, word: &str, mentor_id: String) {
        let mut current_node = Rc::clone(&self.root);
        for character in word.chars() {
            let next_node_opt = {
                let borrowed_node = current_node.borrow();
                borrowed_node.children.get(&character).map(Rc::clone)
            };

            let next_node = if let Some(node) = next_node_opt {
                node
            } else {
                let new_node = Rc::new(RefCell::new(TrieNode::new()));
                current_node.borrow_mut().children.insert(character, Rc::clone(&new_node));
                new_node
            };

            current_node = next_node;
        }

        let mut node = current_node.borrow_mut();
        node.is_end_of_word = true;
        node.mentor_ids.push(mentor_id);
    }

    pub fn search(&self, prefix: &str) -> Vec<String> {
        let mut current_node = Rc::clone(&self.root);
        for character in prefix.chars() {
            let temp_node; 
            if let Some(node) = current_node.borrow().children.get(&character) {
                temp_node = Rc::clone(node);
            } else {
                return Vec::new();
            }
            current_node = temp_node; 
        }
        self.collect_mentor_ids(&current_node)
    }

    pub fn collect_mentor_ids(&self, node: &Rc<RefCell<TrieNode>>) -> Vec<String> {
        let node = node.borrow();
        let mut ids = Vec::new();

        if node.is_end_of_word {
            ids.extend(node.mentor_ids.clone());
        }

        for child_node in node.children.values() {
            ids.extend(self.collect_mentor_ids(child_node));
        }

        ids
    }
}
